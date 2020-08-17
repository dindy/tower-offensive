import { getAllAvailableBuildingsClasses } from '../buildings/availableBuildings'

export default class BuildMenu_UI {

    buildingsInventory = []

    /**
     * Constructor
     * @param {JSON} DOMConfig 
     */
    constructor(game) {
        this.DOMConfig = game.DOMConfig
        this.DOMMenu = document.getElementById(this.DOMConfig.buildMenu.id)
        this.game = game
        this.createBuildingsInventory()
    }
    
    
    /**
     * Ajoute le building au menu
     */
    createBuildingsInventory() {
        
        const availableClasses = getAllAvailableBuildingsClasses()

        availableClasses.forEach(buildingClass => {

            const name = buildingClass.name
            const DOMImage = document.getElementById(this.DOMConfig.icons['tower' + name])
            const DOMElement = document.createElement('img')
            
            DOMElement.src = DOMImage.src
            DOMElement.classList.add(this.DOMConfig.buildMenuItem.class)
            DOMElement.setAttribute("draggable", true)
            DOMElement.dataset.name = name
            this.DOMMenu.appendChild(DOMElement)
            DOMElement.addEventListener("dragend", this.dragEndHandler.bind(this))
            
            this.buildingsInventory.push({ DOMImage, name, DOMElement, class: buildingClass })
        })
    }

    /**
     * Drag start
     * @param {Event} event 
     */
    dragStartHandler(event) {
        
        const name = event.target.dataset.name

        // Annule si pas assez de points
        if (this.getBuildingPriceFromName(name) > this.game.currentLevel.buildingPoints) {
            event.preventDefault()
            return false
        }
        this.game.currentLevel.unselectBuilding()
        this.game.currentLevel.startPlacingBuilding(name)
    }

    getBuildingPriceFromName(name) {
        return this.buildingsInventory
            .filter(buildingData => buildingData.name == name)
            .map(buildingData => buildingData.class.price)
            [0]
    }

    /**
     * Drag finish
     * @param {Event} event 
     */
    dragEndHandler(event) {
        if (event.dataTransfer.dropEffect === 'none') {
            this.game.currentLevel.endPlacingBuilding()
        }
    }

    /**
     * Drag over
     */
    dragOverHandler() {}

    /**
     * RENDER
     */
    render() {
        for (let index = 0; index < this.buildingsInventory.length; index++) {
            const building = this.buildingsInventory[index]
            const price = building.class.price
            const buildingPoints = this.game.currentLevel.buildingPoints
            const modifier = this.DOMConfig.buildMenuItem.modifiers.unavailable
            const cssClass = this.DOMConfig.buildMenuItem.class
            if (price > buildingPoints) {
                building.DOMElement.classList.add(cssClass + modifier)
            } else {
                building.DOMElement.classList.remove(cssClass + modifier)
            } 
        }
    }
}