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

export function getRectangleLines(rect) {
    return [ // Array of lines
        [ // Array of points
            { // Point object with coordinates
                x: rect.xMin,
                y: rect.yMin
            }, {
                x: rect.xMax,
                y: rect.yMin
            }
        ], [
            { 
                x: rect.xMax,
                y: rect.yMin
            }, {
                x: rect.xMax,
                y: rect.yMax
            } 
        ], [
            { 
                x: rect.xMax,
                y: rect.yMax
            }, {
                x: rect.xMin,
                y: rect.yMax
            } 
        ], [
            { 
                x: rect.xMin,
                y: rect.yMax
            }, {
                x: rect.xMin,
                y: rect.yMin
            } 
        ]
    ]
}

function lineIntersectsLine(p1, p2, p3, p4) {

    // calculate the distance to intersection point
    const uA = ((p4.x-p3.x) * (p1.y-p3.y) - (p4.y-p3.y) * (p1.x-p3.x)) / ((p4.y-p3.y) * (p2.x-p1.x) - (p4.x-p3.x) * (p2.y-p1.y));
    const uB = ((p2.x-p1.x) * (p1.y-p3.y) - (p2.y-p1.y) * (p1.x-p3.x)) / ((p4.y-p3.y) * (p2.x-p1.x) - (p4.x-p3.x) * (p2.y-p1.y));
  
    // if uA and uB are between 0-1, lines are colliding
    if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) return true

    return false
}

export function lineIntersectsRectangle(line, rect) {


    const rectLines = getRectangleLines(rect)
    const top = lineIntersectsLine(line[0], line[1], rectLines[0][0], rectLines[0][1])
    const right = lineIntersectsLine(line[0], line[1], rectLines[1][0], rectLines[1][1])
    const down = lineIntersectsLine(line[0], line[1], rectLines[2][0], rectLines[2][1])
    const left = lineIntersectsLine(line[0], line[1], rectLines[3][0], rectLines[3][1])

    if (left || right || top || down) {
        return true
    }

    return false  
}


