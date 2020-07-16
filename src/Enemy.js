import * as createjs from 'createjs-module'
import * as utilities from "./utilities.js"


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

        //Si l'aller est finit, start le retour
        if(typeof pathCells[this.currentCellIndex + 1] == "undefined" && !this.isBack){
            this.isBack = true
        }

        // Aller
        if(!this.isBack){
            cell = pathCells[this.currentCellIndex]
            nextCell = pathCells[this.currentCellIndex + 1]
            previousCell = pathCells[this.currentCellIndex - 1]
        } 
        //Retour
        else {
            cell = pathCells[this.currentCellIndex]
            nextCell = pathCells[this.currentCellIndex - 1]
            previousCell = pathCells[this.currentCellIndex + 1]
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
        const direction = cell.getDirection(nextCell)
        let currentCellSide = null

        // Derniere cell du path, demi-tour
        if (typeof previousCell === 'undefined' && this.isBack) {
            
            currentCellSide = direction
           
            if(currentCellSide == "up"){
                endPoint = originPoint
                middlePoint.x = endPoint.x
                middlePoint.y = originPoint.y + (this.level.game.cellSize)
            }

            this.pathFinding = { originPoint, middlePoint, endPoint, time: 0}

            return

        } 

        // Premiere cell du path
        else if (typeof previousCell === 'undefined' && !this.isBack) {
            if (direction == 'up') currentCellSide = "down" 
            else if (direction == 'down') currentCellSide = "up"
            else if (direction == 'left') currentCellSide = "right"
            else if (direction == 'right') currentCellSide = "left"
        } 

        // Toutes les autres cells du path
        else {
            currentCellSide = cell.getSide(previousCell) 
        }

        
        // Update middlePoint et endPoint en fonction de la side et de la direction
        // Switch to switch case ?
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
        
        // Update time passed in a cell
        this.pathFinding.time += diffTimestamp

        // Calculate target time to passed in a cell
        this.pathFinding.totalTime = this.level.game.cellSize / this.speed

        // Update t
        let t = this.pathFinding.time / this.pathFinding.totalTime

        let newCoords = null 
        const x1 = this.pathFinding.originPoint.x
        const x2 = this.pathFinding.middlePoint.x 
        const x3 = this.pathFinding.endPoint.x

        const y1 = this.pathFinding.originPoint.y
        const y2 = this.pathFinding.middlePoint.y 
        const y3 = this.pathFinding.endPoint.y 
        
       
        if (t > 1) {
            t = 1
            newCoords = utilities.getBezierPoint(x1, y1, x2, y2, x3, y3, t)
            this.pathFinding = null
        } else {
            newCoords = utilities.getBezierPoint(x1, y1, x2, y2, x3, y3, t)
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