import Victor from "victor"


/**
 * Génere une courbe de bezier en fonction de 3 point de controle et retourne la position sur cette courbe en fonction de T
 * @param {Number} x1 Coordonnées
 * @param {Number} y1 Coordonnées
 * @param {Number} x2 Coordonnées
 * @param {Number} y2 Coordonnées
 * @param {Number} x3 Coordonnées
 * @param {Number} y3 Coordonnées
 * @param {Number} t Ratio entre 0 et 1 ou 0 est le debut de la courbe et 1 la fin
 */
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

/**
 * Retourne la distance entre 2 points en pixels
 * @param {Number} x1 Coordonnées 
 * @param {Number} y1 Coordonnées 
 * @param {Number} x2 Coordonnées 
 * @param {Number} y2 Coordonnées 
 */
export function getDistance(x1, y1, x2, y2) {
    
    const a = x1 - x2;
    const b = y1 - y2;
        
    return Math.sqrt( a * a + b * b );    
}

/**
 * Retourne la position sur une ligne en fonction de T
 * @param {Number} x1 Coordonnées
 * @param {Number} y1 Coordonnées
 * @param {Number} x2 Coordonnées
 * @param {Number} y2 Coordonnées
 * @param {Number} t Ratio entre 0 et 1 ou 0 est le debut de la courbe et 1 la fin
 */
export function getPositionOnLine(x1, y1, x2, y2, t) {
    return {
        x : (x1 + (x2 - x1) * t),
        y : (y1 + (y2 - y1) * t) 
    }
}

/**
 * Renvoie les coordonnées des points d'origine et d'arrivée des 4 ligne formant les côtés d'un rectangle
 * @param {Object} rect 
 */
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

/**
 * Check si deux ligne s'intersectes en fonction des coordonnées de leur point d'origine et d'arrivée
 * @param {Number} p1 Coordonnées
 * @param {Number} p2 Coordonnées
 * @param {Number} p3 Coordonnées
 * @param {Number} p4 Coordonnées
 */
function lineIntersectsLine(p1, p2, p3, p4) {

    // calculate the distance to intersection point
    const uA = ((p4.x-p3.x) * (p1.y-p3.y) - (p4.y-p3.y) * (p1.x-p3.x)) / ((p4.y-p3.y) * (p2.x-p1.x) - (p4.x-p3.x) * (p2.y-p1.y));
    const uB = ((p2.x-p1.x) * (p1.y-p3.y) - (p2.y-p1.y) * (p1.x-p3.x)) / ((p4.y-p3.y) * (p2.x-p1.x) - (p4.x-p3.x) * (p2.y-p1.y));
  
    // if uA and uB are between 0-1, lines are colliding
    if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) return true

    return false
}

/**
 * Check si la ligne et le rectangle s'intersectes
 * @param {Object} line Contient toutes les coordonnées des point formant la ligne
 * @param {Object} rect Contient toutes les coordonnées des point formant les 4 côtés du rectangle
 */
export function lineIntersectsRectangle(line, rect) {

    const rectLines = getRectangleLines(rect)
    const top = lineIntersectsLine(line[0], line[1], rectLines[0][0], rectLines[0][1])
    const right = lineIntersectsLine(line[0], line[1], rectLines[1][0], rectLines[1][1])
    const down = lineIntersectsLine(line[0], line[1], rectLines[2][0], rectLines[2][1])
    const left = lineIntersectsLine(line[0], line[1], rectLines[3][0], rectLines[3][1])

    return (left || right || top || down)
}


/**
 * Check si 2 rectangles se superposent au moins partiellement
 * @param {Object} rect Contient toutes les coordonnées des point formant les 4 côtés du rectangle
 * @param {Object} rect Contient toutes les coordonnées des point formant les 4 côtés du rectangle
 */
export function rectangleIntersectsRectangle(rect1, rect2) {

    const rect1Lines = getRectangleLines(rect1)
    const rect2Lines = getRectangleLines(rect2)
l
    for (let i = 0; i < rect1Lines.length; i++) {
        

        for( let j = 0; j < rect2Lines.length; j++) {
        
           const isIntersect = lineIntersectsLine(rect1Lines[i][0], rect1Lines[i][1], rect2Lines[j][0], rect2Lines[j][1])
            
            if (isIntersect) return true
        }
        
    }

}

/**
 * Check qu'un point est dans le rayon d'un cercle
 * @param {Object} point 
 * @param {Object} circle 
 * @param {Numeric} radius 
 */
export function pointIntersectsCircle(point, circle, radius) {

    const dist_points = (point.x - circle.x) * (point.x - circle.x) + (point.y - circle.y) * (point.y - circle.y)
    const r = radius * radius
    
    return dist_points < r    
}

/**
 * Calcule l'angle entre 2 points
 * @param {numeric} cx 
 * @param {numeric} cy 
 * @param {numeric} ex 
 * @param {numeric} ey 
 * @returns {numeric} Angle en degrés
 */
export function angle(cx, cy, ex, ey) {
    var dy = ey - cy;
    var dx = ex - cx;
    var theta = Math.atan2(dy, dx); // range (-PI, PI]
    theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
    if (theta < 0) theta = 360 + theta; // range [0, 360]
    return theta;
  }

/**
 * Différence d'angle (soit en horaire soit en anti-horaire de 0 à 180)
 * @param {numeric} a1 
 * @param {numeric} a2 
 * @returns {numeric} [0, 180]
 */
export function angleDifference(a1, a2) {
    return 180 - Math.abs(Math.abs(a1 - a2) - 180)
}

/**
 * Trouve le sens de rotation le plus efficace pour atteindre a2 
 * @param {numeric} a1 
 * @param {numeric} a2 
 * @returns {numeric} horaire: 1 / anti-horaire: -1 
 */
export function angleDirection(a1, a2) {
    return (((a2 - a1 + 360) % 360 < 180)) ? 1 : -1
}

/**
 * Convertit un angle en degrés vers un angle en radians
 * @param {numeric} a 
 * @returns {numeric} Angle in radians
 */
export function degreesToRadians(a) {
    return a * Math.PI / 180
}

/**
 * Returns a pseudo random integer between min and max
 * @param {Numeric} min 
 * @param {Numeric} max 
 * @returns {Numeric}
 */
export function randomBetween (min, max) {
    return min + Math.random() * (max - min)
} 

/**
 * Returns a pseudo random sign
 * @returns {Numeric} 1 or -1
 */
export function randomSign() {
    return Math.random() < 0.5 ? -1 : 1
} 

/**
 * Retourne la différence entre les coordonnées actuelles et les prochaines, en fonction de l'angle et de la distance parcourue
 * @param {Numeric} pixels Pixels parcouruent 
 * @param {Numeric} angle  Angle effectué
 * @returns {Object} Coordonnées du prochain point
 */
export function getProjectionPoint(distance, angle) {
    return {
        x: Math.round(distance * Math.cos(degreesToRadians(angle))),
        y: Math.round(distance * Math.sin(degreesToRadians(angle)))
    }
}

// line intercept math by Paul Bourke http://paulbourke.net/geometry/pointlineplane/
// Determine the intersection point of two line segments
// Return FALSE if the lines don't intersect
export function getIntersectionPoint(x1, y1, x2, y2, x3, y3, x4, y4) {

    // Check if none of the lines are of length 0
    if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
        return false
    }

    const denominator = ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1))

    // Lines are parallel
    if (denominator === 0) {
        return false
    }

    let ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator
    let ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator

    // is the intersection along the segments
    if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
        return false
    }

    // Return a object with the x and y coordinates of the intersection
    let x = x1 + ua * (x2 - x1)
    let y = y1 + ua * (y2 - y1)

    return {x, y}
}

export function addToPoint(p1, p2) {
    return {
        x: p1.x + p2.x, 
        y: p1.y + p2.y
    } 
}

Victor.prototype.projectOnto = function(v2) {

    var coeff = ( (this.x * v2.x) + (this.y * v2.y) ) / ( (v2.x * v2.x) + (v2.y * v2.y) )
    this.x = coeff * v2.x
    this.y = coeff * v2.y
    return this
} 

export function getScalarProjectionPoint(po, ao, bo) {
    //console.log("before victor",p,a,b);

    //Point d'origine du segment
    const a = new Victor(ao.x, ao.y)
    //Point de destination du segment
    const b = new Victor(bo.x, bo.y)
    //Projection de la position de l'enemy
    const p = new Victor(po.x, po.y)//.subtract(a)
    
    //Vecteur representant le segment
    let ab = b.clone().subtract(a)
    
    // {x:?? + a.x, y: ?? + a.y}
    return p.projectOnto(ab).add(a).toObject()
}
