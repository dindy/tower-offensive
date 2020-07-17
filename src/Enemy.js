import * as createjs from 'createjs-module'
import * as utilities from "./utilities.js"


export default class Enemy {
    
    /**
     * Enemy constructor
     * @param {Level} level
     */
    constructor(level) {
        
        // L'enemy a déjà été rendu une 1ère fois
        this.hasBeenRendered = false

        // Objet level auquel appartient l'enemy
        this.level = level
        
        // Object de l'enemy contenant les 3 points qui définissent le chemin 
        // qu'il est en train de suivre
        this.pathCoordinates = null

        // Offset en px par rapport à l'origine de la cellule (x ou y)
        this.offset = 0

        // Px / ms parcourus par l'enemy
        this.speed = 0.2

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
    }
    
    /**
     * Initie le rendu de l'enemy sur layer. Set une nouvelle shape et l'ajoute à layer.
     * @param {Layer} layer 
     */
    initRender = layer => {
        
        // Create new shape
        this.shape = new createjs.Shape()
            
        this.shape.graphics
            .beginFill('red')
            .drawRect(0, 0, 10, 10)

        // Set rotation point
        this.shape.regX = 5
        this.shape.regY = 5

        // Add shape to layer
        layer.addChild(this.shape)
        
        // Set internal flag
        this.hasBeenRendered = true
    }

    /**
     * Gère la position de l'enemy
     * @param {number} diffTimestamp 
     */
    updatePosition = (diffTimestamp) => {
        
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
     * Actualise l'état de l'enemy
     * @param {number} diffTimestamp 
     */
    update = (diffTimestamp) => {
        this.updatePosition(diffTimestamp)
    } 

    /**
     * Gère le rendu de l'enemy
     * @param {Layer} layer sur lequel on rend l'enemy  
     */
    render = (layer) => {

        // Rend la shape de l'enemy si nécessaire
        if (!this.hasBeenRendered) this.initRender(layer)
        
        // Supprime l'enemy du layer si nécessaire
        if (this.isDeleted) return layer.removeChild(this.shape)
        
        // Place l'enemy selon ses coordonnées
        this.shape.x = this.x
        this.shape.y = this.y
    }

    /**
     * Gère le chemin parcouru par l'enemy sur la case courante
     */
    updatePathCoordinates = () => {

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
    moveAlongPath = diffTimestamp => {

        // Update time passed in a cell
        this.pathCoordinates.time += diffTimestamp

        // Calculate target time to passed in a cell
        this.pathCoordinates.totalTime = this.level.game.cellSize / this.speed

        // Update t (la proportion de la courbe parcourue de 0 à 1)
        let t = this.pathCoordinates.time / this.pathCoordinates.totalTime

        // update coordinates with t
        let newCoords = null 
        const p1 = this.pathCoordinates.originPoint
        const p2 = this.pathCoordinates.middlePoint 
        const p3 = this.pathCoordinates.endPoint
        
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
    updateCurrentCellIndex = () => {

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
    getCellFromIndex = (index) => this.level.config.map.path
        .map(cellIndex => this.level.gridCells[cellIndex])  
        [index]

    /**
     * 
     */
    getCellFromCurrentIndex = () => this.getCellFromIndex(this.currentCellIndex)

    /**
     * 
     */
    getNextCellFromCurrentIndex = () => {
        const nextCellIndex = (this.isBack) ? this.currentCellIndex - 1 : this.currentCellIndex + 1 
        return this.getCellFromIndex(nextCellIndex)
    }

    /**
     * 
     */
    getPreviousCellFromCurrentIndex = () => {
        const previousCellIndex = (this.isBack) ? this.currentCellIndex + 1 : this.currentCellIndex - 1 
        return this.getCellFromIndex(previousCellIndex)
    }

    /**
     * 
     */
    willTurnAround = () => typeof this.getNextCellFromCurrentIndex() === "undefined" && !this.isBack
    
    /**
     * 
     */
    willExit = () => typeof this.getNextCellFromCurrentIndex() === "undefined" && this.isBack

    /**
     * 
     * @param {Cell} cell 
     * @param {Cell} previousCell 
     */
    updateTurningPathCoordinates = (cell, previousCell) => {
        
        // Côté par lequel on arrive 
        const side = cell.getDirection(previousCell)  

        // Points de référence du chemin pour la cellule courante
        const originPoint = { x: this.x, y: this.y }       
        let endPoint = {...originPoint}
        let middlePoint = { }     

        // Calcul des coordonnées des points de référence
        if (side == "up") {
            middlePoint.x = endPoint.x
            middlePoint.y = originPoint.y + (this.level.game.cellSize)
        } else if (side == "down") {
            middlePoint.x = endPoint.x
            middlePoint.y = originPoint.y - (this.level.game.cellSize)
        } else if (side == "left") {
            middlePoint.x = endPoint.x + (this.level.game.cellSize)
            middlePoint.y = originPoint.y 
        } else if (side == "right") {
            middlePoint.x = endPoint.x - (this.level.game.cellSize)
            middlePoint.y = originPoint.y 
        }

        // On met à jour les coordonnées
        this.pathCoordinates = { originPoint, middlePoint, endPoint, time: 0 }        
    }

    /**
     * 
     * @param {Cell} cell 
     * @param {Cell} previousCell 
     */
    updateExitingPathCoordinates = (cell, previousCell) => {

        // Côté par lequel on arrive
        const side = cell.getDirection(previousCell)  

        // Points de référence du chemin pour la cellule courante
        const originPoint = { x: this.x, y: this.y }        
        const endPoint = {...originPoint}
        let middlePoint = { }

        // Calcul des coordonnées des points de référence
        if (side == "up") {
            endPoint.y += this.level.game.cellSize
            middlePoint.x = endPoint.x
            middlePoint.y = originPoint.y + (this.level.game.cellSize / 2)
        } else if (side == "down") {
            endPoint.y = 0
            middlePoint.x = endPoint.x
            middlePoint.y = this.level.game.cellSize / 2
        } else if (side == "left") {
            endPoint.x += this.level.game.cellSize
            middlePoint.x = endPoint.x + (this.level.game.cellSize / 2)
            middlePoint.y = originPoint.y 
        } else if (side == "right") {
            endPoint.x -= this.level.game.cellSize
            middlePoint.x = endPoint.x - (this.level.game.cellSize / 2)
            middlePoint.y = originPoint.y 
        }

        // On met à jour les coordonnées
        this.pathCoordinates = { originPoint, middlePoint, endPoint, time: 0 }        
    }

    /**
     * 
     * @param {Cell} cell 
     * @param {Cell} nextCell 
     * @param {Cell|undefined} previousCell 
     */
    updateNormalPathCoordinates = (cell, nextCell, previousCell) => {

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

            if (side === "left") {
                endPoint.x = nextCell.coords.xMax - this.offset
                endPoint.y = nextCell.coords.yMax
                middlePoint.y = originPoint.y
                middlePoint.x = endPoint.x
            } else if (side === "right") {
                endPoint.x = nextCell.coords.xMin + this.offset
                endPoint.y = nextCell.coords.yMax
                middlePoint.y = originPoint.y
                middlePoint.x = endPoint.x
            } else {
                endPoint.x = originPoint.x
                endPoint.y = nextCell.coords.yMax
                middlePoint.x = originPoint.x
                middlePoint.y = originPoint.y - (this.level.game.cellSize / 2)
            }

        } else if (direction == "down") {

            if (side == "left") {
                endPoint.x = nextCell.coords.xMin + this.offset
                endPoint.y = nextCell.coords.yMin
                middlePoint.y = originPoint.y
                middlePoint.x = endPoint.x
            } else if (side == "right") {
                endPoint.x = nextCell.coords.xMax - this.offset
                endPoint.y = nextCell.coords.yMin
                middlePoint.x = endPoint.x
                middlePoint.y = originPoint.y
            } else {
                endPoint.x = originPoint.x
                endPoint.y = nextCell.coords.yMin
                middlePoint.x = originPoint.x
                middlePoint.y = originPoint.y + (this.level.game.cellSize / 2) 
            }

        } else if (direction == "left") {

            if (side == "up") {
                endPoint.x = nextCell.coords.xMax
                endPoint.y = nextCell.coords.yMax - this.offset
                middlePoint.y = endPoint.y
                middlePoint.x = originPoint.x
            } else if (side == "down") {
                endPoint.x = nextCell.coords.xMax
                endPoint.y = nextCell.coords.yMin + this.offset
                middlePoint.y = endPoint.y
                middlePoint.x = originPoint.x                 
            } else {
                endPoint.x = nextCell.coords.xMax
                endPoint.y = originPoint.y
                middlePoint.x = originPoint.x - (this.level.game.cellSize / 2)
                middlePoint.y = originPoint.y           
            }

        } else if (direction == "right") {
            
            if (side == "up") { 
                endPoint.x = nextCell.coords.xMin
                endPoint.y = nextCell.coords.yMin + this.offset
                middlePoint.x = originPoint.x
                middlePoint.y = endPoint.y
            } else if (side == "down") {
                endPoint.x = nextCell.coords.xMin
                endPoint.y = nextCell.coords.yMax - this.offset
                middlePoint.x = originPoint.x
                middlePoint.y = endPoint.y
            } else {
                endPoint.x = nextCell.coords.xMin
                endPoint.y = originPoint.y
                middlePoint.x = originPoint.x + (this.level.game.cellSize / 2)
                middlePoint.y = originPoint.y  
            }
        }
        
        // On met à jour les coordonnées
        this.pathCoordinates = { originPoint, middlePoint, endPoint, time: 0}    
    }

    /**
     * 
     */
    removeCurrentPathCoordinates = () => this.pathCoordinates = null

    /**
     * 
     */
    hasCurrentPath = () => this.pathCoordinates !== null

}