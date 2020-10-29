import Boss from './Boss'
import Sprite from '../Sprite'

export default class Bezos extends Boss {
    
    static width = 32
    static healthMax = 15000
    static socialValue = 1000
    static pocketCapacity = 500
    static socialDestructionMax = 500
    
    constructor(level, x, y) {

        super(level, x, y, Bezos.width, Bezos.width, Bezos.socialDestructionMax)

        this.healthMax = Bezos.healthMax
        this.socialValue = Bezos.socialValue
        this.pocketCapacity = Bezos.pocketCapacity

        this.health = this.healthMax

        this.image = document.getElementById(level.game.DOMConfig.sprites.ceo)
        this.sprite = new Sprite(50, 50, {
            down : { sourceY: 0, nbFrames: 4, interval: 80 },
            up : { sourceY: 50, nbFrames: 4, interval: 80 },
            right : { sourceY: 100, nbFrames: 4, interval: 80 },
            left : { sourceY: 150, nbFrames: 4, interval: 80 }
        })        

    }

    scaleSprite(layer) {
        layer.scale(1.75, 1.75)
    }
}