import Enemy from './Enemy'

export default class Wave {

    spawningFrequency = 500 // ms

    timeSinceLastSpawn = null

    spawnedEnemiesCount = 0

    constructor(config, level) {

        this.config = config
        this.level = level
        this.spawnedEnemiesCount = 0
    }

    getSpawningEnemies = (diffTimestamp) => {
        
        // If not all enemies have spawn
        if (this.config.nbEnemies > this.spawnedEnemiesCount) {
        
            // If no enemies has spawn
            if (this.timeSinceLastSpawn === null) {
                
                // Update timer
                this.timeSinceLastSpawn = diffTimestamp
                this.spawnedEnemiesCount++
                
                return [new Enemy(this.level)]
                
            } else {

                this.timeSinceLastSpawn += diffTimestamp
                
                // If we've wait long enough since last spawn
                if (this.timeSinceLastSpawn >= this.spawningFrequency) {

                    // Update timer
                    this.timeSinceLastSpawn = 0
                    this.spawnedEnemiesCount++
                    
                    return [new Enemy(this.level)]    
                }     
            }
        }

        return []
    }
}