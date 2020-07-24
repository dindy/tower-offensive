import config from './config.json'
import Game from './Game'

/**
 * Continer les Classe et id des différent élement HTML
 */
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

/**
 * Load le jeu
 */
const game = new Game(config, DOMConfig)

//Démarre le jeu , duh !
game.start()

//Bouton stop pour debug
document.getElementById('stop').addEventListener('mouseup', e => {
    game.stop()
})