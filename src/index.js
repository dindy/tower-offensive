import config from './config.json'
import Game from './Game'

const DOMConfig = {
    canvas: {
        id: 'canvas-container',
    },
    grid: {
        id: 'grid',
    },
    gridCell: {
        class: 'grid__cell',
        modifiers: {
            accept: '--accept',
            refuse: '--refuse',
        }
    },
    buildMenu : {
        id: 'right-menu'
    },
    buildMenuItem: {
        class: 'right-menu__item'
    }
}

const game = new Game(config, DOMConfig)
game.start()

document.getElementById('stop').addEventListener('mouseup', e => {
    game.stop()
})