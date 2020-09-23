import Enemy from './Enemy'
import { randomBetween, randomSign } from './utilities'

export default class Wave {

    // Average delay between two enemies
    spawningFrequency = 700 // ms

    // Randomized delay between two enemies (recalcualte for each enemy)
    randomSpawningFrequency = this.spawningFrequency

    timeSinceLastSpawn = null

    spawnedEnemiesCount = 0

    initialDelay = 500 // ms
    
    initialTimer = 0    

    /**
     * Constuctor
     * @param {JSON} config 
     * @param {Object} level 
     */
    constructor(level, difficulty) {
        this.difficulty = difficulty
        this.level = level
        this.spawnedEnemiesCount = 0
        this.nbEnemies = this.difficulty * 15 
        
    }

    /**
     * Gére le spawn des enemy en fonction du temps écoulé
     * @param {Numbre} diffTimestamp Temps écoulé depuis le dernier raffraichissement
     */
    getSpawningEnemies = (diffTimestamp) => {
        
        this.initialTimer += diffTimestamp
        
        if (this.initialTimer >= this.initialDelay) {
        
            // If not all enemies have spawn
            if (this.nbEnemies > this.spawnedEnemiesCount) {
            
                // If no enemies has spawn
                if (this.timeSinceLastSpawn === null) {
                    
                    // Update timer
                    this.timeSinceLastSpawn = diffTimestamp
                    this.spawnedEnemiesCount++
                    
                    // Return new enemy
                    return [this.createEnemy()]
                    
                } else {

                    // Update timer
                    this.timeSinceLastSpawn += diffTimestamp
                    
                    // If we've wait long enough since last spawn
                    if (this.timeSinceLastSpawn >= this.randomSpawningFrequency) {
                        
                        // Update timer
                        this.timeSinceLastSpawn = 0
                        this.spawnedEnemiesCount++
                        
                        // Set the new random spawning frequency
                        // A random part of average spawning frequency 
                        const randomFrequencyPart = randomBetween(.1, .6) * this.spawningFrequency                        
                        // Save the average spawning frequency more or less a random percentage of that frequency 
                        // that will be used to delay the next enemy
                        this.randomSpawningFrequency = this.spawningFrequency + randomSign() * randomFrequencyPart
                        
                        // returns new enemies
                        return [this.createEnemy()]    
                    }     
                }
            }
        }
        
        // Else no enemy has spawn
        return []
    }

    /**
     * Créer un nouvelle enemy et le positione de façon aléatoire sur la ligne de départ
     */
    createEnemy() {
        
        let x, y
        const map = this.level.config.map
        const cellSize = this.level.game.scene.cellSize

        // Récupérer les coordonnées de la 1ère cell du path
        const firstCell = this.level.game.scene.gridCells[map.path[0]]
        const secondCell = this.level.game.scene.gridCells[map.path[1]]

        // Déterminer une position (centrale) aléatoire de départ entre 0 et largeur de la cellule - 1/2 de enemy 
        // (pour pas que l'enemy sorte du chemin)
        const limit = Math.random() * (cellSize - Enemy.width) + Enemy.width / 2
        // Transforme la position central en une position top left
        const offset = limit - Enemy.width / 2
        
        // Si on est sur la même colonne (on descend depuis tout en haut ou on monte depuis tout en bas)
        if(firstCell.column === secondCell.column) {
            // On part de la gauche de la 1ère cellule + l'offset
            x = Math.floor(offset) + firstCell.coords.xMin
            // On part d'en haut ou d'en bas de la map (déterminé en fonction de yMin de la 1ère cellule)
            y = firstCell.coords.yMin === 0 ? firstCell.coords.yMin : firstCell.coords.yMax
            // Si on est sur la même ligne (on va à droite depuis la gauche de la map ou on va à gauche depuis la droite de la map)
        } else if (firstCell.row === secondCell.row) {
            // On part du haut de la 1ère cellule + l'offset
            y = Math.floor(offset) + firstCell.coords.yMin
            // On part de la gauche ou la droite de la map (déterminé en fonction de xMin de la 1ère cellule)
            x = firstCell.coords.yMin === 0 ? firstCell.coords.xMin : firstCell.coords.xMax
        }

        return new Enemy(this.level, x, y)
    }

    isFinished() {
        return this.spawnedEnemiesCount === this.nbEnemies
    }
}