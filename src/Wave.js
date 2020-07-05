import Enemy from './Enemy'

export default class Wave {

    spawningFrequency = 1000 // ms

    timeSinceLastSpawn = null

    spawnedEnemiesCount = 0

    constructor(config) {

        this.config = config

    }

    getSpawningEnemies = (diffTimestamp) => {
        
        // If no enemies has spawn
        if (this.timeSinceLastSpawn === null) {
            
            // Update timer
            this.timeSinceLastSpawn = diffTimestamp
            
            // If there is enemies in the wave, return new Enemy
            if (this.config.nbEnemies > 0) {
                this.spawnedEnemiesCount++
                return [new Enemy()]
            }
            
        // If enemies have spawn
        } else {

            // Update timer
            this.timeSinceLastSpawn += diffTimestamp
            
            // If more enemies to spawn
            if (this.config.nbEnemies > this.spawnedEnemiesCount) {
                
                // If we've wait long enough since last spawn
                if (this.timeSinceLastSpawn >= this.spawningFrequency) {
                    this.spawnedEnemiesCount++
                    return [new Enemy()]
                }
            }

            return []
        }
    }


}