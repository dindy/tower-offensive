export default class Enemy {
    
    constructor() {

    }
    
    render = (layer) => {
        var enemy = new Konva.Circle({
            x: this.x,
            y: this.y,
            radius: 10,
            fill: 'red',
            stroke: 'black',
            strokeWidth: 1,
          });
          layer.add(enemy)
    }
}