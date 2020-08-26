import Explosion from "./Explosion"
import Sprite from "../Sprite"

export default class SmallExplosion extends Explosion {
	
	    constructor(level, coords) {

        super(level, coords, 3, 120)
        
        this.spriteSheet =  document.getElementById(level.game.DOMConfig.sprites.explosions)
        
        this.sprite = new Sprite (100, 50, {
            default: { sourceY: 50, nbFrames: this.frames, interval: this.interval }
        })        
        this.sprite.loop = false
        

    }
    
}