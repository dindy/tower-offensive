import * as createjs from 'createjs-module'

export default class Enemy {
    
    constructor(level) {
        this.hasBeenRendered = false
        this.level = level
    }
    
    initRender = layer => {
        this.shape = new createjs.Shape()
        this.shape.graphics
            .beginFill('red')
            .drawRect(0, 0, 50, 50)
        
        layer.addChild(this.shape)
        this.hasBeenRendered = true
    }
    
    updatePosition = () => {
        
        // Récupère la cellule du path sur laquelle est l'ennemi

        // Tableau des items du path
        const path = this.level.config.map.path
        // Index de colonne et de ligne de la cellule courante
        const currentCellCol = Math.floor(this.x / this.level.game.cellSize)
        const currentCellRow = Math.floor(this.y / this.level.game.cellSize)
        // Cellule courante
        const cell = this.level.gridCells
            .filter(cell => cell.column == currentCellCol)
            .filter(cell => cell.row == currentCellRow)
            [0]
        // Item du path qui correspond à la cellule courante
        // avec l'index du tableau du path qui correspond
        // + le prochain index du tableau du path
        const currentPathItemIndex = path
            .map((cellId, index) => ({cellId, pathIndex: index, nextPathIndex: index + 1})) 
            .filter((pathItem) => pathItem.cellId == cell.id) 
            [0]

        // La cellule d'après
        const nextCell = this.level.gridCells[path[currentPathItemIndex.nextPathIndex]]
        

        // Déterminer les 3 points de la courbe de bézier OU passer sur une ligne droite

        // Calculer les prochaines coordonnées
    }

    update = () => {
        this.updatePosition()
    } 

    render = (layer) => {

        if (!this.hasBeenRendered) this.initRender(layer)

        this.shape.x = this.x
        this.shape.y = this.y
    }

}