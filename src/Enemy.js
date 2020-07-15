import * as createjs from 'createjs-module'

// "path":[3, 13, 23, 33, 43, 44, 45, 35, 25, 26, 36, 46, 56, 66, 76, 86, 96]

// [96,86,76,66,56,46,36,26,25,35,45,44,43,33,23,13,3]
//"path":[3, 13, 23, 22, 21, 31, 41, 42, 43, 44, 45, 46, 36, 26, 25, 24, 14, 15, 16, 17, 18, 28, 38, 48, 58, 68, 67, 66, 76, 86, 96]
export default class Enemy {
    
    constructor(level) {
        this.hasBeenRendered = false
        this.level = level
        this.pathFinding = null
        this.offset = 0
        this.speed = 0.05// px / 1 ms
        this.currentCellIndex = null
        this.isBack = false
    }
    
    initRender = layer => {
        this.shape = new createjs.Shape()
        this.shape.graphics
            .beginFill('red')
            .drawRect(0, 0, 10, 10)
        this.shape.regX = 5
        this.shape.regY = 5
        layer.addChild(this.shape)
        this.hasBeenRendered = true
    }
    
    // Rename to updatePathFinding ou setPathFinding ?
    calculatePathFinding = () => {
        //Tableau des indexs des cellules du path
        const path = this.level.config.map.path

        //Tableau des cellules du path
        const pathCells = this.level.config.map.path.map(cellIndex => this.level.gridCells[cellIndex])
        
        // Check si c'est la 1er fois et selectionne la 1ere celulle du path
        if (this.currentCellIndex == null) {
            this.currentCellIndex = 0
        }
        else if (!this.isBack){
            this.currentCellIndex++ 
        } else {
            this.currentCellIndex--
        }


 
        let cell
        let nextCell
        let previousCell

        if(typeof pathCells[this.currentCellIndex + 1] == "undefined" && !this.isBack){
            this.isBack = true
        }

        if(!this.isBack){
            cell = pathCells[this.currentCellIndex]
            nextCell = pathCells[this.currentCellIndex + 1]
            previousCell = pathCells[this.currentCellIndex - 1]
        } else {
            cell = pathCells[this.currentCellIndex]
            nextCell = pathCells[this.currentCellIndex - 1]
            previousCell = pathCells[this.currentCellIndex + 1]
        }
         
        //Return la direction de l'enemy - A EXTRAIRE ?
        // Transformer en méthode ex: cell.getDirection(nextCell) -> 'up'
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

        //Return la side de la cell sur laquelle l'enemy se trouve - A EXTRAIRE ?
        // Transformer en méthode ex: cell.getSide(previousCell) -> 'up'
        const getCurrentCellSide = (currentCell, previousCell) => {

            return getDirection(currentCell, previousCell)
        }
        
        // 1er point d'origine = position de l'enemy
        const originPoint = {
            x: this.x,
            y: this.y
        }
        
        // Declare les autres points
        let endPoint = {}
        let middlePoint = {}

        // Get direction et la side actuelle
        const direction = getDirection(cell, nextCell)

        let currentCellSide = null
        if (typeof previousCell === 'undefined' && this.isBack) {
            currentCellSide = direction
            console.log(currentCellSide);

            if(currentCellSide == "up"){
                endPoint = originPoint
                middlePoint.x = endPoint.x
                middlePoint.y = originPoint.y + (this.level.game.cellSize)
            }
            this.pathFinding = { originPoint, middlePoint, endPoint, time: 0}
            return

        } else if (typeof previousCell === 'undefined' && !this.isBack) {
            if (direction == 'up') currentCellSide = "down" 
            else if (direction == 'down') currentCellSide = "up"
            else if (direction == 'left') currentCellSide = "right"
            else if (direction == 'right') currentCellSide = "left"
        } else {
            currentCellSide = getCurrentCellSide(cell, previousCell) 
        }

        
        // Update middlePoint et endPoint en fonction de la side et de la direction
        // Switch to switch cas ?
        if (direction == "up"){
            // Combine left and right in one if 
            if(currentCellSide == "left"){
                endPoint.x = nextCell.coords.xMax - this.offset
                endPoint.y = nextCell.coords.yMax

                middlePoint.y = originPoint.y
                middlePoint.x = endPoint.x
            } else if(currentCellSide == "right"){
                endPoint.x = nextCell.coords.xMin + this.offset
                endPoint.y = nextCell.coords.yMax

                middlePoint.y = originPoint.y
                middlePoint.x = endPoint.x
            } else {
                endPoint.x = originPoint.x
                endPoint.y = nextCell.coords.yMax

                middlePoint.x = originPoint.x
                middlePoint.y = originPoint.y - (this.level.game.cellSize / 2)
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
                middlePoint.x = originPoint.x - (this.level.game.cellSize / 2)
                middlePoint.y = originPoint.y           
            }


        } else if (direction == "right"){
            
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
        console.log(this.pathFinding)   
        
    }

    updatePosition = (diffTimestamp) => {
        
        
        
        if (this.pathFinding === null ) {
            this.calculatePathFinding()
            
        }
        
        // Utiliser la formule pour avoir le prochain x et y - A EXTRAIRE ?
        // @TODO Isoler les paramètres et mettre dans un fichier utilities.js
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
       
        // Update time passed in a cell
        this.pathFinding.time += diffTimestamp

        // Calculate target time to passed in a cell
        this.pathFinding.totalTime = this.level.game.cellSize / this.speed

        // Update t
        let t = this.pathFinding.time / this.pathFinding.totalTime

        let newCoords = null 
        if (t > 1) {
            t = 1
            newCoords = getBezierPoint(this.pathFinding, t)
            this.pathFinding = null
        } else {
            newCoords = getBezierPoint(this.pathFinding, t)
        } 
            
        // Update le x et y de l'enemy
        this.x = newCoords.x
        this.y = newCoords.y
    
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