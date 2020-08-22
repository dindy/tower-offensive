import Enemy from './Enemy'
import { randomBetween, randomSign } from './utilities'

export default class Wave {

    // Average delay between two enemies
    spawningFrequency = 800 // ms

    // Randomized delay between two enemies (recalcualte for each enemy)
    randomSpawningFrequency = this.spawningFrequency

    timeSinceLastSpawn = null

    spawnedEnemiesCount = 0

    initialDelay = 5000 // ms
    
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
        this.nbEnemies = this.difficulty * 20 
        
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

        const enemy = new Enemy(this.level)
        
        // Récupérer les coordonnées de la 1ère cell du path
        const firstCell = this.level.game.scene.gridCells[this.level.config.map.path[0]]
        const secondCell = this.level.game.scene.gridCells[this.level.config.map.path[1]]

        // Déterminer une position aléatoire de départ
        enemy.offset = (Math.random() * (this.level.game.scene.cellSize - enemy.width)) + enemy.width / 2
        
        if(firstCell.column === secondCell.column) {
            enemy.x = Math.floor(enemy.offset) + firstCell.coords.xMin
            enemy.y = firstCell.coords.yMin === 0 ? firstCell.coords.yMin : firstCell.coords.yMax
        } else if (firstCell.row === secondCell.row) {
            enemy.y = Math.floor(enemy.offset) + firstCell.coords.yMin
            enemy.x = firstCell.coords.yMin === 0 ? firstCell.coords.xMin : firstCell.coords.xMax
        }

        return enemy
    }

    isFinished() {
        return this.spawnedEnemiesCount === this.nbEnemies
    }
}