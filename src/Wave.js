import Enemy from './Enemy'

export default class Wave {

    spawningFrequency = 750 // ms

    timeSinceLastSpawn = null

    spawnedEnemiesCount = 0

    /**
     * Constuctor
     * @param {JSON} config 
     * @param {Object} level 
     */
    constructor(config, level) {

        this.config = config
        this.level = level
        this.spawnedEnemiesCount = 0
    }

    /**
     * Gére le spawn des enemy en fonction du temps écoulé
     * @param {Numbre} diffTimestamp Temps écoulé depuis le dernier raffraichissement
     */
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
}