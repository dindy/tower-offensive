import Enemy from "./Enemy"
import Sprite from "../Sprite"

export default class Crs extends Enemy {

    static width = 16
    static healthMax = 50
    static socialValue = 15
    static pocketCapacity = 5
    static speed = 0.08
    
    constructor(level, x, y) {

        super(level, x, y, Crs.width, Crs.width)

        this.healthBarOffset = 15  
        this.health = Crs.healthMax
        this.speed = Crs.speed

        this.socialValue = Crs.socialValue        
        
        // Profondeur des poches d'un enemy
        this.pocketCapacity = Crs.pocketCapacity

        // Load the image of the crs
        this.image = document.getElementById(level.game.DOMConfig.sprites.crs)
        
        this.sprite = new Sprite(32, 32, {
            down : { sourceY: 0, nbFrames: 4, interval: 80 },
            up : { sourceY: 32, nbFrames: 4, interval: 80 },
            right : { sourceY: 64, nbFrames: 4, interval: 80 },
            left : { sourceY: 96, nbFrames: 4, interval: 80 }
        })        
    }

    scaleSprite(layer) {
        layer.scale(.75,.75)
    }
}