import Building from './Building'
import Sprite from '../Sprite'
import Techtree from '../Techtree'
import { 
    angle, 
    angleDifference, 
    angleDirection, 
    pointIntersectsCircle,
    degreesToRadians,
} from "../utilities"

export default class Tower extends Building {
    
    /**
     * 
     * @param {Instance} level - L'instance en cours de la class Level
     */
    constructor(level, range) {
        
        super(level)

        // Portée de la tour
        this.range = range

        // Coordonnées du point central de la forme représentant la portée de la tour
        // Utile si la tour n'a pas encoré été placée et n'a donc pas de coordonnées
        this.rangeShapeCoords = null

        // Indique si la portée de la tour est en surbrillance
        this.highlightedRange = false
        
        // Temps écoulé depuis le dernier tir
        this.timeSinceLastShot = Infinity

        this.isShooting = false

        // Sprite de la base
        this.spriteBuilding = new Sprite(50, 50, {
            idle: { sourceY: 0, nbFrames: 1, interval: 0  }
        }) 

    }

    getDammageModifier() {
        return Techtree.getTechModifiersByNames(['globalDammage'])
    }
    select() {
        super.select()
        this.highlightRange(this.getMiddlePosition())
    }
    
    unselect() {
        super.unselect()
        this.removeRangeHighlight()
    }

    /**
     * Rend visible la shape représentant la range de la tour et la center sur coords
     * @param {Object} coords Coordonnées de la cellules
     * @param {Obecjt} layer Canvas layer pour le rendu
     */
    highlightRange(coords) {
        this.rangeShapeCoords = coords
        this.highlightedRange = true        
    }

    /**
     * Cache la shape représentant la range de la tour
     */
    removeRangeHighlight() {
        this.highlightedRange = false
    }

    /**
     * Place le batiment sur la cell
     * @param {Object} cell 
     */
    place(cell) {

        super.place(cell)

        this.removeRangeHighlight()
    }

    /**
     * Check si l'enemy est dans la range de la tower
     * @param {Object} enemy 
     * @returns {boolean}
     */
    isInRange(enemy) {
        return pointIntersectsCircle(enemy.getMiddlePosition(), this.rangeShapeCoords, this.range)
    }

    /**
     * Tire sur l'enemy selectionné. Doit être implémenté par la classe enfant.
     * @param {Object} enemy 
     */
    shoot() {
        this.timeSinceLastShot = 0
        this.isShooting = true
    }

    /**
     * Rendu de la zone représenetant la range de la tower
     * @param {DOMElement} layer 
     */
    renderRangeHighlight(layer) {

        if (this.highlightedRange) {
            layer.beginPath()
            layer.arc(this.rangeShapeCoords.x, this.rangeShapeCoords.y, this.range, 0, 2 * Math.PI)
            layer.lineWidth = 2
            layer.fillStyle = "rgba(200, 200, 200, 0.5)"
            layer.strokeStyle = "rgba(200, 200, 200, 0.8)"
            layer.fill()
            layer.stroke()
            
            if(typeof this.minRange !== "undefined") {
                layer.globalCompositeOperation = 'destination-out'
                layer.beginPath()
                layer.arc(this.rangeShapeCoords.x, this.rangeShapeCoords.y, this.minRange, 0, 2 * Math.PI)
                layer.fillStyle = "rgba(245, 90, 70, 1)"
                layer.strokeStyle = "rgba(200, 200, 200, 0.8)"
                layer.fill()
                layer.globalCompositeOperation = 'source-over'
                layer.beginPath()
                layer.arc(this.rangeShapeCoords.x, this.rangeShapeCoords.y, this.minRange, 0, 2 * Math.PI)
                layer.strokeStyle = "rgba(200, 200, 200, 0.8)"
                layer.stroke()
            }
            // Nettoie la zone de la cellule du batiment pour donner l'impression
            // que la forme de la range est en dessous de la tower
            // @todo Dynamically determines the zone
            const coords = this.isPlaced ? 
                this.getTopLeftPosition() :
                { x: this.rangeShapeCoords.x - (50 / 2), y: this.rangeShapeCoords.y - (50 / 2) }
            
            layer.clearRect(coords.x, coords.y, 50, 50)
        }
    }

    update(diffTimestamp) {
        super.update(diffTimestamp)
    }
    
    render(layer, diffTimestamp) {
        super.render(layer, diffTimestamp)
    }

    renderAttack(layer, diffTimestamp) {
        // void
    }
}