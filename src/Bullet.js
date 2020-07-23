
import * as createjs from 'createjs-module'
import { getDistance, getPositionOnLine } from './utilities'

export default class Bullet {

    constructor(originPoint, targetPoint, range) {

        // Centre de La tour et point d'origine des balles
        this.originPoint = originPoint

        //Coordonnées de l'enemy
        this.targetPoint = targetPoint

        this.speed = 0.50 // ps/ms
        
        this.shape = null

        this.hasBeenRendered = false
        
        this.coords = originPoint

        this.isDeleted = false

        // Distance entre les coordonnées de départ et de destination en px
        this.distance = getDistance(originPoint.x, originPoint.y, targetPoint.x, targetPoint.y) 

        // Rapport entre les coordonnées de depart et destination et la range de le tower
        this.coef = this.distance / range

        // Temps ecoulé depuis le debut de l'animation , ajouter timestamp a chaque update
        this.timeSpent = 0 

        this.totalTime = range / this.speed 

    }

    update(diffTimestamp) {
        
        // Track le temps passé sur le chemin
        this.timeSpent += diffTimestamp
        
        // Rapport entre le temps écoulé et le temps total jusqu'au point de destination 
        // ramené à la range de la tower (donc 1 / this.coef = valeur finale de t)
        let t = (this.timeSpent / this.totalTime) / this.coef

        // Fin du cycle de vie de la balle (donc timeSpent / totalSpent = 1)
        if (t * this.coef >= 1) { 
            this.isDeleted = true // suppression à la prochaine frame
            t = 1 / this.coef // On met t à sa valeur max
        } 

        // Update les coordonnées de la balle
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

        // Si n'a pas encore été render
        if (!this.hasBeenRendered) this.initRender(layer)

        // Si doit être suprimé
        if (this.isDeleted) layer.removeChild(this.shape)
        
        // Sinon update position
        this.shape.x = this.coords.x
        this.shape.y = this.coords.y

    }


}