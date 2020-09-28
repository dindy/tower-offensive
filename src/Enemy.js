import * as util from "./utilities"
import Sprite from './Sprite'
import * as traits from './traits'
import Rectangle from './abstract/Rectangle'
import Vector from "./abstract/Vector"

export default class Enemy extends Rectangle {

    static width = 16
    static healthMax = 15
    static socialValue = 10

    pathSegments = []

    /**
     * Enemy constructor
     * @param {Level} level
     */
    constructor(level, x, y) {
        
        super(x, y, Enemy.width)

        this.health = Enemy.healthMax

        this.socialValue = Enemy.socialValue

        // Objet level auquel appartient l'enemy
        this.level = level
        
        // Object de l'enemy contenant les 3 points qui définissent le chemin 
        // qu'il est en train de suivre
        this.defaultPathSegments = level.game.scene.pathPoints
        
        const from = level.config.map.from
        this.angle = from == 'top' ? 90 : from == 'bottom' ? 270 : from == 'left' ? 180 : 0
        
        // Px / ms parcourus par l'enemy
        this.defaultSpeed = 0.07
        this.speed = 0.07
  
        // Indique si l'enemy est sur le retour du chemin
        this.isBack = false
        
        // Indique si l'enemy doit être supprimé
        this.isDeleted = false
        
        // L'enemy est en train de parcourir la dernière cellule de l'aller du chemin
        this.isTurning = false
        
        // L'enemy a fait demi-tour
        this.hasTurned = false

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
        this.currentSegmentIndex = 0
        
        // Initialise le tableau des segments que doit suive l'ennemi en fonction du path
        this.pathRadius = this.level.game.scene.pathRadius
        this.setPathSegments()

    }
    
    setPathSegments() {
        
        for(let i = 0; i < this.defaultPathSegments.length ; i++) {

            let varX = 0, varY = 0

            const segment = this.defaultPathSegments[i]
            const origin = Vector.createFrom(segment[0])
            const destination = Vector.createFrom(segment[1])
            const angle = origin.getAngle(destination, true)

            const pathRadiusMax = (this.pathRadius / 2) - 5
        
            if (angle == 90 || angle == 270) {
                varX = util.randomBetween(-1 * pathRadiusMax, pathRadiusMax)
            } else {
                varY = util.randomBetween(-1 * pathRadiusMax, pathRadiusMax)
            }         
            
            const variation = new Vector(varX, varY)
            const newSegment = [ origin.add(variation), destination.add(variation) ]

            this.pathSegments.push(newSegment)
        }
    }

    getPredictedPosition() {
        
        const radians = util.degreesToRadians(this.angle)
        const predictedPosition = this
            .getMiddlePosition()
            .addPolarCoordinates(25, radians)

        return predictedPosition        
    }

    getScalarProjection(pathSegmentsIndex, predictedPosition, inverted = false) {
        
        let i = 1, j = 0

        if (inverted) {
            i = 0
            j = 1
        } 
        const ao1 = this.pathSegments[pathSegmentsIndex][i]
        const bo1 = this.pathSegments[pathSegmentsIndex][j];
        const point = util.getScalarProjectionPoint(ao1, predictedPosition, bo1) // coords     
        
        return Vector.createFrom(point) 
    }
    
    moveToward(targetAngle, diffTimestamp) {
        
        const rotationMax = 5
        
        // On calcule la différence d'angle entre l'angle de l'enemy et celui nécessaire pour atteindre la cible 
        // sur une échelle de [0, 180]
        let degreesDifference = util.angleDifference(this.angle, targetAngle)
        
        // On calcule le sens de rotation optimum pour atteindre la cible
        const direction = util.angleDirection(this.angle, targetAngle)  
        
        if (degreesDifference > rotationMax) {
            this.angle = this.angle + (rotationMax * direction)
            if(this.angle < 0) this.angle = 360 + (rotationMax * direction)
            if(this.angle > 360) this.angle = this.angle - 360
        }
        else {
            this.angle = targetAngle
        }

        const distance = this.speed * diffTimestamp
        const radians = util.degreesToRadians(this.angle)

        this.addToPosition(Vector.addPolarCoordinates(distance, radians))
    }

    // Find next segment index (sauf pour le dernier...)
    getNextSegmentIndex(sp1) {

        let nextSegmentIndex
        
        if (!this.isBack) {
            if (this.currentSegmentIndex === this.pathSegments.length - 1) nextSegmentIndex = null
            else nextSegmentIndex = this.currentSegmentIndex + 1
        } else {
            this.isTurning = false
            if (this.currentSegmentIndex === 0) nextSegmentIndex = null
            else nextSegmentIndex = this.currentSegmentIndex - 1
        }  
        
        if (nextSegmentIndex == null) {
            
            if (!this.isTurning) {
                const endOfPathPoint = this.pathSegments[this.currentSegmentIndex][1]
                const endOfPath = Vector.createFrom(endOfPathPoint)
                const distance = sp1.getDistance(endOfPath)

                if(distance < 1) {
                    this.isTurning = true
                    this.isBack = true
                    const segment = this.pathSegments[this.currentSegmentIndex]
                    const to = Vector.createFrom(segment[0])
                    const from = Vector.createFrom(segment[1])
                    this.angle = from.getAngle(to, true)
                } else {
                    nextSegmentIndex = this.currentSegmentIndex
                }
            } else {        
                nextSegmentIndex = this.currentSegmentIndex
            } 
        }
        
        return nextSegmentIndex         
    }

    /**
     * Gère la position de l'enemy
     * @param {number} diffTimestamp 
     */
    updatePosition(diffTimestamp) {

        // Projection du vecteur de l'enemy
        const predictedPosition = this.getPredictedPosition()

        // Scalar Projection de la position predite de enemy sur le segment actuel
        const sp1 = this.getScalarProjection(this.currentSegmentIndex, predictedPosition, this.isBack)
        
        // Distance entre la position predite et la projection scalaire
        const d1 = predictedPosition.getDistance(sp1) 
        
        // On détermine le prochain segment (null si on est sur le dernier segment à l'aller, 1er segment si sur dernier segment au retour)
        let nextSegmentIndex = this.getNextSegmentIndex(sp1)
        
        if (nextSegmentIndex === null) return
        
        // Scalar Projection de la position predite de enemy sur le prochain segment
        const sp2 = this.getScalarProjection(nextSegmentIndex, predictedPosition, this.isBack)

        // Distance entre la position predite et la projection scalaire
        const d2 = predictedPosition.getDistance(sp2) 
        
        let segmentDistance = null
        
        // Compare les deux distances pour trouver le segment le plus proche
        // Le prochain segment est plus proche ou on passe à proximité
        if (d2 < d1 || d2 < 1) {
            this.currentSegmentIndex = nextSegmentIndex
            segmentDistance = d2
            // Update la projection scalaire selectionnée
            this.sp = sp2

        // Le segment actuel est le plus proche
        } else {
            segmentDistance = d1
            this.sp = sp1
        }
        const pathSegment = this.pathSegments[this.currentSegmentIndex]

        // Angle entre les deux extrémitées du segment
        const point1Index = this.isBack ? 1 : 0
        const point2Index = this.isBack ? 0 : 1
        const v1 = Vector.createFrom(pathSegment[point1Index])
        const v2 = Vector.createFrom(pathSegment[point2Index])
        const projAngle = v1.getAngle(v2)
        
        // On ajoute une valeur à la projection scalaire sur le segment actuel 
        const spProj = this.sp.addPolarCoordinates(25, projAngle)
        
        // Check si l'enemy reste dans le radius
        const position = this.getMiddlePosition()
        const newAngle = position.getAngle(spProj, true)
        this.moveToward(newAngle, diffTimestamp)
    }

    updateSpeed() {
        this.speed = this.defaultSpeed
    }

    updateDirection() {
        let newDirection 
        if(this.angle > 0 && this.angle < 45 || this.angle > 315 && this.angle < 360) newDirection = "right"
        else if (this.angle > 135 && this.angle < 225) newDirection = "left"
        else if (this.angle >= 45 && this.angle <= 135) newDirection = "down"
        else newDirection = "up"

        if (this.currentDirection !== newDirection) {
            this.currentDirection = newDirection
            this.hasTurned = true
        }
    }

    /**
     * Actualise l'état de l'enemy
     * @param {number} diffTimestamp 
     */
    update(diffTimestamp) {
        this.hasTurned = false
        this.updatePosition(diffTimestamp)
        this.updateDirection(diffTimestamp)
        this.updatePocket()
        this.updateSpeed()
        this.updateIsDeleted()
    } 

    updateIsDeleted() {

        const position = this.getMiddlePosition()

        if (position.x < 0 || position.y < 0) this.isDeleted = true
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
            const middleCoords = this.getMiddlePosition()
            const x = Math.round(middleCoords.x)
            const y = Math.round(middleCoords.y)
            const w = this.width
            const h = this.height

            // Render image   
            if (this.isTurning || this.hasTurned) this.sprite.setState(this.currentDirection)
            this.sprite.setNextState(this.currentDirection)
            this.sprite.setTimerDiff(diffTimestamp)
            layer.translate(x, y)
            layer.drawImage(this.image, ...this.sprite.getCurrent())
            layer.setTransform(1, 0, 0, 1, 0, 0);
            
            if(this.health !== this.constructor.healthMax){

                const healthWidth = w
                const healthHeight = h / 6
                const healthX = x - (w / 2)
                const healthY = y - (h / 2) - 5
    
                layer.beginPath()
                layer.rect(healthX, healthY, healthWidth, healthHeight)
                layer.fillStyle = "green"
                layer.fill()
                
                const lostHealth = Enemy.healthMax - this.health
                const lostHealthWidth = (w * lostHealth) / Enemy.healthMax
                
                layer.beginPath()
                layer.rect(healthX + (healthWidth - lostHealthWidth), healthY, lostHealthWidth, healthHeight)
                layer.fillStyle = "red"
                layer.fill()

            }
        }
        
        super.render(layer, diffTimestamp)
    }

    /**
     * Met a jour la vie de l'enemy en fonction de dommage effectué et prépare le delet en cas de mort
     * Appelé par la class Bullet lors d'une collision avec l'enemy
     * @param {Number} damage
     */
    hit(damage) {

        this.health -= damage
        
        if (this.health <= 0) {
            
            const coords = this.getMiddlePosition()

            this.level.addSocialPoints(this.socialValue)
            this.level.addFloatingTextAnimation('+' + this.socialValue, coords.x, coords.y, "61, 87, 255")
            
            const backValue = this.pocket * this.penalty
            if (backValue > 0) {
                this.level.takeBackValue(backValue)
                this.level.addFloatingTextAnimation('+' + backValue, coords.x, coords.y + 15, "250, 221, 107")
            }
            
            this.isDeleted = true
        }
    }

    slow(factor){
        
        this.speed = this.speed / factor
    }
}