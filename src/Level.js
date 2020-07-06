import Wave from './Wave'

export default class Level {
    
    waves = [] 
    enemies = []
    currentWave = null

    constructor(config) {
        this.config = config
        this.loadWaves()
    }

    //Load the config and create data from it
    loadWaves = () => {
        
        // Create waves
        this.config.waves.forEach(waveConfig => {
            const wave = new Wave(waveConfig)            
            this.waves.push(wave)
        })        

        this.currentWave = this.waves[0]
        
    } 

    //Update the data
    update = (diffTimestamp) => {

        // Add new enemies to enemies
        this.currentWave.getSpawningEnemies(diffTimestamp).forEach(enemy => {
            this.enemies.push(enemy)
        })
        console.log('level\'s enemies', this.enemies);

        
    }

}