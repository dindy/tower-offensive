import { 
    getDistance,
    getPositionOnLine, 
    rectangleIntersectsRectangle, 
    angle,
    degreesToRadians, 
    angleDifference,
    angleDirection,
    getProjectionPoint,
    getIntersectionPoint,
    randomBetween,
} from './utilities'

/**
    Lightning > Arc > Path > segment
*/
export default class Lightning {

    constructor(level, originPoint){
        this.level = level
        this.originPoint = originPoint
        this.arcs = []
        this.nbPaths = 2
        this.defaultSegmentLength = 5 // px
    }

    createPath(arcOriginCoords, arcTargetCoords, arcAngle, segmentLength, segmentNb) {
        
        const path = []

        for (let k = 0; k <= segmentNb; k++) {
            
            let segmentOriginPoint
            let segmentTargetPoint
            const randomAngleVariation = randomBetween(-40, 40)
            const projectionDistance = 500
            
            const addToPoint = (p1, p2) => ({ 
                x: p1.x + p2.x, 
                y: p1.y + p2.y, 
            }) 

            // Creer les points de references
            const centerProjectionPoint = getProjectionPoint(segmentLength * k + 1, arcAngle)
            const centerPoint = addToPoint(arcOriginCoords, centerProjectionPoint)

            const upperProjectionPoint = getProjectionPoint(projectionDistance, arcAngle + 90) 
            const upperPoint = addToPoint(centerPoint, upperProjectionPoint) 

            const lowerProjectionPoint = getProjectionPoint(projectionDistance, arcAngle - 90)
            const lowerPoint = addToPoint(centerPoint, lowerProjectionPoint) 

            if (k === 0) segmentOriginPoint = arcOriginCoords
            else segmentOriginPoint = path[k-1].segmentTargetPoint
            
            const segmentAngle = angle(segmentOriginPoint.x, segmentOriginPoint.y, arcTargetCoords.x, arcTargetCoords.y) + randomAngleVariation

            //Projection de segment
            if (k != segmentNb) {

                const projectionPoint = getProjectionPoint(projectionDistance, segmentAngle)
                const projectionSegmentTargetPoint = addToPoint(segmentOriginPoint, projectionPoint) 
                
                segmentTargetPoint = getIntersectionPoint(
                    segmentOriginPoint.x, 
                    segmentOriginPoint.y, 
                    projectionSegmentTargetPoint.x, 
                    projectionSegmentTargetPoint.y, lowerPoint.x, lowerPoint.y, upperPoint.x, upperPoint.y 
                )
                
            } else {
                segmentTargetPoint = arcTargetCoords
            }

            path.push({segmentOriginPoint, segmentTargetPoint})
        } 

        return path
    }

    createArc(arcOriginCoords, arcTargetCoords) {

        const arc = []

        for (let j = 0; j < this.nbPaths; j++) {
            
            const arcDistance = getDistance(arcOriginCoords.x, arcOriginCoords.y, arcTargetCoords.x, arcTargetCoords.y)

            const rawSegmentNb = arcDistance / this.defaultSegmentLength
            
            const segmentNb = Math.floor(rawSegmentNb)
            
            const segmentLength = arcDistance / segmentNb

            const arcAngle = angle(arcOriginCoords.x, arcOriginCoords.y, arcTargetCoords.x, arcTargetCoords.y)
            
            const path = this.createPath(arcOriginCoords, arcTargetCoords, arcAngle, segmentLength, segmentNb)

            arc.push(path)    
        }

        return arc
    }

    createArcs(targets) {

        let arcs = []

        // Pour chaque ennemy on construit un arc
        for (let i = 0; i < targets.length; i++) {
            
            const arcOriginCoords = (i === 0) ? this.originPoint : targets[i-1]
            const arcTargetCoords  = targets[i]
            
            const arc = this.createArc(arcOriginCoords, arcTargetCoords)
            
            arcs.push(arc)
        }   
        
        return arcs
    }
    
    updateArcs(targets) {

        // Arcs électriques de l'éclair
        this.arcs = this.createArcs(targets)
    }

    /**
     * 
     * @param {Array} targets Tableau d'objet contenant toutes les coordonnées
     * @param {Number} diffTimestamp 
     */
    update(targets, diffTimestamp) {

        this.updateArcs(targets)
    }

    renderSegment(layer, segment, lineWidth, rgbaColor) {
        layer.beginPath()
        layer.moveTo(segment.segmentOriginPoint.x, segment.segmentOriginPoint.y)
        layer.lineTo(segment.segmentTargetPoint.x, segment.segmentTargetPoint.y)
        layer.strokeStyle =  rgbaColor
        layer.lineWidth = lineWidth
        layer.stroke() 
    }

    render(layer, diffTimestamp) {
        
        for (let i = 0; i < this.arcs.length; i++) {
            
            const arc = this.arcs[i]
            let rdmLineWidthVariation = randomBetween(-1, 2)

            for (let j = 0; j < arc.length; j++) {
                const path = arc[j]

                for (let k=0; k < path.length; k++){
                    const segment = path[k]

                    //Large glow du segment
                    this.renderSegment(layer , segment, 5 + rdmLineWidthVariation,  "rgba(202, 225, 252, .5)") 
                    
                    //Small glow du segment
                    this.renderSegment(layer , segment, 3 + rdmLineWidthVariation,  "rgba(148, 196, 255, .2)")     
                    
                    //Core du segment
                    this.renderSegment(layer , segment, 1 + rdmLineWidthVariation,  "rgba(255, 255, 255, 1)")                    

                }
            }
        }
    }
}