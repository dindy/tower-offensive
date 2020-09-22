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

    /**
     * Constructor 
     * @param {Tower} tower La tour d'où les balles sont tirées
     * @param {Enemy} enemy Cible de la tour
     */
    constructor(tower, enemy, dammage) {

        this.level = tower.level

        // Centre de La tour et point d'origine des balles
        this.originPoint = tower.getMiddleCoords()

        // Coordonnées de l'enemy
        this.targetPoint = enemy.getCoords()
        
        // Vitesse initiale de rocket
        this.speed = 80 // px/s
        
        // Constante gravitationelle du monde
        this.gravity = 10 //px/s²
        
        // radius du projectile (graphisme)
        this.radius = 2
        
        // Dommage infligé par rocket
        this.dammage = dammage

        // Radius des dommages de l'explosion
        this.radiusOfEffect = 50

        //Coordonnées de la rocket
        this.coords = this.originPoint

        // Rocket doit être supprimé
        this.isDeleted = false

        // Rocket est dans les airs
        this.isInAir = true

        // Distance entre les coordonnées de départ et de destination en px
        this.distance = getDistance(this.originPoint.x, this.originPoint.y, this.targetPoint.x, this.targetPoint.y) 
        
        // Angle vertical de rocket (0: parallèle au sol)
        this.firingAngle = null        

        // Angle horizontal du cannon
        this.angle = angle(this.originPoint.x, this.originPoint.y, this.targetPoint.x, this.targetPoint.y)
        
        // Temps ecoulé depuis le debut de l'animation, ajouter timestamp a chaque update
        this.timeSpent = 0 

        // Calcule l'angle vertical initial nécessaire pour atteindre la cible
        this.setFiringAngle()

        // Altitude de rocket
        this.altitude = 0
    }   

    /**
     * Calcule l'angle vertical initial nécessaire pour atteindre la cible
     */
    setFiringAngle() {

        //Distance a parcourir // px
        const x = getDistance(this.originPoint.x , this.originPoint.y, this.targetPoint.x, this.targetPoint.y)
        
        // Angle nécessaire pour atteindre la cible
        this.firingAngle = (1/2) * Math.asin((this.gravity * x) /  Math.pow(this.speed, 2))
    }

    /**
     * Update les propriétés de la rocket
     * @param {Number} diffTimestamp ms écoulées depuis la dernière update
     */
    updateInAir(diffTimestamp) {

        // On ajoute le nombre de secondes écoulées au timer interne
        this.timeSpent += diffTimestamp / 1000
        
        // Distance parcourue au sol par la rocket
        // X = range = X0+V0*COS(A)*T
        const range = this.speed * Math.cos(this.firingAngle) * this.timeSpent
        
        // On met à jour les coordonnées de rocket en ajoutant la range à la position précédente
        const projectionPoint = getProjectionPoint(range, this.angle)
        this.coords = addToPoint(this.originPoint, projectionPoint)
        
        // On met à jour l'altitude de rocket
        // Y = altidude = Y0+V0*SIN(A)*T-G*T*(T/2) 
        const gravLoss = 0.5 * (this.gravity * (this.timeSpent*this.timeSpent))
        const vacAltitude = Math.tan(this.firingAngle) * range
        this.altitude = vacAltitude - gravLoss
        
        // Controle si rocket a touché le sol
        const currentDistance = getDistance(this.originPoint.x , this.originPoint.y, this.coords.x, this.coords.y)
        
        if ( currentDistance >= this.distance ) this.isInAir = false        
    }

    /**
     * Update les data
     * @param {Number} diffTimestamp 
     */
    update(diffTimestamp) {
        
        // Si rocket est en l'air
        if (this.isInAir) {
            
            // On update sa position
            this.updateInAir(diffTimestamp)
        
        // La rocket a touché le sol
        } else {

            // Check si des enemy sont dans le radius de l'explosion
            this.hitEnemies()    
            
            // Créer une explosion
            const explosion = new BigExplosion(this.level, this.coords)  
            this.level.addExplosion(explosion)

            // Le projectile est prés a être suprimé
            this.isDeleted = true
        }
    }

    /**
     * Met a jour le rendu
     * @param {DOMElement} layer 
     */
    render(layer, diffTimestamp) {

        // Calcule le radius de rocket en fonctin de l'altitude
        let radius = this.radius + this.altitude / 8
        if (radius < 0) radius = this.radius // le radius ne peut être négatif

        // On trace rocket
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

    /**
     * Parcourt les enemies et détecte ceux qui sont dans le radius de l'explosion et inflige les dégats
     */
    hitEnemies() {

        for (let i = 0; i < this.level.enemies.length; i++){

            let enemy = this.level.enemies[i]
            const enemyCoords = enemy.getCoords()

            if (pointIntersectsCircle(enemyCoords, this.coords, this.radiusOfEffect)) {
                enemy.hit(this.dammage)
            }
        } 
    }

}