import Rectangle from './abstract/Rectangle'
import Vector from './abstract/Vector'

export default class FloatingTextAnimation extends Rectangle {

    static totalTime = 1000 // ms
    static totalDistance = 30 // px

    isDeleted = false
    color = '0,0,0'

    constructor(text, x, y, color = null) {
        super(x, y, 10)
        this.text = text
        this.timeSpent = 0
        this.opacity = 1
        if (color !== null) this.color = color// "250, 221, 107"
    }
    
    update(diffTimestamp) {

        this.timeSpent += diffTimestamp

        if(this.timeSpent >= FloatingTextAnimation.totalTime) this.isDeleted = true

        const currentDistance = (diffTimestamp * FloatingTextAnimation.totalDistance) / FloatingTextAnimation.totalTime    

        this.opacity = this.opacity - (diffTimestamp / FloatingTextAnimation.totalTime)
        this.addToPosition(new Vector(0, -1 * currentDistance))
    }
    
    render(layer) {
        const coords = this.getTopLeftPosition()
        layer.font = "900 14px Arial"
        layer.fillStyle = `rgba(${this.color} ,${this.opacity})`
        layer.fillText(this.text, coords.x, coords.y)    
        layer.strokeStyle = `rgba(0,0,0,${this.opacity})`        
        layer.lineWidth = 1        
        layer.strokeText(this.text, coords.x, coords.y)    
    }
}