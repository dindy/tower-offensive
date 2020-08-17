import config from './config.json'
import Game from './Game'

/**
 * Continer les Classe et id des différent élement HTML
 */
const DOMConfig = {
    wrapper: {
        id: 'wrapper'
    },
    canvasContainer: {
        id: 'canvas-container',
    },
    scene: {
        id: 'scene',
        class: 'scene',
        modifiers: {
            moving: '--moving'
        }
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
        id: 'building-menu',
        class: 'right-menu',
        modifiers: {
            hidden: '--hidden'
        }
    },
    buildMenuItem: {
        class: 'building-menu__item',
        modifiers: {
            unavailable: '--unavailable'
        }
    },
    contextualMenu : {
        id: 'contextual-menu',
        class: 'right-menu',
        modifiers: {
            hidden: '--hidden'
        }
    },    
    sprites: {
        enemy: 'enemy',
        towerBasic: 'tower-basic',
    },
    icons: {
        towerBasic: 'tower-basic-icon',
        towerRocket: 'tower-rocket-icon',
        towerSniper: 'tower-sniper-icon',
    },
    value: {
        id: "value"
    },
    buildingPoints : {
        id: "buildingPoints"
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
    game.togglePause()
})

document.getElementById('reset-speed').addEventListener('mouseup', e => {
    game.resetSpeed()
})

document.getElementById('increase-speed').addEventListener('mouseup', e => {
    game.increaseSpeed()
})