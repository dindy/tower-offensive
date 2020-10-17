import config from './config.json'
import Game from './Game'
import { getDistance, radiansToDegrees, getProjectionPoint, degreesToRadians } from './utilities'

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
        },
        elements: {
            removeBtn: {
                id: 'contextual-menu-remove-btn'  
            },
            title: {
                id: 'contextual-menu-building-name'
            }          
        }
    },    
    sprites: {
        missilePlaceHolder: 'missile-place-holder',
        ceo: 'sprite-ceo',
        crs: 'sprite-crs',
        towerBasic: 'sprite-tower-basic',
        towerSniper: 'sprite-tower-sniper',
        towerSeeker: 'sprite-tower-seeker',
        towerTesla: 'sprite-tower-tesla-icon',
        towerMortar: 'sprite-tower-mortar',
        explosions: 'sprite-explosions',
        rocket: 'sprite-rocket'
    },
    icons: {
        towerBasic: 'sprite-tower-basic-icon',
        towerMortar: 'sprite-tower-mortar-icon',
        towerRocket: 'sprite-tower-rocket-icon',
        towerSniper: 'sprite-tower-sniper-icon',
        towerSeeker: 'sprite-tower-seeker-icon',
        towerTesla: 'sprite-tower-tesla-icon',
    },
    value: {
        id: "value"
    },
    buildingPoints: {
        id: "buildingPoints"
    },
    socialPoints: {
        id: "socialPoints"
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

document.getElementById('decrease-speed').addEventListener('mouseup', e => {
    game.decreaseSpeed()
})