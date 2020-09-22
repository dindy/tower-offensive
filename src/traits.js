function getWidthHeight(o) {
    
    let width, height

    if (typeof o.radius !== 'undefined') {
        height = o.radius
        width = o.radius
    } else if (typeof o.width !== 'undefined') {
        width = o.width
        height = o.width
        if (typeof o.height !== 'undefined') height = o.height 
    } else {
        throw new Error('Properties `radius` or `width` and `height` missing.')
    }    

    return { width, height }
}

export function getBoundingBox() {
    
    if (typeof this.x === 'undefined' || typeof this.y === 'undefined') throw new Error('Properties `x` and/or `y` missing.')

    const { height, width } = getWidthHeight(this)

    return {
        xMin: this.x,
        xMax: this.x + width,
        yMin: this.y,
        yMax: this.y + height
    }
}

export function getMiddleCoords() {

    const { height, width } = getWidthHeight(this)

    return {
        x : this.x + (width / 2),
        y : this.y + (height / 2)
    }
}