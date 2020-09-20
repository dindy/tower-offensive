import { 
    radiansToDegrees, 
    addToPoint, 
    getDistance, 
    getPositionOnLine, 
    rectangleIntersectsRectangle, 
    angle, 
    getProjectionPoint,
    pointIntersectsCircle 
} from '../utilities'

import BigExplosion from '../explosions/BigExplosion'

export default class Rocket {

    firingAngle = null
    /**
     * Constructor 
     * @param {Object} tower La tour d'où les balles sont tirées
     * @param {Object} enemy Cible de la tour
     */
    constructor(tower, enemy, dammage) {

        this.level = tower.level

        // Centre de La tour et point d'origine des balles
        this.originPoint = tower.getMiddleCoords()

        // Coordonnées de l'enemy
        this.targetPoint = enemy.getCoords()
        
        this.speed = 80 // px/s
        this.gravity = 10 //px/s²
        
        
        this.dammage = dammage
        
        // radius du projectile
        this.radius = 2

        //Radius des dommages de l'explosion
        this.radiusOfEffect = 50

        this.coords = this.originPoint

        this.previousCoords = this.originPoint

        this.isDeleted = false

        this.isInAir = true

        // Distance entre les coordonnées de départ et de destination en px
        this.distance = getDistance(this.originPoint.x, this.originPoint.y, this.targetPoint.x, this.targetPoint.y) 
        this.angle = angle(this.originPoint.x, this.originPoint.y, this.targetPoint.x, this.targetPoint.y)
        // Rapport entre les coordonnées de depart et destination et la range de le tower
        this.coef = this.distance / tower.range

        // Temps ecoulé depuis le debut de l'animation , ajouter timestamp a chaque update
        this.timeSpent = 0 

        this.totalTime = tower.range / this.speed 

        this.setFiringAngle()

        this.altitude = 0
        
    }   

    setFiringAngle() {
        // teta = 1/2 sin^-1 * (g*x / v0^2)
        // teta => angle initial
        // g => constante gavitationelle
        // x => distance total depuis origin a destiantion
        //v0 => vitesse initial

        //Distance a parcourir // px
        const x = getDistance(this.originPoint.x , this.originPoint.y, this.targetPoint.x, this.targetPoint.y)
        
        const teta = (1/2) * Math.asin((this.gravity * x) /  Math.pow(this.speed, 2)) // 
        // const teta = 1/2 * Math.pow(Math.sin((g * x) / Math.pow(v0, 2)), -1)
        this.firingAngle = teta //* (180/Math.PI)
        console.log(teta * (180/Math.PI));
    }

    updateInAir(diffTimestamp) {

        this.timeSpent += diffTimestamp / 1000

        const v0 = this.speed // px/ms
        // Y = Y0+V0*SIN(A)*T-G*T*(T/2) <= altidude
        // Y = V0*T*SIN(A) - 1/2 * g * t ^2 
        // X = X0+V0*COS(A)*T <= distance parcourue a l'instant T
        const range = v0 * Math.cos(this.firingAngle) * this.timeSpent
        // console.log(range);
       // Update coords

        const projectionPoint = getProjectionPoint(range, this.angle)
        this.coords = addToPoint(this.originPoint, projectionPoint)
        
        //this.altitude = (Math.tan(this.firingAngle) * range) - ((9.8 / (2 * (v0*v0) * (Math.cos(this.firingAngle) * Math.cos(this.firingAngle)))) * (range * range))
        // this.altitude = (v0 * Math.sin(this.firingAngle) * this.timeSpent) - ((0.5 * (9.8 * (this.timeSpent*this.timeSpent))) )
        const gravLoss = 0.5 * (this.gravity * (this.timeSpent*this.timeSpent))
        const vacAltitude = Math.tan(this.firingAngle) * range
        this.altitude = vacAltitude - gravLoss
        

        //if(this.altitude <= 0) this.isInAir = false
        // if(this.distance <= Math.abs(range)) {
        //     console.log("YOH")
        //     this.isInAir = false
        // }
    }

    /**
     * Update les data
     * @param {Number} diffTimestamp 
     */
    update(diffTimestamp) {
        
        if (this.isInAir) {

            this.updateInAir(diffTimestamp)

            this.detectImpact()
            
        } else {

            this.detectCollisions()    
            
            const explosion = new BigExplosion(this.level, this.coords)
                
            this.level.addExplosion(explosion)

            this.isDeleted = true
        }
    }

    /**
     * Met a jour le rendu
     * @param {DOMElement} layer 
     */
    render(layer, diffTimestamp) {
        let radius = this.radius + this.altitude/8
        if(radius < 0)radius = this.radius
        layer.beginPath()
        layer.arc(this.coords.x, this.coords.y, radius, 0, 2 * Math.PI)
        layer.fillStyle = "black"
        layer.fill()

    }

    getBoundingBox() {
        return {
            xMin: this.coords.x - this.radius,
            xMax: this.coords.x + this.radius,
            yMin: this.coords.y - this.radius,
            yMax: this.coords.y + this.radius,
        }
    }

    detectImpact() {
        const currentDistance = getDistance(this.originPoint.x , this.originPoint.y, this.coords.x, this.coords.y)
        const totalDistance = getDistance(this.originPoint.x , this.originPoint.y, this.targetPoint.x, this.targetPoint.y)
        
        if( currentDistance >= totalDistance ) this.isInAir = false
    }
    
    /**
     * Parcours les enemy et détect si il y a une collision, si True : appelle la methode HIT() de enemy
     */
    detectCollisions() {
        
        const circle = this.coords

        for (let i = 0; i < this.level.enemies.length; i++){

            let enemy = this.level.enemies[i]
            const enemyCoords = enemy.getCoords()

            if (pointIntersectsCircle(enemyCoords, circle, this.radiusOfEffect)) {
                enemy.hit(this.dammage)
            }
        } 
        
    }

}