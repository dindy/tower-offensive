import config from './config.json'
import Game from './Game'

const game = new Game(config)
game.start()

document.getElementById('stop').addEventListener('mouseup', e => {
    game.stop()
})