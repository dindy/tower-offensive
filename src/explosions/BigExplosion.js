import Explosion from './Explosion'
import Sprite from '../Sprite'

export default class BigExplosion extends Explosion {

    constructor(level, coords) {
        
        super(level, coords, 6, 64)
        
        this.spriteSheet =  document.getElementById(level.game.DOMConfig.sprites.explosions)

        this.sprite = new Sprite (100, 50, {
            default: { sourceY: 100, nbFrames: this.frames, interval: this.interval }
        })        
        this.sprite.loop = false
    }

}