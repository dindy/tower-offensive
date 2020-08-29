import { getDistance } from "./utilities"
import { 
    getPositionOnLine, 
    rectangleIntersectsRectangle, 
    angle,
    degreesToRadians, 
    angleDifference,
    angleDirection,
    getProjectionPoint,
    getIntersectionPoint,
} from './utilities'
import { randomBetween } from "../../../tower-offensive_LightningTest/tower-offensive/src/utilities"


export default class Lightning {

    constructor(level, originPoint){
        this.level = level
        this.originPoint = originPoint
        this.arcs = []
        this.nbPaths = 2
        this.defaultSegmentLength = 5 // px
        /*
        arc = {
            paths : [
                [ { origin,target }, { }, ...],
                [ { origin,target }, { }, ...],
            ]
        }
        */
    }

    createPath(originCoords,targetCoords) {

                        

    }

    /**
     * 
     * @param {Array} targets Tableau d'objet contenant toutes les coordonnées
     * @param {Number} diffTimestamp 
     */
    update(targets, diffTimestamp) {


        /**
            Lightning > Arc > Path > segment
        */
        
        this.arcs = []

        // Pour chaque ennemy on construit un arc
        for (let i = 0; i < targets.length; i++) {
            
            const arcTargetCoords  = targets[i];
            const arcOriginCoords = (i === 0) ? this.originPoint : targets[i-1]
            
            for (let j = 0; j < this.nbPaths; j++) {
                const path = []
                const length = j == 0 ? this.defaultSegmentLength * 1 : this.defaultSegmentLength
                const arcDistance = getDistance(arcOriginCoords.x, arcOriginCoords.y, arcTargetCoords.x, arcTargetCoords.y)
                const rawSegmentNb = arcDistance / (length)
                let segmentNb = Math.floor(rawSegmentNb)
                
                const segmentLength = arcDistance / segmentNb
    
                const arcAngle = angle(arcOriginCoords.x, arcOriginCoords.y, arcTargetCoords.x, arcTargetCoords.y)                
                
                // Pour chaque arc du segment
                for (let k = 0; k <= segmentNb; k++) {
                    // Creer les points de references
                    const centerPoint = {
                        x : arcOriginCoords.x + getProjectionPoint(segmentLength * k+1, arcAngle).x,
                        y : arcOriginCoords.y + getProjectionPoint(segmentLength * k+1, arcAngle).y
                    }
    
                    const upperPoint = {
                        x : centerPoint.x + getProjectionPoint(500, arcAngle + 90).x,
                        y : centerPoint.y + getProjectionPoint(500, arcAngle + 90).y
                    }
    
                    const lowerPoint = {
                        x : centerPoint.x + getProjectionPoint(500, arcAngle -90).x,
                        y : centerPoint.y + getProjectionPoint(500, arcAngle -90).y
                    }
                    //
    
                    let segmentOriginPoint
                    let segmentTargetPoint
                    if(k === 0) segmentOriginPoint = arcOriginCoords
                    else segmentOriginPoint = path[k-1].segmentTargetPoint
    
                    const segmentAngle = angle(segmentOriginPoint.x, segmentOriginPoint.y, arcTargetCoords.x, arcTargetCoords.y) + randomBetween(-40, 40)
    
                    // Projection de segment
                    if(k != segmentNb){
                        const projectionSegmentTargetPoint = {
                            x: segmentOriginPoint.x + getProjectionPoint(500, segmentAngle).x,
                            y: segmentOriginPoint.y + getProjectionPoint(500, segmentAngle).y
                        }
        
                        segmentTargetPoint = getIntersectionPoint(segmentOriginPoint.x, segmentOriginPoint.y, projectionSegmentTargetPoint.x, projectionSegmentTargetPoint.y, lowerPoint.x, lowerPoint.y, upperPoint.x, upperPoint.y )
                        
                    } else {
                        segmentTargetPoint = arcTargetCoords
                    }
    
                    // 
                    path.push({segmentOriginPoint, segmentTargetPoint})
                }    
                //console.log(path)
                this.arcs.push(path)      
            }
        }
            
    }

    render(layer, diffTimestamp) {
        // console.log(this.arcs);
        
        for (let i = 0; i < this.arcs.length; i++) {
            const arc = this.arcs[i]
            let rdm = randomBetween(-1, 2)

            for (let k = 0; k < arc.length; k++) {


                const segment = arc[k];
                layer.beginPath()
                layer.moveTo(segment.segmentOriginPoint.x, segment.segmentOriginPoint.y)
                layer.lineTo(segment.segmentTargetPoint.x, segment.segmentTargetPoint.y)
                layer.strokeStyle =  "rgba(202, 225, 252, .5)"
                layer.lineWidth = 5 + rdm
                layer.stroke() 
                
                
                layer.beginPath()
                layer.moveTo(segment.segmentOriginPoint.x, segment.segmentOriginPoint.y)
                layer.lineTo(segment.segmentTargetPoint.x, segment.segmentTargetPoint.y)
                layer.strokeStyle =  "rgba(148, 196, 255, .2)"
                layer.lineWidth = 3 + rdm
                layer.stroke()

                 

                layer.beginPath()
                layer.moveTo(segment.segmentOriginPoint.x, segment.segmentOriginPoint.y)
                layer.lineTo(segment.segmentTargetPoint.x, segment.segmentTargetPoint.y)
                layer.strokeStyle =  "rgba(255, 255, 255, 1)"
                layer.lineWidth = 1 + rdm
                layer.stroke() 
            }
        }
    }

}