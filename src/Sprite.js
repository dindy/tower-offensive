export default class Sprite {

    constructor(sourceWidth, sourceHeight, states) {
        this.sourceWidth = sourceWidth
        this.sourceHeight = sourceHeight
        this.states = states
        this.currentState = states[Object.keys(states)[0]]
        this.currentStateName = Object.keys(states)[0]
        this.nextState = this.currentState
        this.nextStateName = Object.keys(states)[0]
        this.timer = 0
        this.currentFrame = null
        this.force = false
    }

    setNextState(stateName) {
        this.nextStateName = stateName
        this.nextState = this.states[stateName]
    }

    setState(stateName) {
        this.setNextState(stateName)
        this.force = true
    }

    setTimerDiff(diff) {        
        this.setTimer(this.timer + diff)
    }
    
    setTimer(timer) {
        
        this.timer = timer

        const stateTotalTime = this.currentState.interval * this.currentState.nbFrames
    
        if (this.timer >= stateTotalTime || this.force) {
            this.currentState = this.nextState
            this.currentStateName = this.nextStateName
            this.timer = 0
            this.currentFrame = 1
            this.force = false
        } else {
            this.currentFrame = this.getNewCurrentFrame()
        }

    }

    getCurrentStateName() {
        return this.currentStateName
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