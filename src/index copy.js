import konva from 'konva'

window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                              window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

const cellSize = 50
const nbCells = 10
const width = cellSize * nbCells
const height = cellSize * nbCells

const path = [
    {x: 2, y: 1},
    {x: 2, y: 2},
    {x: 2, y: 3},
    {x: 2, y: 4},
    {x: 2, y: 5},
    {x: 3, y: 5},
    {x: 4, y: 5},
    {x: 5, y: 5},
    {x: 5, y: 6},
    {x: 5, y: 7},
    {x: 5, y: 8},
    {x: 5, y: 9},
    {x: 5, y: 10}
]

const enemies = [{
    x: 0,
    y: 0,
    isReturning: false,
    isRendered: false,
    speed: 200 // Px par 1000 ms
}]

//==========================================================

function render(progress) {
    layer.destroyChildren()
    enemies.forEach((enemy, index) => renderEnemy(enemy, progress, index) )
    stage.add(layer);
    layer.draw();
}

function generateSpawnCoords(spawnCellCoords, fromSide) {
    if(fromSide){
        return {
            x: 0,
            y: spawnCellCoords.y.min + Math.floor(Math.random() * cellSize)
        }
    } else {
        return {
            x: spawnCellCoords.x.min + Math.floor(Math.random() * cellSize),
            y: 0
        }
    }
}

function getCurrentCellIndex(enemy) {
    const cell = {
        x : Math.floor(enemy.x / cellSize) + 1,
        y : Math.floor(enemy.y / cellSize) + 1
    }
    for (let i = 0; i < path.length; i++) {
        const pathCell = path[i];
        if(cell.x == pathCell.x && cell.y == pathCell.y){
            return i
        }
    }
}

function getCellCoordsFromCell(cell) {
    return {
        x: {
            min: cell.x * cellSize - cellSize,
            max: cell.x * cellSize
        },
        y: {
            min: cell.y * cellSize - cellSize,
            max: cell.y * cellSize
        }
    }
}

function renderEnemy(enemy, progress, index) {
    if (!enemy.isRendered) {
        const spawnCell = path[0]
        const fromSide = !spawnCell.x === 1 
        const spawnCellCoords = getCellCoordsFromCell(spawnCell)
        const spawnCoords = generateSpawnCoords(spawnCellCoords,fromSide)
        const renderedEnemy = new Konva.Circle({
            x: spawnCoords.x,
            y: spawnCoords.y,
            radius: cellSize/4,
            fill: 'red',
            stroke: 'black',
            strokeWidth: 4
          });
          layer.add(renderedEnemy);
          enemy.isRendered = true
          enemy.x = spawnCoords.x
          enemy.y = spawnCoords.y
    } else {
        
        const coords = nextCoordsOfEnemy(enemy, progress)
        if(typeof coords === "undefined"){
            console.log("HOP");
            
            enemies.splice(index,1)
            return
        }
        const {x, y} = coords
        const renderedEnemy = new Konva.Circle({
            x,y,
            radius: cellSize/4,
            fill: 'red',
            stroke: 'black',
            strokeWidth: 4
          });
          layer.add(renderedEnemy);
          enemy.x = x
          enemy.y = y
    }
}

function nextCoordsOfEnemy(enemy, progress) {
    console.log(enemies[0]);
    const currentCellIndex = getCurrentCellIndex(enemy)
    const currentCell = path[currentCellIndex]
    //const currentCellCoordsBoundaries = getCellCoordsFromCell(currentCell)
    let nextCellIndex
    if(!enemy.isReturning){
        if(currentCellIndex === path.length - 1){
            enemy.isReturning = true
            nextCellIndex = currentCellIndex
        }else{
            nextCellIndex = currentCellIndex + 1
        }
    } else {
        if(currentCellIndex < 1){
            nextCellIndex = 0
            
            if(enemy.x < 0 || enemy.y < 0.5){
                console.log("hop")
                return undefined
            }
        } else {
            nextCellIndex = currentCellIndex - 1
        }

    }
    //console.log(nextCellIndex);
    
    const nextCell = path[nextCellIndex]

    //const nextCellCoordsBoundaries = getCellCoordsFromCell(nextCell)
    let displacement = progress * enemy.speed / 1000   
    if (enemy.isReturning){
        displacement = displacement * -1
    }
    if(currentCell.x === nextCell.x){ 
        //console.log(displacement);
        
        return {
            x: enemy.x,
            y: enemy.y + displacement
        }
    } else {       
        return {
            x: enemy.x + displacement,
            y: enemy.y
        }

    }

}


// first we need to create a stage
var stage = new Konva.Stage({
    container: 'container',   // id of container <div>
    width,
    height
  });

// then create layer
var layer = new Konva.Layer()

var start = null;

function step(timestamp) {
    var progress;
    if (start === null) start = timestamp;
    progress = timestamp - start;
    start = timestamp
    
    render(progress)

    
    requestAnimationFrame(step);
}

requestAnimationFrame(step);