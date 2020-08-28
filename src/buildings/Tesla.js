import Tower from "./Tower"
import Sprite from "../Sprite"

export default class Tesla extends Tower {

    static price = 4

    constructor(level) {
        
        super(level, 100, 250, 1, 0.5)

        this.spriteSheet = document.getElementById(level.game.DOMConfig.sprites.towerTesla)
        
    }

}