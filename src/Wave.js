import Enemy from './Enemy'

export default class Wave {

    spawningFrequency = 750 // ms

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
                
                return [this.createEnemy()]
                
            } else {

                this.timeSinceLastSpawn += diffTimestamp
                
                // If we've wait long enough since last spawn
                if (this.timeSinceLastSpawn >= this.spawningFrequency) {

                    // Update timer
                    this.timeSinceLastSpawn = 0
                    this.spawnedEnemiesCount++
                    
                    return [this.createEnemy()]    
                }     
            }
        }

        return []
    }

    createEnemy() {

        const enemy = new Enemy(this.level)
        
        // Récupérer les coordonnées de la 1ère cell du path
        const firstCell = this.level.gridCells[this.level.config.map.path[0]]
        const secondCell = this.level.gridCells[this.level.config.map.path[1]]

        // Déterminer une position aléatoire de départ
        enemy.offset = (Math.random() * (this.level.game.cellSize - 20)) + 10
        
        if(firstCell.column === secondCell.column) {
            enemy.x = Math.floor(enemy.offset) + firstCell.coords.xMin
            enemy.y = firstCell.coords.yMin === 0 ? firstCell.coords.yMin : firstCell.coords.yMax
        } else if (firstCell.row === secondCell.row) {
            enemy.y = Math.floor(enemy.offset) + firstCell.coords.yMin
            enemy.x = firstCell.coords.yMin === 0 ? firstCell.coords.xMin : firstCell.coords.xMax
        }
        
        return enemy
    }
}