import Enemy from './Enemy'

export default class Boss extends Enemy {

    constructor(level, x, y, width, height, socialDestructionMax) {

        super(level, x, y, width, height)

        this.socialDestructionMax = socialDestructionMax
        
        this.healthBarWidth = 32
        this.healthBarHeight = 4
        this.healthBarOffset = 20        
    }


} 