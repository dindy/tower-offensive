import * as createjs from 'createjs-module'
import Building from '../Building'
import Bullet from '../Bullet'

export default class Tower extends Building {
    
    constructor(level) {
        
        super(level)

        this.range = 150
        this.rangeShape = null
        this.fireRate =  250 // temps en ms entre chaque tir
        this.timeSinceLastShot = Infinity
        this.bullets = []
    }

    highlightRange = (coords, layer) => {
        
        if(this.rangeShape == null) this.initRangeShape(layer)

        this.rangeShape.alpha = 1
        this.rangeShape.x = coords.x
        this.rangeShape.y = coords.y

    }

    removeRangeHighlight = () => {
        this.rangeShape.alpha = 0
    }
    
    initRangeShape = (layer) => {

        const g = new createjs.Graphics()
            .setStrokeStyle(1)
            .beginStroke(createjs.Graphics.getRGB(0,0,0))
            .beginFill(createjs.Graphics.getRGB(120,120,0,.6))
            .drawCircle(0,0, this.range)

        this.rangeShape = new createjs.Shape(g)
        
        layer.addChild(this.rangeShape)
    }

    place(cell) {

        super.place(cell)

        this.removeRangeHighlight()
    }

    isInRange(enemy) {
        
        const dist_points = (enemy.x - this.rangeShape.x) * (enemy.x - this.rangeShape.x) + (enemy.y - this.rangeShape.y) * (enemy.y - this.rangeShape.y);
        const r = this.range * this.range
        
        return dist_points < r
    }

    shoot(enemy) {
        
        if (this.timeSinceLastShot >= this.fireRate) {
            this.timeSinceLastShot = 0
            this.bullets.push(new Bullet(this, enemy))
        }
    }

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

    render(layer) {
        super.render()
    }

    renderBullets(layer) {

        for (let i = 0; i < this.bullets.length; i++) {
            const bullet = this.bullets[i];
            bullet.render(layer)
        } 

        this.bullets = this.bullets.filter(bullet => !bullet.isDeleted) 
    }
}