import GridCell from './GridCell'

/**
 * Gère la scène, c'est-à-dire me rendu de l'ensemble des layers de la partie animée du jeu. 
 * Lorsque le niveau de zoom est supérieur à 1, la scène est agrandie et seule une partie de celle-ci est visible.
 */
export default class Scene {
    
    // Cellules au-dessus de la map
    gridCells = []

    // Niveau de zoom appliqué à la scène
    zoom = 1

    // Niveau maximum du niveau de zoom
    zoomMax = 3

    // Niveau minimum du niveau de zoom
    zoomMin = 1

    // Facteur par lequel est multiplié le niveau de zoom pour obtenir le coeeficient de zoom
    zoomFactor = 0.4

    // Tanslation de x appliqué au point d'origine de la scène
    x = 0
    
    // Tanslation de y appliqué au point d'origine de la scène
    y = 0

    // Indique si le bouton de la souris est relaché
    isUp = true

    // Valeur x du dernier clic à l'origine d'un déplacement
    startX = null

    // Valeur y du dernier clic à l'origine d'un déplacement
    startY = null

    pathPoints = []

    pathRadius = null

    /**
     * 
     * @param {Game} game 
     */
    constructor(game) {

        this.game = game

        // Elements du DOM utilisés
        this.DOMCanvasContainer = document.getElementById(game.DOMConfig.canvasContainer.id)
        this.DOMScene = document.getElementById(game.DOMConfig.scene.id)
        this.DOMGrid = document.getElementById(game.DOMConfig.grid.id)
        this.DOMWrapper = document.getElementById(game.DOMConfig.wrapper.id) // Zone visible de la scène
        
        // Classes utilisées
        this.cssClass = this.game.DOMConfig.scene.class
        this.cssMovingClass = this.cssClass + this.game.DOMConfig.scene.modifiers.moving 

        // On récupère la config des cellules de base du jeu
        this.cellSize = game.config.cellSize 
        this.nbRows = game.config.nbRows
        this.nbColumns = game.config.nbColumns
        
        // On calcule la taille de la scène (sans zoom, c'est-à-dire les dimensions de la zone visualisable de la scène)
        this.width = this.cellSize * this.nbColumns
        this.height = this.cellSize * this.nbRows
        
        this.setSceneSize()
        
        // On crée les layers de rendu nécessaires
        this.createCellsGridLayer()
        this.createStaticLayer()
        this.createDynamicLayer()      
        
        // On stocke la position de la scène par rapport au document
        this.position = this.DOMScene.getBoundingClientRect()

        this.setPathPoints()
        this.setPathRadius()
    }

    setPathRadius() {
        this.pathRadius = this.game.config.cellSize / 2
    }

    setPathPoints() {
        const { path, from, to } = this.game.currentLevel.config.map 
        
        this.pathPoints = path
            .map(cellIndex => this.gridCells[cellIndex])
            .reduce((allPoints, cell, cellIndex )=> {
                const cellCoords = cell.getCenterPoint()
                if (cellIndex === 0) {
                    if (from === "top") return [{ ...cellCoords, y: 0}]
                    if (from === "bottom") return [{ ...cellCoords, y: this.height}]
                    if (from === "left") return [{ ...cellCoords, x: 0}]
                    if (from === "right") return [{ ...cellCoords, x: this.width}]
                } else if (cellIndex === path.length - 1) {
                    if (to === "top") return [...allPoints, { ...cellCoords, y: cell.coords.yMin}]
                    if (to === "bottom") return [...allPoints, { ...cellCoords, y: cell.coords.yMax}]
                    if (to === "left") return [...allPoints, { ...cellCoords, x: cell.coords.xMin}]
                    if (to === "right") return [...allPoints, { ...cellCoords, x: cell.coords.xMax}]                    
                }
                const previousCellCoords = this.gridCells[path[cellIndex - 1]].getCenterPoint()

                const previous = allPoints[allPoints.length - 1]
                
                if (previous.x === cellCoords.x || previous.y === cellCoords.y) return allPoints
                return [...allPoints, previousCellCoords] 
            }, [])
    }

    setSceneSize() {
        this.DOMWrapper.style.width = this.width + 'px'
        this.DOMWrapper.style.height = this.height + 'px'
        this.DOMScene.style.width = this.width + 'px'
        this.DOMScene.style.height = this.height + 'px'
    }

    
    /**
     * Gère le clic qui déclenche un déplacement de la scène
     * @param {Event} event 
     */
    touchstartHandler(event) {
        
        // On vérifie que le clic a eu lieu sur la grid
        if (!event.target.classList.contains(this.game.DOMConfig.gridCell.class)) return
        
        // On évite la propagation
        event.preventDefault()

        // On stocke les coordonnées du clic
        this.startX = event.pageX - this.x
        this.startY = event.pageY - this.y

        // On indique que le bouton de la souris est pressé
        this.isUp = false
        
        // On ajoute une classe à la scène pour enlever temporairement l'effet de transition CSS
        this.DOMScene.classList.add(this.cssMovingClass)
    }
    
    /**
     * Gère le mouvement de la souris qui déplacent la scène
     * @param {Event} event 
     */
    touchmoveHandler(event){
        
        // Si le bouton de la souris est relevé, l'utilisateur n'est pas en train de déplacer la scène
        if (this.isUp) return 
        
        // On calcule la nouvelle translation en faisant la différence entre les coordonnées du clic d'origine et celles de la souris à l'instant t
        // On utilise getNormalized pour s'assurer que la scène ne soit pas déplacée en-dehors de la zone de visualisation 
        let newX = this.getNormalizedX(event.pageX - this.startX)
        let newY = this.getNormalizedY(event.pageY - this.startY)

        // On applique la translation et on rétablit également le niveau de zoom
        this.DOMScene.style.transform = `
            translate3d(
                ${newX}px,
                ${newY}px,
                0
            ) 
            scale(
                ${this.getZoomCoef()}
            )`         

    }
    
    /**
     * Gère le relachement du bouton de la souris lors d'un déplacement
     * @param {Event} event 
     */
    touchendHandler(event){
        
        // Si le clic a été initié en-dehors de la scène il ne faut pas prendre en compte l'évènement
        if (this.isUp) return

        // On enlève la classe qui empêche la transition de la scène
        this.DOMScene.classList.remove(this.cssMovingClass)
       
        // On enregistre les dernières coordonnées en prenant soin de controler les valeurs avec getNormalized
        this.x = this.getNormalizedX(event.pageX - this.startX)
        this.y = this.getNormalizedY(event.pageY - this.startY)

        // On indique que le bouton de la souris est relaché
        this.isUp = true
    }

    /**
     * Vérifie que la valeur (c) de la translation appliquée au point d'origine de la scène (top-left) 
     * sur l'axe des absysses ou des ordonnées n'excède pas les limites de la zone de visualisation.
     * 
     * Si les limites ne sont pas respectées, la valeur maximale de la translation sur l'axe est retournée
     * 
     * @param {Numeric} c Valeur de la translation appliquée à x ou y 
     * @param {Numeric} Longueur visible de l'axe de la scène sur la zone de visualisation (longueur ou largeur du canvas)
     */
    getNormalizedCoordinate(c, max) {

        // Si le zoom est à 1 la scène est déjà dans la seule position possible
        // Le point d'origine (top-left) ne peut être supérieur à 0 sur x ou y
        if (this.zoom == 1 || c > 0) return 0

        // On ramène la longueur de l'axe au niveau de zoom actuel et on prend son opposé
        const maxOffset = max * this.getZoomCoef() * -1

        // La position du côté opposé à l'origine (bas ou droit) de la scène (dans son entier) ne peut être inférieure 
        // à longueur de la zone de visualisation 
        if (c - max < maxOffset) return maxOffset + max ; 
        
        // Sinon on retourne la valeur d'origine
        return c        
    }

    getNormalizedX(x) {
        return this.getNormalizedCoordinate(x, this.width)        
    }

    getNormalizedY(y) {
        return this.getNormalizedCoordinate(y, this.height) 
    }

    /**
     * Retourne le coefficient réel appliqué à la scène à partir du niveau de zoom
     * @param {Numeric} zoom 
     */
    getZoomCoef(zoom = this.zoom) {
        if (zoom == 1) return 1
        return 1 + zoom * this.zoomFactor
    } 

    /**
     * Gère le scroll sur la scène
     * @param {Event} event 
     */
    zoomHandler(event) {

        // On vérifie que le scroll a lieu sur la grid
        if (!event.target.classList.contains(this.game.DOMConfig.gridCell.class)) return

        event.preventDefault()
        
        // 
        const zoomDelta = event.deltaY > 0 ? -1 : 1
        const newZoom = this.zoom + zoomDelta

        // Si on dépasse zoomMax ou zoomMin on ne fait rien
        if (newZoom > this.zoomMax || newZoom < this.zoomMin) return
        
        // On met à jour le zoom et on calcule le coefficient du zoom
        const oldZoom = this.zoom
        this.zoom = newZoom
        const zoomCoef = this.getZoomCoef()  

        // Calculate click at current zoom en tenant compte de l'offset de la scène
        const ix = ((event.clientX - this.position.left) - this.x) / this.getZoomCoef(oldZoom)
        const iy = ((event.clientY - this.position.top) - this.y) / this.getZoomCoef(oldZoom)
        
        // Calculate click at new zoom
        const nx = ix * zoomCoef
        const ny = iy * zoomCoef
        
        // Move to the difference
        const cx = (this.x = ix - nx)
        const cy = (this.y = iy - ny)

        // Transform the scene with CSS
        // Make sure we translate before scale
        const that = this
        window.requestAnimationFrame(() => {        
            that.DOMScene.style.transform = `
                translate(
                    ${cx}px, 
                    ${cy}px
                ) 
                scale(
                    ${zoomCoef}
                )`
        })

    }

    /**
     * Crée un Canvas et l'ajoute au DOM
     */
    createCanvas() {

        const DOMCanvas = document.createElement('canvas')

        DOMCanvas.setAttribute('width', this.width + 'px')
        DOMCanvas.setAttribute('height', this.height + 'px')
        DOMCanvas.style.border = 'none'

        this.DOMScene.appendChild(DOMCanvas)

        if (DOMCanvas.getContext) {
            return DOMCanvas
        } else {
            throw new Error('Canvas context is not supported by your browser. Please update your browser.')
        }
    }

    /**
     * Créer un Canvas utilisé pour rendre les élements static du jeu
     */
    createStaticLayer() {
        this.staticCanvas = this.createCanvas()
        this.staticLayer = this.staticCanvas.getContext('2d') 
    }
    
    /**
     * Créer un Canvas utilisé par les éléments dynamic du jeu
     */
    createDynamicLayer() {
        this.dynamicCanvas = this.createCanvas()
        this.dynamicLayer = this.dynamicCanvas.getContext('2d') 
    }

    /**
     * Met à jour la scène
     * @param {Float} diffTimestamp 
     */
    update(diffTimestamp) {

        // Si on est sur un level, on le met à jour
        if (this.game.hasCurrentLevel()) this.game.currentLevel.update(diffTimestamp)        
    }

    /**
     * Rendu de la scène
     */
    render(diffTimestamp) {
        
        // Clear all the dynamic canvas before re-render
        this.dynamicLayer.clearRect(0, 0, this.width, this.height)

        // Si on est sur un level, on le rend
        if (this.game.hasCurrentLevel()) this.game.currentLevel.render(diffTimestamp)

    }

    /**
     * Crée la grille de réference pour le jeu
     */
    createCellsGridLayer() {

        this.DOMGrid.style.width = this.nbColumns * this.cellSize + 'px' 
        this.DOMGrid.style.height = this.nbRows * this.cellSize + 'px' 

        for (let y = 0; y < this.nbRows; y++) {

            for (let x = 0; x < this.nbColumns; x++) {

                let cell = new GridCell(x, y, this)
                cell.isPath = this.game.currentLevel.config.map.path.includes(cell.id)
                this.gridCells.push(cell)
                this.DOMGrid.appendChild(cell.DOMElement)
            }
        }

        this.renderGrid()
    }

    /**
     * Rendu de la grille de référence
     */
    renderGrid() {
        this.gridCells.forEach(cell => cell.render(this.gridLayer))
    }

}