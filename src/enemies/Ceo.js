import Enemy from "./Enemy"
import Sprite from "../Sprite"

export default class Ceo extends Enemy {

    static width = 16
    static healthMax = 15
    static socialValue = 10
    static pocketCapacity = 30

    constructor(level, x, y) {

        super(level, x, y, Ceo.width, Ceo.width)

        this.health = Ceo.healthMax

        this.socialValue = Ceo.socialValue        
        
        // Profondeur des poches d'un enemy
        this.pocketCapacity = Ceo.pocketCapacity

        // Load the image of the ceo
        this.image = document.getElementById(level.game.DOMConfig.sprites.ceo)
        
        this.sprite = new Sprite(50, 50, {
            down : { sourceY: 0, nbFrames: 4, interval: 80 },
            up : { sourceY: 50, nbFrames: 4, interval: 80 },
            right : { sourceY: 100, nbFrames: 4, interval: 80 },
            left : { sourceY: 150, nbFrames: 4, interval: 80 }
        })        
    }
}