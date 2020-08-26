export default class Explosion {

    spriteSheet = null
    sprite = null
    coords = null
    frames = null
    interval = null
    timer = 0
    isDeleted = false
    totalTime = null

    constructor(level, coordinates, frames, interval) {
        this.frames = frames
        this.interval = interval
        this.level = level
        this.coords = coordinates
        this.totalTime = this.frames * this.interval
    }

    update(diffTimestamp) {
        this.timer += diffTimestamp
        
        if (this.timer >= this.totalTime) this.isDeleted = true
    }
    
    render(layer, diffTimestamp) {
        
        this.sprite.setTimerDiff(diffTimestamp)
        layer.translate(this.coords.x, this.coords.y)
        layer.drawImage(this.spriteSheet, ...this.sprite.getCurrent())
        layer.setTransform(1, 0, 0, 1, 0, 0)
    }

}