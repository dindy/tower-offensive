
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

    if (left || right || top || down) {
        return true
    }

    return false  
}

export function angle(cx, cy, ex, ey) {
    var dy = ey - cy;
    var dx = ex - cx;
    var theta = Math.atan2(dy, dx); // range (-PI, PI]
    theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
    if (theta < 0) theta = 360 + theta; // range [0, 360]
    return theta;
  }


//les coords sur la spritesheet de la premiere img x:0 y:0 , width : 50 height :50 // 4 // 100ms
/*
const sprite = Sprite.getCurrent(difftimeStamp)

                              oX  oY   oW  oH     DX      DY   DW   DH 
layer.drawImage(this.sprite, 100, 50, 100, 50, 0 - 25, 0 - 25, 100, 50)
layer.drawImage(this.sprite, sprite.oX, sprite.oY, sprite.oH, sprite.oW, 0 - 25, 0 - 25, 100, 50)


{
    timer = 0
    offset

    nbOfFrames = 4,
    interval = 150
    y : 0
    width : 100,
    height : 50
    loop : true

    (timer / interval) - (nbOfFrames * (Math.floor((timer / interval) / nbOfFrames)))

    function (timer) {
        
    }

    150 => 1 - (4 * (Math.floor(1 / 4))) => 1
    175 => 175 / 150 - (4 * (Math.floor((175 / 150) / 4)))
        => 1.16 - (4 * (Math.floor(1.16 / 4)))


    getCurrent(difftimestamp){
        this.timer += difftimestamp
        const x = Math.floor((this.timer / this.interval) - (this.nbOfFrames * (Math.floor((this.timer / this.interval) / this.nbOfFrames)))) * this.width
        return [
            x, this.y, this.width, this.height, 0 - this.offset, 0 - this.offset, this.width, this.height
        ]
    }
}

const sprite = new Sprite(sy, offset, width, height, nbFrames, interval)
layer.drawImage(this.sprite, ...sprite.getCurrent(ms))



*/

const test = (ms) => {
    return Math.floor((ms / 150) - (4 * (Math.floor((ms / 150) / 4))) + 1)
}