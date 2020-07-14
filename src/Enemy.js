import * as createjs from 'createjs-module'

export default class Enemy {
    
    constructor(level) {
        this.hasBeenRendered = false
        this.level = level
        this.pathFinding = null
        this.offset = 0
        this.speed = 0.1 // px / 1 ms
        this.currentCellIndex = null
    }
    
    initRender = layer => {
        this.shape = new createjs.Shape()
        this.shape.graphics
            .beginFill('red')
            .drawRect(0, 0, 10, 10)
        
        layer.addChild(this.shape)
        this.hasBeenRendered = true
    }
    
    calculatePathFinding = () => {
        const pathCells = this.level.config.map.path.map(cellIndex => this.level.gridCells[cellIndex])
        if (this.currentCellIndex == null) {
            this.currentCellIndex = 0
        } else {
            this.currentCellIndex++
        }        
        const cell = pathCells[this.currentCellIndex]
        const nextCell = pathCells[this.currentCellIndex + 1]
        const previousCell = pathCells[this.currentCellIndex - 1]
        // // Récupère la cellule du path sur laquelle est l'ennemi
        // // Tableau des items du path
        const path = this.level.config.map.path
        // // Index de colonne et de ligne de la cellule courante
        // const currentCellCol = Math.floor(this.x / this.level.game.cellSize)
        // const currentCellRow = Math.floor(this.y / this.level.game.cellSize)
        // // Cellule courante
        // const cell = this.level.gridCells
        //     .filter(cell => cell.column == currentCellCol)
        //     .filter(cell => cell.row == currentCellRow)
        //     [0]

        // Item du path qui correspond à la cellule courante
        // avec l'index du tableau du path qui correspond
        // + le prochain index du tableau du path
        const currentPathItemIndex = path
            .map((cellId, index) => ({cellId, pathIndex: index, nextPathIndex: index + 1})) 
            .filter((pathItem) => pathItem.cellId == cell.id) 
            [0]

        // La cellule d'après
        // const nextCell = this.level.gridCells[path[currentPathItemIndex.nextPathIndex]]
        
        // cell = {xMin,xMax,yMin,yMax}
        // nextCell = {xMin,xMax,yMin,yMax}
        // trouver l'offset de l'enemy par rapport a xMin ou yMax // Proprieté de enemy
        
        const getDirection = (cell,nextCell) => {
            if(cell.column > nextCell.column){
                return "left"
            } else if (cell.column < nextCell.column){
                return "right"
            } else if (cell.row > nextCell.row){
                return "up"
            } else {
                return "down"
            }
        }

        const getCurrentCellSide = (currentCell, previousCell) => {
            if (typeof previousCell === 'undefined') return "up"
            return getDirection(previousCell, currentCell)
            // if (originPoint.x == cell.xMin) return "left"
            // if (originPoint.x == cell.xMax) return "right"
            // if (originPoint.y == cell.yMin) return "up"
            // if (originPoint.y == cell.yMax) return "bottom" 
        }
        
        // 1er point d'origine = position de l'enemy
        const originPoint = {
            x: this.x,
            y: this.y
        }
        
        //Determiner la direction
        let endPoint = {}
        let middlePoint = {}

        //console.log("cell", cell)
       // console.log("nextCell", nextCell)

        const direction = getDirection(cell, nextCell)
        const currentCellSide = getCurrentCellSide(cell, previousCell) 

        console.log(direction)

        if (direction == "up"){
            if(currentCellSide == "left"){
                endPoint.x = nextCell.coords.xMax - this.offset
                endPoint.y = nextCell.coords.yMin

                middlePoint.y = originPoint.y
                middlePoint.x = endPoint.x
            } else if(currentCellSide == "right"){
                endPoint.x = nextCell.coords.xMin + this.offset
                endPoint.y = nextCell.coords.yMin

                middlePoint.y = originPoint.y
                middlePoint.x = endPoint.x
            } else {
                endPoint.x = originPoint.x
                endPoint.y = nextCell.coords.yMax

                middlePoint.x = originPoint.x
                middlePoint.y = originPoint.y + (this.level.game.cellSize / 2)
            }

        } else if (direction == "down"){
            if(currentCellSide == "left"){
                endPoint.x = nextCell.coords.xMin + this.offset
                endPoint.y = nextCell.coords.yMin
                middlePoint.y = originPoint.y
                middlePoint.x = endPoint.x
            } else if(currentCellSide == "right"){
                endPoint.x = nextCell.coords.xMax - this.offset
                endPoint.y = nextCell.coords.yMin
                middlePoint.x = endPoint.x
                middlePoint.y = originPoint.y
            } else {
                endPoint.x = originPoint.x
                endPoint.y = nextCell.coords.yMin
                middlePoint.x = originPoint.x
                middlePoint.y = originPoint.y + (this.level.game.cellSize / 2) 
            }


        } else if (direction == "left"){
            if(currentCellSide == "up"){
                endPoint.x = nextCell.coords.xMax
                endPoint.y = nextCell.coords.yMax - this.offset
                middlePoint.y = endPoint.y
                middlePoint.x = originPoint.x
            } else if(currentCellSide == "down"){
                endPoint.x = nextCell.coords.xMax
                endPoint.y = nextCell.coords.yMin + this.offset
                middlePoint.y = endPoint.y
                middlePoint.x = originPoint.x                 
            } else {
                endPoint.x = nextCell.coords.xMax
                endPoint.y = originPoint.y
                middlePoint.x = originPoint.x + (this.level.game.cellSize / 2)
                middlePoint.y = originPoint.y           
            }


        } else if (direction == "right"){
            
            console.log('passss', currentCellSide);
            if(currentCellSide == "up"){
                
                endPoint.x = nextCell.coords.xMin
                endPoint.y = nextCell.coords.yMin + this.offset
                middlePoint.x = originPoint.x
                middlePoint.y = endPoint.y
            } else if(currentCellSide == "down"){
                endPoint.x = nextCell.coords.xMin
                endPoint.y = nextCell.coords.yMax - this.offset
                middlePoint.x = originPoint.x
                middlePoint.y = endPoint.y
            } else {
                endPoint.x = nextCell.coords.xMin
                endPoint.y = originPoint.y
                middlePoint.x = originPoint.x + (this.level.game.cellSize / 2)
                middlePoint.y = originPoint.y  
            }
            
        }
        
        this.pathFinding = { originPoint, middlePoint, endPoint, time: 0}        
    }

    updatePosition = (diffTimestamp) => {
        
        
        
        if (this.pathFinding === null /*|| 
            (this.pathFinding.endPoint.x === this.x && this.pathFinding.endPoint.y === this.y)*/
        ) {
            this.calculatePathFinding()
            console.log(this.pathFinding)
        }
        
        // Utiliser la formule pour avoir le prochain x et y
        const getBezierPoint = (pathFinding, t) => {

            const x1 = pathFinding.originPoint.x
            const x2 = pathFinding.middlePoint.x 
            const x3 = pathFinding.endPoint.x

            const y1 = pathFinding.originPoint.y
            const y2 = pathFinding.middlePoint.y 
            const y3 = pathFinding.endPoint.y            
            
            // x = (1−t)^2 * x1 + 2 * (1−t) * t * x2 + t^2 * x3
            // y = (1−t)^2 * y1 + 2 * (1−t) * t * y2 + t^2 * y3
             
            return { 
                x : Math.pow((1 - t), 2) * x1 + 2 * (1 - t) * t * x2 + Math.pow(t, 2) * x3,
                y : Math.pow((1 - t), 2) * y1 + 2 * (1 - t) * t * y2 + Math.pow(t, 2) * y3
            }
            
        }
        // console.log(this.pathFinding.time);
        
        this.pathFinding.time += diffTimestamp
        this.pathFinding.totalTime = this.level.game.cellSize / this.speed
        const t = this.pathFinding.time / this.pathFinding.totalTime
        
        if (t > 1) {
            this.pathFinding = null
        } else {
            const newCoords = getBezierPoint(this.pathFinding, t)
            console.log(newCoords);
            // Update le x et y de l'enemy
            this.x = newCoords.x
            this.y = newCoords.y
        }
    
    }

    update = (diffTimestamp) => {
        this.updatePosition(diffTimestamp)
    } 

    render = (layer) => {

        if (!this.hasBeenRendered) this.initRender(layer)

        this.shape.x = this.x
        this.shape.y = this.y
    }

}