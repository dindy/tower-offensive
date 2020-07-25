import * as createjs from 'createjs-module'
import Building from '../Building'
import Bullet from '../Bullet'

export default class Tower extends Building {
    
    /**
     * 
     * @param {Instance} level - L'instance en cours de la class Level
     */
    constructor(level) {
        
        super(level)

        this.range = 150
        this.rangeShape = null
        this.rangeShapeCoords = null
        this.fireRate =  250 // temps en ms entre chaque tir
        this.timeSinceLastShot = Infinity
        this.bullets = []
        this.highlightedRange = false 
        
    }

    select() {
        super.select()
        this.highlightRange(this.cell.getCenterPoint())
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
    highlightRange = (coords) => {
        this.rangeShapeCoords = coords
        this.highlightedRange = true        
    }

    /**
     * Cache la shape représentant la range de la tour
     */
    removeRangeHighlight = () => {
        this.highlightedRange = false
    }
  
    /**
     * Créer la shape et lui attribut le style pour la visualisation de la range
     * @param {Object} layer Canvas layer pour le rendu
     */
    initRangeShape = (layer) => {

        const g = new createjs.Graphics()
            .setStrokeStyle(1)
            .beginStroke(createjs.Graphics.getRGB(0,0,0))
            .beginFill(createjs.Graphics.getRGB(120,120,0,.6))
            .drawCircle(0,0, this.range)

        this.rangeShape = new createjs.Shape(g)
        
        layer.addChild(this.rangeShape)
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
     */
    isInRange(enemy) {
        
        const dist_points = (enemy.x - this.rangeShapeCoords.x) * (enemy.x - this.rangeShapeCoords.x) + (enemy.y - this.rangeShapeCoords.y) * (enemy.y - this.rangeShapeCoords.y);
        const r = this.range * this.range
        
        return dist_points < r
    }

    /**
     * Tire sur l'enemy selectionné
     * @param {Object} enemy 
     */
    shoot(enemy) {
        
        if (this.timeSinceLastShot >= this.fireRate) {
            this.timeSinceLastShot = 0
            this.bullets.push(new Bullet(this, enemy))
        }
    }

    /**
     * Update les data en fonction du temps passé
     * @param {Float} diffTimestamp 
     */
    update(diffTimestamp) {
        
        super.update()

        const level = this.level
        this.timeSinceLastShot += diffTimestamp

        for (let j = 0; j < level.enemies.length; j++) {
            const enemy = level.enemies[j]
            if (this.isInRange(enemy)) this.shoot(enemy)
        }

        for (let i = 0; i < this.bullets.length; i++) {
            this.bullets[i].update(diffTimestamp)
        }        
    }

    /**
     * Rendu sur le layer de la tower
     * @param {DOMElement} layer 
     */
    render(layer) {
        super.render()
    }

    /**
     * Rendu des balles tirées par la tower
     * @param {DOMElement} layer 
     */
    renderBullets(layer) {

        for (let i = 0; i < this.bullets.length; i++) {
            const bullet = this.bullets[i];
            bullet.render(layer)
        } 

        this.bullets = this.bullets.filter(bullet => !bullet.isDeleted) 
    }

    /**
     * Rendu de la zone représenetant la range de la tower
     * @param {DOMElement} layer 
     */
    renderRangeHighlight(layer) {

        if (this.rangeShape !== null) layer.removeChild(this.rangeShape)
        this.initRangeShape(layer)
        
        if (this.highlightedRange) {
            
            this.rangeShape.alpha = 1
            this.rangeShape.x = this.rangeShapeCoords.x
            this.rangeShape.y = this.rangeShapeCoords.y

        } else {
            this.rangeShape.alpha = 0
        }
    }
}