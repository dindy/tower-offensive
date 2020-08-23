import * as utilities from "./utilities"
import Sprite from './Sprite'

export default class Enemy {
    
    /**
     * Enemy constructor
     * @param {Level} level
     */
    constructor(level) {
        
        // Center point is the reference for enemy
        this.x = null
        this.y = null

        this.width = 16
        this.height = this.width
        
        this.health = 15

        // Objet level auquel appartient l'enemy
        this.level = level
        
        // Object de l'enemy contenant les 3 points qui définissent le chemin 
        // qu'il est en train de suivre
        this.path = null

        // Offset en px par rapport à l'origine de la cellule (x ou y)
        this.offset = 0

        // Px / ms parcourus par l'enemyi
        this.speed = 0.07

        // Index de la cellule sur laquelle est l'enemy
        this.currentCellIndex = null

        // Indique si l'enemy est sur le retour du chemin
        this.isBack = false

        // Indique si l'enemy doit être supprimé
        this.isDeleted = false

        // L'enemy est en train de parcourir la dernière cellule de l'aller du chemin
        this.isTurning = false

        // L'enemy est en train de parcourir la dernière cellule du retour du chemin
        this.isExiting = false    

        // Profondeur des poches d'un enemy
        this.pocketCapacity = 80
        
        // Valeur volée par l'enemy
        this.pocket = 0

        // Ratio de valeur rendue si l'enemy meurt
        this.penalty = 0.8

        // Load the image of the enemy
        this.image = document.getElementById(level.game.DOMConfig.sprites.enemy)
        this.sprite = new Sprite(50, 50, {
            down : { sourceY: 0, nbFrames: 4, interval: 80 },
            up : { sourceY: 50, nbFrames: 4, interval: 80 },
            right : { sourceY: 100, nbFrames: 4, interval: 80 },
            left : { sourceY: 150, nbFrames: 4, interval: 80 }
        })

        // Indique l'orientation de l'ennemi pour rendre le bon sprite
        this.currentDirection = null

        this.isHighlighted = false
    }

    updatePathAndMove(diffTimestamp) {

        // S'il n'y a pas de chemin calculé 
        // (si c'est le 1er appel ou si le précédent chemin a été entièrement parcouru)
        if (!this.hasCurrentPath()) {

            // On calcule le prochain chemin
            this.updatePathCoordinates()
        }

        // On se déplace le long du chemin
        this.moveAlongPath(diffTimestamp)
    }

    /**
     * Gère la position de l'enemy
     * @param {number} diffTimestamp 
     */
    updatePosition(diffTimestamp) {
        
        this.updatePathAndMove(diffTimestamp)
    }

    /**
     * Actualise l'état de l'enemy
     * @param {number} diffTimestamp 
     */
    update(diffTimestamp) {
        this.updatePosition(diffTimestamp)
        this.updatePocket()
    } 

    updatePocket() {
        if (this.isTurning && this.pocket === 0) {
            this.level.stealValue(this.pocketCapacity)
            this.pocket = this.pocketCapacity
            
        }
    }

    /**
     * Gère le rendu de l'enemy
     * @param {Layer} layer sur lequel on rend l'enemy  
     */
    render(layer, diffTimestamp) {
        
        if (!this.isDeleted) {
            
            // Get new enemy position
            // @info Use Math.round to prevent browser anti-aliasing (better performances but not very smooth moving)
            const x = Math.round(this.x)
            const y = Math.round(this.y)

            // Render image   
            this.sprite.setNextState(this.currentDirection)
            this.sprite.setTimerDiff(diffTimestamp)
            layer.translate(x, y)
            layer.drawImage(this.image, ...this.sprite.getCurrent())
            layer.setTransform(1, 0, 0, 1, 0, 0);

            // Render simple drawing
            // layer.beginPath()
            // layer.rect(x, y, this.width, this.height)
            // layer.fillStyle = "red"
            // layer.fill()

            // Debug bounding box
            if (this.isHighlighted) {
                const bb = this.getBoundingBox()
                layer.beginPath()
                layer.rect(bb.xMin, bb.yMin, bb.xMax - bb.xMin, bb.yMax - bb.yMin)
                layer.strokeStyle = 'red'
                layer.stroke()

            }
        }
    }

    /**
     * Gère le chemin parcouru par l'enemy sur la case courante
     */
    updatePathCoordinates() {

        // Update currentCellIndex
        this.updateCurrentCellIndex()

        // Get cells
        let cell = this.getCellFromCurrentIndex()
        let nextCell = this.getNextCellFromCurrentIndex()
        let previousCell = this.getPreviousCellFromCurrentIndex()

        // Last cell on forward
        if (this.willTurnAround()) {
            this.isTurning = true
            this.updateTurningPathCoordinates(cell, previousCell)

        // Last cell on backward
        } else if (this.willExit()) {
            this.isExiting = true
            this.updateExitingPathCoordinates(cell, previousCell)

        // Other cells
        } else this.updateNormalPathCoordinates(cell, nextCell, previousCell) 

        
    }

    /**
     * Met à jour les coordonnées de l'enemy en suivant le pathfinding calculé
     * @param {number} diffTimestamp 
     */
    moveAlongPath(diffTimestamp) {

        // Update time passed in a cell
        this.path.time += diffTimestamp

        // Calculate target time to passed in a cell
        this.path.totalTime = this.level.game.scene.cellSize / this.speed

        // Update t (la proportion de la courbe parcourue de 0 à 1)
        let t = this.path.time / this.path.totalTime

        // Save the current direction
        this.currentDirection = t < 0.5 ? 
            this.path.firstDirection : 
            this.path.secondDirection

        // update coordinates with t
        let newCoords = null 
        const p1 = this.path.originPoint
        const p2 = this.path.middlePoint 
        const p3 = this.path.endPoint

        // Si on a parcouru toute la courbe, on s'assure d'être exactment 
        // sur le dernier point et on met à jour les propriétés de l'enemy
        if (t >= 1) {

            // t vaut au maximum 1
            t = 1
            
            // Si on était sur un exit, on doit supprimer l'entité 
            if (this.isExiting) this.isDeleted = true

            // Si on était en train de tourner, on est sur le retour et on ne tourne plus
            if (this.isTurning) {
                this.isBack = true
                this.isTurning = false
            }            
        }

        // Update t in enemy's path
        this.path.t = t

        // On calcule les nouvelles coordonnées en fonction de t
        newCoords = utilities.getBezierPoint(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y, t)
        
        // Update le x et y de l'enemy
        this.x = newCoords.x
        this.y = newCoords.y
        
        // On efface le chemin courant si on est au bout
        if (t === 1) this.removeCurrentPathCoordinates() 
    }

    /**
     * Met à jour l'index courant de la cellule
     */    
    updateCurrentCellIndex() {

        // Check si c'est la 1er fois et selectionne la 1ere celulle du path
        if (this.currentCellIndex == null) {
            this.currentCellIndex = 0
        
        // Sinon si on est sur l'aller sélectionne la cell suivante
        } else if (!this.isBack) {
            this.currentCellIndex++ 
        
        // Sinon si on est sur le retour sélectionne la cell précédente
        } else {
            this.currentCellIndex--
        }
    }

    /**
     * Retourne l'objet cell en fonction de index
     * @param {number} index 
     */
    getCellFromIndex(index) {

        return this.level.config.map.path
            .map(cellIndex => this.level.game.scene.gridCells[cellIndex])  
            [index]
    } 

    /**
     * Retourne l'objet cell 
     */
    getCellFromCurrentIndex()  {
        return this.getCellFromIndex(this.currentCellIndex)
    }

    /**
     * Retourne la prochaine cell du tableau
     */
    getNextCellFromCurrentIndex() {
        const nextCellIndex = (this.isBack) ? this.currentCellIndex - 1 : this.currentCellIndex + 1 
        return this.getCellFromIndex(nextCellIndex)
    }

    /**
     * Retourne la cell précédente du tableau
     */
    getPreviousCellFromCurrentIndex() {
        const previousCellIndex = (this.isBack) ? this.currentCellIndex + 1 : this.currentCellIndex - 1 
        return this.getCellFromIndex(previousCellIndex)
    }

    /**
     * Retourne True si l'ennemi va faire demi-tour après la cellule en cours
     */
    willTurnAround() {
        return typeof this.getNextCellFromCurrentIndex() === "undefined" && !this.isBack
    }

    /**
     * Retourne True si l'enemy va sortir de la map après la cellule en cours
     */
    willExit() {
        return typeof this.getNextCellFromCurrentIndex() === "undefined" && this.isBack
    } 

    /**
     * Calcul et met a jour les coordonnées pour le virage
     * @param {Cell} cell 
     * @param {Cell} previousCell 
     */
    updateTurningPathCoordinates(cell, previousCell) {
        
        let firstDirection = null 
        let secondDirection = null
        
        // Côté par lequel on arrive 
        const side = cell.getDirection(previousCell)  

        // Points de référence du chemin pour la cellule courante
        const originPoint = { x: this.x, y: this.y }       
        let endPoint = {...originPoint}
        let middlePoint = { }     

        // Calcul des coordonnées des points de référence
        if (side == "up") {
            firstDirection = "down"
            secondDirection = "up"
            middlePoint.x = endPoint.x
            middlePoint.y = originPoint.y + (this.level.game.scene.cellSize)
        } else if (side == "down") {
            firstDirection = "up"
            secondDirection = "down"            
            middlePoint.x = endPoint.x
            middlePoint.y = originPoint.y - (this.level.game.scene.cellSize)
        } else if (side == "left") {
            firstDirection = "right"
            secondDirection = "left"            
            middlePoint.x = endPoint.x + (this.level.game.scene.cellSize)
            middlePoint.y = originPoint.y 
        } else if (side == "right") {
            firstDirection = "left"
            secondDirection = "right"
            middlePoint.x = endPoint.x - (this.level.game.scene.cellSize)
            middlePoint.y = originPoint.y 
        }

        // On met à jour les coordonnées
        this.path = { originPoint, middlePoint, endPoint, time: 0, firstDirection, secondDirection }        
    }

    /**
     * Calcul et met a jour le coordonnées pour la sortie
     * @param {Cell} cell 
     * @param {Cell} previousCell 
     */
    updateExitingPathCoordinates(cell, previousCell) {

        let firstDirection = null 
        let secondDirection = null

        // Côté par lequel on arrive
        const side = cell.getDirection(previousCell)  

        // Points de référence du chemin pour la cellule courante
        const originPoint = { x: this.x, y: this.y }        
        const endPoint = {...originPoint}
        let middlePoint = { }

        // Calcul des coordonnées des points de référence
        if (side == "up") {
            firstDirection = "down"
            secondDirection = "down"            
            endPoint.y += this.level.game.scene.cellSize
            middlePoint.x = endPoint.x
            middlePoint.y = originPoint.y + (this.level.game.scene.cellSize / 2)
        } else if (side == "down") {
            firstDirection = "up"
            secondDirection = "up"             
            endPoint.y = 0
            middlePoint.x = endPoint.x
            middlePoint.y = this.level.game.scene.cellSize / 2
        } else if (side == "left") {
            firstDirection = "right"
            secondDirection = "right"             
            endPoint.x += this.level.game.scene.cellSize
            middlePoint.x = endPoint.x + (this.level.game.scene.cellSize / 2)
            middlePoint.y = originPoint.y 
        } else if (side == "right") {
            firstDirection = "left"
            secondDirection = "left"             
            endPoint.x -= this.level.game.scene.cellSize
            middlePoint.x = endPoint.x - (this.level.game.scene.cellSize / 2)
            middlePoint.y = originPoint.y 
        }

        // On met à jour les coordonnées
        this.path = { originPoint, middlePoint, endPoint, time: 0, firstDirection, secondDirection }        
    }

    /**
     * Calcul et met a jour le coordonnées pour le chemin normal
     * @param {Cell} cell 
     * @param {Cell} nextCell 
     * @param {Cell|undefined} previousCell 
     */
    updateNormalPathCoordinates(cell, nextCell, previousCell) {

        let firstDirection = null
        let secondDirection = null
        
        // Direction entre la cellule courante et la prochaine
        const direction = cell.getDirection(nextCell)

        // Si on est sur la 1ère cellule, side dépend de la direction de départ
        // (de la direction donnée par les 2 premières cellules du path)
        const side = (typeof previousCell === 'undefined' && !this.isBack) ? 
            nextCell.getDirection(cell) :
            cell.getSide(previousCell)

        // Points de référence du chemin pour la cellule courante
        const originPoint = { x: this.x, y: this.y } 
        let middlePoint = { }
        let endPoint = { }

        // Calcul des coordonnées des points de référence
        if (direction === "up") {
            
            secondDirection = "up"

            if (side === "left") {
                firstDirection = "right"
                endPoint.x = nextCell.coords.xMax - this.offset
                endPoint.y = nextCell.coords.yMax
                middlePoint.y = originPoint.y
                middlePoint.x = endPoint.x
            } else if (side === "right") {
                firstDirection = "left"
                endPoint.x = nextCell.coords.xMin + this.offset
                endPoint.y = nextCell.coords.yMax
                middlePoint.y = originPoint.y
                middlePoint.x = endPoint.x
            } else {
                firstDirection = "up"
                endPoint.x = originPoint.x
                endPoint.y = nextCell.coords.yMax
                middlePoint.x = originPoint.x
                middlePoint.y = originPoint.y - (this.level.game.scene.cellSize / 2)
            }

        } else if (direction == "down") {

            secondDirection = "down"

            if (side == "left") {
                firstDirection = "right"
                endPoint.x = nextCell.coords.xMin + this.offset
                endPoint.y = nextCell.coords.yMin
                middlePoint.y = originPoint.y
                middlePoint.x = endPoint.x
            } else if (side == "right") {
                firstDirection = "left"
                endPoint.x = nextCell.coords.xMax - this.offset
                endPoint.y = nextCell.coords.yMin
                middlePoint.x = endPoint.x
                middlePoint.y = originPoint.y
            } else {
                firstDirection = "down"
                endPoint.x = originPoint.x
                endPoint.y = nextCell.coords.yMin
                middlePoint.x = originPoint.x
                middlePoint.y = originPoint.y + (this.level.game.scene.cellSize / 2) 
            }

        } else if (direction == "left") {
            
            secondDirection = "left"
            
            if (side == "up") {
                firstDirection = "down"
                endPoint.x = nextCell.coords.xMax
                endPoint.y = nextCell.coords.yMax - this.offset
                middlePoint.y = endPoint.y
                middlePoint.x = originPoint.x
            } else if (side == "down") {
                firstDirection = "up"
                endPoint.x = nextCell.coords.xMax
                endPoint.y = nextCell.coords.yMin + this.offset
                middlePoint.y = endPoint.y
                middlePoint.x = originPoint.x                 
            } else {
                firstDirection = "left"
                endPoint.x = nextCell.coords.xMax
                endPoint.y = originPoint.y
                middlePoint.x = originPoint.x - (this.level.game.scene.cellSize / 2)
                middlePoint.y = originPoint.y           
            }

        } else if (direction == "right") {

            secondDirection = "right"

            if (side == "up") { 
                firstDirection = "down"
                endPoint.x = nextCell.coords.xMin
                endPoint.y = nextCell.coords.yMin + this.offset
                middlePoint.x = originPoint.x
                middlePoint.y = endPoint.y
            } else if (side == "down") {
                firstDirection = "up"
                endPoint.x = nextCell.coords.xMin
                endPoint.y = nextCell.coords.yMax - this.offset
                middlePoint.x = originPoint.x
                middlePoint.y = endPoint.y
            } else {
                firstDirection = "right"
                endPoint.x = nextCell.coords.xMin
                endPoint.y = originPoint.y
                middlePoint.x = originPoint.x + (this.level.game.scene.cellSize / 2)
                middlePoint.y = originPoint.y  
            }
        }
        
        // On met à jour les coordonnées
        this.path = { originPoint, middlePoint, endPoint, time: 0, firstDirection, secondDirection }    
    }

    /**
     * Met a null les coordonnées enregistrées
     */
    removeCurrentPathCoordinates() {
        return this.path = null
    }

    /**
     * Retourn True si les coordonnées ne sont pas définies
     */
    hasCurrentPath() {
        return this.path !== null
    }

    /**
     * Retourne un objet contenant les coordonnées x et y
     */
    getCoords() {
        return {
            x : this.x,
            y : this.y
        }
    }

    /**
     * Retourne un objet contenant les coordonnées des 4 coins du carré
     */
    getBoundingBox() {
        return {
            xMin: this.x - (this.width / 2),
            xMax: this.x + (this.width / 2),
            yMin: this.y - (this.height / 2),
            yMax: this.y + (this.height / 2)
        }
    }

    /**
     * Met a jour la vie de l'enemy en fonction de dommage effectué et prépare le delet en cas de mort
     * Appelé par la class Bullet lors d'une collision avec l'enemy
     * @param {Number} damage
     */
    hit(damage) {
        this.health -= damage
        if (this.health <= 0) {
            this.isDeleted = true
            this.level.takeBackValue(this.pocket * this.penalty)
            
        }
    }
}