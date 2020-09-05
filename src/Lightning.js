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
        this.defaultSegmentLength = 10 // px
    }

    createPath(arcOriginCoords, arcTargetCoords, arcAngle, segmentLength, segmentNb) {
        
        const path = []

        for (let k = 0; k <= segmentNb; k++) {
            
            let segmentOriginPoint
            let segmentTargetPoint
            const randomAngleVariation = randomBetween(-30, 30)
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

    createArc(arcOrigin, arcTarget) {

        const arc = []

        for (let j = 0; j < this.nbPaths; j++) {
            
            const arcDistance = getDistance(arcOrigin.coords.x, arcOrigin.coords.y, arcTarget.coords.x, arcTarget.coords.y)

            let rawSegmentNb 
            
            if(j === 0)  rawSegmentNb = arcDistance / this.defaultSegmentLength
            else  rawSegmentNb = arcDistance / (this.defaultSegmentLength / 1.5)

            const segmentNb = Math.floor(rawSegmentNb)
            
            const segmentLength = arcDistance / segmentNb

            const arcAngle = angle(arcOrigin.coords.x, arcOrigin.coords.y, arcTarget.coords.x, arcTarget.coords.y)
            
            const path =  this.createPath(arcOrigin.coords, arcTarget.coords, arcAngle, segmentLength, segmentNb)

            arc.push(path)    
        }

        return {
            originId: arcOrigin.id,
            targetId: arcTarget.id,
            originCoords: arcOrigin.coords,
            targetCoords: arcTarget.coords,
            paths: arc,
            timer: 0
        }
    }

    createArcs(targets) {

        let arcs = []

        // Pour chaque ennemy on construit un arc
        for (let i = 0; i < targets.length; i++) {
            
            const arcTarget = targets[i]
            let arcOrigin = null
            
            if (i === 0) arcOrigin = { coords: this.originPoint, id: 0 }
            else arcOrigin = targets[i-1]
            
            const existingPair = this.arcs.filter(arc => arc.originId == arcOrigin.id && arc.targetId == arcTarget.id)
            
            let arc = null

            if (existingPair.length !== 0 && existingPair[0].timer < 50) {
                arc = this.updateArcExtremities(existingPair[0], arcOrigin, arcTarget)
            } else {
                arc = this.createArc(arcOrigin, arcTarget)                
            }

            arcs.push(arc)
        }   
        
        return arcs
    }
    
    updateArcExtremities(arc, arcOrigin, arcTarget) {

        for (let i = 0; i < arc.paths.length; i++) {
            arc.paths[i][0].segmentOriginPoint = arcOrigin.coords
            arc.paths[i][arc.paths[i].length - 1].segmentTargetPoint = arcTarget.coords
        }
        arc.originCoords = arcOrigin.coords
        arc.targetCoords = arcTarget.coords

        return arc
    }

    updateArcs(targets, diffTimestamp) {

        for (let i = 0; i < this.arcs.length; i++) {
            this.arcs[i].timer += diffTimestamp
        }

        // Arcs électriques de l'éclair
        this.arcs = this.createArcs(targets)
    }

    /**
     * 
     * @param {Array} targets Tableau d'objet contenant toutes les coordonnées
     * @param {Number} diffTimestamp 
     */
    update(targets, diffTimestamp) {

        this.updateArcs(targets, diffTimestamp)
    }
    
    renderHalos(layer, arcs){
        for (let i = 0; i < arcs.length; i++) {
            const arc = arcs[i]
            layer.beginPath()
            layer.arc(arc.targetCoords.x, arc.targetCoords.y, 10, 0, 2 * Math.PI)
            layer.fillStyle = "rgba(202, 225, 252, .3)"
            layer.fill()
    
            layer.beginPath()
            layer.arc(arc.targetCoords.x, arc.targetCoords.y, 5, 0, 2 * Math.PI)
            layer.fillStyle = "rgba(255, 255, 255, .5)"
            layer.fill()
        }

        layer.beginPath()
        layer.arc(arcs[0].originCoords.x, arcs[0].originCoords.y, 10, 0, 2 * Math.PI)
        layer.fillStyle = "rgba(202, 225, 252, .3)"
        layer.fill()

        layer.beginPath()
        layer.arc(arcs[0].originCoords.x, arcs[0].originCoords.y, 5, 0, 2 * Math.PI)
        layer.fillStyle = "rgba(255, 255, 255, .5)"
        layer.fill()
        
    }

    renderSegments(layer, segments){ 
        
        layer.moveTo(segments[0].segmentOriginPoint.x, segments[0].segmentOriginPoint.y)
        
        for (let k=0; k < segments.length; k++){
            const segment = segments[k]
            layer.lineTo(segment.segmentTargetPoint.x, segment.segmentTargetPoint.y)
        }  
    }

    renderArcs(layer, arcs, lineColor, lineWidth, pathIndex){
        
        layer.beginPath()
        layer.strokeStyle =  lineColor
        layer.lineWidth = lineWidth

        // Pour chaque arc 
        for(let i=0; i < arcs.length; i++) {
            const arc = arcs[i]
            const path = arc.paths[pathIndex]
            // On rend les segments 
            this.renderSegments(layer,path)
        }
        layer.stroke()
    }

    render(layer, diffTimestamp) {
        let rdmLineWidthVariation = randomBetween(0, 3)
        layer.lineJoin  = "round"
        this.renderArcs(layer, this.arcs, "#FFF", .8, 1)
        this.renderArcs(layer, this.arcs, "rgba(255, 232, 158, .2)", 15 + rdmLineWidthVariation, 0)
        this.renderArcs(layer, this.arcs, "rgba(202, 225, 252, .5)", 5 + rdmLineWidthVariation, 0)
        this.renderArcs(layer, this.arcs, "rgba(148, 196, 255, .2)", 3 + rdmLineWidthVariation, 0)
        this.renderArcs(layer, this.arcs, "#FFF", 1 + randomBetween(0, 2), 0)
        this.renderHalos(layer, this.arcs)    

    }
}

