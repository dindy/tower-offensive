export function getBezierPoint(x1, y1, x2, y2, x3, y3, t) {
    
    /* Formula :
        x = (1−t)^2 * x1 + 2 * (1−t) * t * x2 + t^2 * x3
        y = (1−t)^2 * y1 + 2 * (1−t) * t * y2 + t^2 * y3
    */
    
    return { 
        x : Math.pow((1 - t), 2) * x1 + 2 * (1 - t) * t * x2 + Math.pow(t, 2) * x3,
        y : Math.pow((1 - t), 2) * y1 + 2 * (1 - t) * t * y2 + Math.pow(t, 2) * y3
    }
}

export function getDistance(x1, y1, x2, y2) {
    
    const a = x1 - x2;
    const b = y1 - y2;
        
    return Math.sqrt( a * a + b * b );    
}

export function getPositionOnLine(x1, y1, x2, y2, t) {
    return {
        x : (x1 + (x2 - x1) * t),
        y : (y1 + (y2 - y1) * t) 
    }
}
