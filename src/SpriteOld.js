

export default class Sprite {

    
    constructor(sourceY, sourceWidth, sourceHeight, nbFrames, interval) {
        this.sourceY = sourceY
        this.sourceWidth = sourceWidth
        this.sourceHeight = sourceHeight
        this.nbFrames = nbFrames
        this.interval = interval
        
        this.timer = 0

        this.data = []
    }

    setSprite(frameIndex, offset = 0) {
        this.data = [
            (frameIndex - 1)  * this.sourceWidth,
            this.sourceY,
            this.sourceWidth, 
            this.sourceHeight, 
            0 - offset, 
            0 - offset, 
            this.sourceWidth, 
            this.sourceHeight
        ]
    }

    update(diffTimestamp, offset = 0) {
        this.timer += diffTimestamp
        const x = Math.floor((this.timer / this.interval) - (this.nbFrames * (Math.floor((this.timer / this.interval) / this.nbFrames)))) * this.sourceWidth
        this.data = [
            x,
            this.sourceY, 
            this.sourceWidth, 
            this.sourceHeight, 
            0 - offset, 
            0 - offset, 
            this.sourceWidth, 
            this.sourceHeight
        ]
        
    }    
    
    setTimer(timer, offset = 0){
        this.timer = timer
        const x = Math.floor((this.timer / this.interval) - (this.nbFrames * (Math.floor((this.timer / this.interval) / this.nbFrames)))) * this.sourceWidth
        this.data = [
            x,
            this.sourceY, 
            this.sourceWidth, 
            this.sourceHeight, 
            0 - offset, 
            0 - offset, 
            this.sourceWidth, 
            this.sourceHeight
        ]
    }

    

    getCurrent() {
        return this.data
    }

}