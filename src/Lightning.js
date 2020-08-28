

export default class Lightning {

    constructor(level, originPoint){
        this.level = level
        this.originPoint = originPoint
        this.arcs = []
        /*
        arc = {
            paths : [
                [ { origin,target }, { }, ...],
                [ { origin,target }, { }, ...],
            ]
        }
        */
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
        for (let i = 0; i < targets.length; i++) {
            
            const targetCoords  = targets[i];
            const originCoords = (i === 0) ? this.originPoint : targets[i-1]
            
            this.arcs.push({originCoords,targetCoords})
        }
    }

    render(layer, diffTimestamp) {
        
        for (let i = 0; i < this.arcs.length; i++) {
            const arc = this.arcs[i]
            
            layer.beginPath()
            layer.moveTo(arc.originCoords.x, arc.originCoords.y)
            layer.lineTo(arc.targetCoords.x, arc.targetCoords.y)
            layer.strokeStyle =  "#FFF"
            layer.lineWidth = 3
            layer.stroke() 
            
        }
    }

}