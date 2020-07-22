
import * as createjs from 'createjs-module'
import { getDistance, getPositionOnLine } from './utilities'

export default class Bullet {

    constructor(originPoint, targetPoint) {

        this.originPoint = originPoint

        this.targetPoint = targetPoint

        this.speed = 0.15 // ps/ms
        
        this.shape = null

        this.hasBeenRendered = false
        
        this.coords = originPoint

        this.isDeleted = false

        this.distance = getDistance(originPoint.x, originPoint.y, targetPoint.x, targetPoint.y) // px

        this.timeSpent = 0 // le temps ecoulé depuis le debut de l'animation , ajouter timestamp a chaque update

        this.totalTime = this.distance / this.speed // ms

    }

    

    update(diffTimestamp) {

        // Track le temps passer sur le chemin
        this.timeSpent += diffTimestamp
        let t = this.timeSpent / this.totalTime

        if (t > 1) // Fin du cycle de vie de la balle
            this.isDeleted = true
        else
            this.coords = getPositionOnLine(this.originPoint.x, this.originPoint.y, this.targetPoint.x, this.targetPoint.y, t)
    }

    initRender(layer) {

        const g = new createjs.Graphics()
            .beginFill(createjs.Graphics.getRGB(0,0,0))
            .drawCircle(0, 0, 2, 2)

        this.shape = new createjs.Shape(g)
        
        layer.addChild(this.shape)        
        
        this.hasBeenRendered = true
    }

    render(layer) {

        if (!this.hasBeenRendered) this.initRender(layer)

        if (this.isDeleted) layer.removeChild(this.shape)
        
        this.shape.x = this.coords.x
        this.shape.y = this.coords.y

    }


}