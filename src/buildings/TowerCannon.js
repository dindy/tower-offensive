import Tower from './Tower'

import { 
    angle, 
    angleDifference, 
    angleDirection, 
    pointIntersectsCircle,
    degreesToRadians,
} from "../utilities"

export default class TowerCannon extends Tower {

    constructor (level, range, fireRate, dammage, cannonSpeed) {

        super(level, range)

        // Temps en ms entre chaque tir
        this.fireRate = fireRate 
        
        // Niveau de dommage infligé
        this.dammage = dammage

        // Vitesse de rotation en degrés / ms
        this.cannonSpeed = cannonSpeed

        // Tableau des balles tirées par la tour
        this.bullets = []

        // Cible actuellement suivie par la tour
        this.currentTarget = null
        
        // Angle du canon de la tour
        this.cannonAngle = 0

        // Indique si le canon de la tour est aligné avec la cible courante
        this.isAligned = false

        this.delayRotationAfterShot = 0 // ms
        
    }

    /**
     * Update les data en fonction du temps passé
     * @param {Float} diffTimestamp 
     */
    update(diffTimestamp) {
        
        // On update le building
        super.update(diffTimestamp)

        // Met à jour la cible
        this.updateTarget(diffTimestamp)

        // Met à jour l'angle du canon
        this.updateCannonAngle(diffTimestamp)
        
        // Essaye de tirer
        this.updateShoot(diffTimestamp)
        
        // Met à jour les balles
        this.updateBullets(diffTimestamp)
    }

    /**
     * Rendu sur le layer de la tower
     * @param {DOMElement} layer 
     */
    render(layer, diffTimestamp) {

        super.render(layer, diffTimestamp) 
    }

    /**
     * Vérifie que toutes les conditions sont remplies pour pouvoir tirer sur la cible courante
     * @returns {boolean} Wether the tower can shoot or not
     */
    canShoot() {

        // On peut tirer si...
        return (this.currentTarget != null // ...on a une cible
            && this.isAligned // ...le canon est aligné
            && this.timeSinceLastShot >= this.fireRate // ...on a assez attendu depuis le tir précédent
        ) ?
        true : false
    }
    
    /**
     * Trouve une cible parmi les ennemis du niveau
     */
    findTarget() {
        
        // Parcourt les ennemis du niveau
        for (let j = 0; j < this.level.enemies.length; j++) {
            
            const enemy = this.level.enemies[j]
            
            // Si l'ennemi est à portée et pas supprimé 
            if (this.isValidTarget(enemy)) {

                // On met à jour les infos de l'ennemi courant
                this.currentTarget = enemy
                this.currentTargetPosition = enemy.getCoords()
                
                // Pas besoin de parcourir les autres ennemis
                return
            }
        }

        // Aucune cible trouvée
        this.currentTarget = null
        this.currentTargetPosition = null
    }

    /**
     * Vérifie qu'un ennemi est valide
     * @param {Object} Ennemi 
     * @returns {boolean}
     */
    isValidTarget(target) {
        return target !== null // Non null
            && this.isInRange(target) // A portée
            && !target.isDeleted // Pas supprimé
    }

    /**
     * Met à jour la cible courante
     * @param {numeric} diffTimestamp 
     */
    updateTarget(diffTimestamp) {

        // Si plus d'ennemi dans le niveau, il n'y a plus d'ennemi courant
        if (this.level.enemies.length === 0) {
            this.currentTarget = null
            return // Pas besoin de continuer la recherche
        }

        // Si la cible n'est plus valide
        if (!this.isValidTarget(this.currentTarget)) {

            // On supprime la cible courante
            this.currentTarget = null
            this.currentTargetPosition = null

            // on essaye d'en trouver un autre pour le prochain tour
            this.findTarget()
        }
    }

    /**
     * Met à jour l'angle du canon
     * @param {numeric} diffTimestamp 
     */
    updateCannonAngle(diffTimestamp) {
        
        if (this.timeSinceLastShot < this.delayRotationAfterShot) {
            this.isAligned = false
            return 
        }

        // On contrôle qu'on a une cible
        if (this.currentTarget != null) {
            
            // On récupère les coordonnées de la tour 
            const middleCoords = this.getMiddleCoords()

            // On calcule l'angle de la cible par rapport aux coordonnées de la tour
            const targetAngle = angle(middleCoords.x, middleCoords.y, this.currentTarget.x, this.currentTarget.y)
            
            // On calcule la différence d'angle entre l'angle du cannon et celui nécessaire pour atteindre la cible 
            // sur une échelle de [0, 180]
            let degreesDifference = angleDifference(this.cannonAngle, targetAngle)

            // On calcule le sens de rotation optimum pour atteindre la cible
            const direction = angleDirection(this.cannonAngle, targetAngle)  
            
            // On peut tirer si la différence d'angle et la vitesse de rotation nous laissent 
            // le temps de nous aligner parfaitement
            if (degreesDifference < this.cannonSpeed * diffTimestamp) {

                // L'angle du canon de vient celui de la cible
                this.cannonAngle = targetAngle
                
                // On peut essayer de tirer
                this.isAligned = true
            
            // Sinon on met à jour l'angle du canon...
            } else {

                // ...en fonction du temps écoulé et de la vitesse de rotation
                const newAngle = this.cannonAngle + (direction * this.cannonSpeed * diffTimestamp)
                this.cannonAngle = newAngle

                // On ne peut plus tirer
                this.isAligned = false
            }
        }
    }

    /**
     * Déclenche le tir si possible
     */
    updateShoot(diffTimestamp) {
        
        // On met à jour le timer depuis le dernier tir
        this.timeSinceLastShot += diffTimestamp

        this.isShooting = false

        // On tire dès qu'on peut
        if (this.canShoot()) this.shoot(this.currentTarget)
    }

    /**
     * Met à jour les balles tirées par la tour
     * @param {numeric} diffTimestamp 
     */
    updateBullets(diffTimestamp) {

        for (let i = 0; i < this.bullets.length; i++) {
           
            this.bullets[i].update(diffTimestamp)
        }      
        
        // Supprime les balles en fin de vie
        this.bullets = this.bullets.filter(bullet => !bullet.isDeleted) 
    }

    /**
     * Rend le canon de la tour
     * @param {Object} Canvas 2d context 
     * @param {numeric} diffTimestamp 
     */
    renderCannon(layer, diffTimestamp) {
        
        // On récupère les coordonnées du point central de la tour
        const coords = this.getMiddleCoords()
        // On détermine l'état du canon
        const cannonState = this.isShooting ? 'shooting' : 'idle'

        // On met à jour le sprite en fonction du temps écoulé
        this.spriteCannon.setTimerDiff(diffTimestamp)
        // On indique qu'à la fin de l'animation en cours on passera à l'état précédemment déterminé
        // (possiblement le même)
        this.spriteCannon.setNextState(cannonState)

        // On dessine le canon
        layer.translate(coords.x, coords.y)
        layer.rotate(degreesToRadians(this.cannonAngle))
        layer.drawImage(this.spriteSheet, ...this.spriteCannon.getCurrent())
        layer.setTransform(1, 0, 0, 1, 0, 0);        
    }

    /**
     * Rendu des balles tirées par la tower
     * @param {DOMElement} layer 
     */
    renderAttack(layer, diffTimestamp) {

        for (let i = 0; i < this.bullets.length; i++) {
            const bullet = this.bullets[i];
            bullet.render(layer, diffTimestamp)
        } 
    }


}