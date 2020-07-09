export default class Enemy {
    
    constructor() {
        this.x = Math.floor(Math.random() * 50)
        this.y = Math.floor(Math.random() * 50)
        this.size = 10
    }
    
    initRender = (layer) => {
        this.konvaObject = new Konva.Circle({
            x: this.x / 2,
            y: this.y,
            radius: this.size,
            fill: 'red',
            stroke: 'black',
            strokeWidth: 1,
          })
          layer.add(this.konvaObject)
    }

    render = (layer,stage) => {
        this.konvaObject.x = this.x
        console.log(this.konvaObject.x);
        
        // layer.add(this.konvaObject)
        // stage.add(layer)
        
    }
}