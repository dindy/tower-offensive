export default class Sprite {

    constructor(sourceWidth, sourceHeight, states) {
        this.sourceWidth = sourceWidth
        this.sourceHeight = sourceHeight
        this.states = states
        this.currentState = states[Object.keys(states)[0]]
        this.nextState = this.currentState
        this.timer = 0
        this.currentFrame = null
    }

    setNextState(stateName) {
        this.nextState = this.states[stateName]
    }

    setTimerDiff(diff) {        
        this.setTimer(this.timer + diff)
    }
    
    setTimer(timer) {
        
        this.timer = timer

        const stateTotalTime = this.currentState.interval * this.currentState.nbFrames
    
        if (this.timer >= stateTotalTime) {
            this.currentState = this.nextState
            this.timer = 0
            this.currentFrame = 1
        } else {
            this.currentFrame = this.getNewCurrentFrame()
        }
    }

    getCurrent() {
                
        return [
            (this.currentFrame - 1)  * this.sourceWidth,
            this.currentState.sourceY,
            this.sourceWidth, 
            this.sourceHeight, 
            0 - (this.sourceWidth / 2), 
            0 - (this.sourceHeight / 2), 
            this.sourceWidth, 
            this.sourceHeight 
        ]
    }    

    getNewCurrentFrame() {
        return Math.floor((this.timer / this.currentState.interval) - (this.currentState.nbFrames * (Math.floor((this.timer / this.currentState.interval) / this.currentState.nbFrames)))) + 1
    }
}