export function getBezierPoint(x1, y1, x2, y2, x3, y3, t) {
    // x = (1−t)^2 * x1 + 2 * (1−t) * t * x2 + t^2 * x3
    // y = (1−t)^2 * y1 + 2 * (1−t) * t * y2 + t^2 * y3
     
    return { 
        x : Math.pow((1 - t), 2) * x1 + 2 * (1 - t) * t * x2 + Math.pow(t, 2) * x3,
        y : Math.pow((1 - t), 2) * y1 + 2 * (1 - t) * t * y2 + Math.pow(t, 2) * y3
    }
}


