import Thing from './Thing'
import Vector from './Vector'
import Box from './Box'

/**
 * Une chose qui possède une position dans l'espace
 */
export default class Body extends Thing {

    /**
     * Vecteur représentant la position de l'objet
     * @type {Vector}
     */
    position = null

    /**
     * @constructor Initialise un Body avec des coordonnées
     * @param {Numeric} x 
     * @param {Numeric} y 
     */
    constructor(x, y) {

        super()

        this.position = new Vector(x,y)
    }

    /**
     * Ajoute les composants d'un vecteur à la position actuelle
     * @param {Vector} vector 
     */
    addToPosition(vector) {

        this.position = Vector.add(this.position, vector)
    }    

    /**
     * Remplace la position par vector
     * @param {*} vector 
     */
    setPosition(vector) {

        this.position = vector
    }


    intersectsBox(box) {
        return Box.bordersIntersect(this.getBoundingBox(), box) 
            || Box.pointIsInside(this.getMiddlePosition(), box)
    }

    /**
     * Useful to debug
     * @param {Context} layer 
     */
    render(layer) {
        // this.renderBoundingBox(layer)
        // this.renderMiddlePosition(layer)
        // this.renderTopLeftPosition(layer)
    }

    /**
     * Debug getBoundingBox
     */
    renderBoundingBox(layer) {

        const bb = this.getBoundingBox()
        const x = bb.xMin
        const y = bb.yMin
        const width = bb.xMax - bb.xMin
        const height = bb.yMax - bb.yMin

        layer.beginPath()
        layer.rect(x, y, width, height)
        layer.strokeStyle = 'red'
        layer.lineWidth = 1
        layer.stroke()
    }

    /**
    * Debug getMiddlePosition
    */
    renderMiddlePosition(layer) {

        const {x, y} = this.getMiddlePosition()

        layer.beginPath()
        layer.arc(x, y, 2, 0, 2 * Math.PI)
        layer.fillStyle = 'green'
        layer.fill()
    }

    /**
    * Debug getTopLeftPosition
    */
    renderTopLeftPosition(layer) {

        const {x, y} = this.getTopLeftPosition()

        layer.beginPath()
        layer.arc(x, y, 2, 0, 2 * Math.PI)
        layer.fillStyle = 'blue'
        layer.fill()
    }    
}