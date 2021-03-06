import enemiesClasses from './enemies/index'
import { randomBetween, randomSign, getClassByName } from './utilities'

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
    constructor(level) {
        this.level = level
        this.spawnedEnemiesCount = 0
        this.nbEnemies = (level.waveCounter / 10) * 15 
        this.config = this.getWaveConfig()
        this.bossLevel = this.level.config.bossLevel

        if (this.bossLevel === level.waveCounter || level.bossCalled) {           
            this.nbEnemies = 1
            this.config = { [this.level.config.boss]: 1}
        }
    }

    getSpawningBasicEnemies = diffTimestamp => {


        
        return []
    }

    getSpawningBoss = diffTimestamp => {
        
    }

    /**
     * Gére le spawn des enemy en fonction du temps écoulé
     * @param {Numeric} diffTimestamp Temps écoulé depuis le dernier raffraichissement
     * @returns {Array} Tableau d'ennemis
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
     * @returns {Object} Retourne la configuration correspondant à la wave en cours
     */
    getWaveConfig() {

        const config = this.level.config.enemies
            .filter(waveConfig => waveConfig.wave <= this.level.waveCounter)
            .map(waveConfig => waveConfig.enemies)

        return config[config.length - 1]
    }

    /**
     * @returns {Class} Retourne la classe de l'enemy a spawnner en fonction de la config et du numero de la wave
     */
    getSelectedEnemyClass() {
        
        const random = Math.random()
        let total = 0
        const enemiesKeys = Object.keys(this.config) 
        
        for (let i = 0; i < enemiesKeys.length; i++) {
            const enemyKey = enemiesKeys[i];
            const enemyProbability = this.config[enemyKey]
            total += enemyProbability
            if (random <= total) {
                return getClassByName(enemyKey, enemiesClasses)
            }
        }        
    }

    /**
     * Créer un nouvelle enemy et le positione de façon aléatoire sur la ligne de départ
     */
    createEnemy() {
        
        let selectedEnemyClass = this.getSelectedEnemyClass()
        
        let x, y
        const map = this.level.config.map
        const cellSize = this.level.game.scene.cellSize

        // Récupérer les coordonnées de la 1ère cell du path
        const firstCell = this.level.game.scene.gridCells[map.path[0]]
        const secondCell = this.level.game.scene.gridCells[map.path[1]]

        // Déterminer une position (centrale) aléatoire de départ entre 0 et largeur de la cellule - 1/2 de enemy 
        // (pour pas que l'enemy sorte du chemin)
        const limit = Math.random() * (cellSize - selectedEnemyClass.width) + selectedEnemyClass.width / 2
        // Transforme la position central en une position top left
        const offset = limit - selectedEnemyClass.width / 2
        const firstCellBox = firstCell.getBoundingBox()
         
        // Si on est sur la même colonne (on descend depuis tout en haut ou on monte depuis tout en bas)
        if(firstCell.column === secondCell.column) {
            // On part de la gauche de la 1ère cellule + l'offset
            x = Math.floor(offset) + firstCellBox.xMin
            // On part d'en haut ou d'en bas de la map (déterminé en fonction de yMin de la 1ère cellule)
            y = firstCellBox.yMin === 0 ? firstCellBox.yMin : firstCellBox.yMax
            // Si on est sur la même ligne (on va à droite depuis la gauche de la map ou on va à gauche depuis la droite de la map)
        } else if (firstCell.row === secondCell.row) {
            // On part du haut de la 1ère cellule + l'offset
            y = Math.floor(offset) + firstCellBox.yMin
            // On part de la gauche ou la droite de la map (déterminé en fonction de xMin de la 1ère cellule)
            x = firstCellBox.yMin === 0 ? firstCellBox.xMin : firstCellBox.xMax
        }

        return new selectedEnemyClass(this.level, x, y)
    }

    isFinished() {
        return this.spawnedEnemiesCount >= this.nbEnemies
    }
}