export default class BuildMenu_UI {

    /**
     * Constructor
     * @param {JSON} DOMConfig 
     */
    constructor(DOMConfig) {
        this.DOMConfig = DOMConfig
        this.DOMMenu = document.getElementById(DOMConfig.buildMenu.id)
        this.addBuilding('Basic', document.getElementById(DOMConfig.icons.towerBasic))
        this.addBuilding('Sniper', document.getElementById(DOMConfig.icons.towerSniper))
    }

    /**
     * Ajoute le level en cours au propriétés
     * @param {Object} level 
     */
    setLevel(level) {
        this.level = level
    }

    /**
     * Ajoute le building au menu
     */
    addBuilding(name, DOMImg) {
        const element = document.createElement('img')
        element.src = DOMImg.src
        element.classList.add(this.DOMConfig.buildMenuItem.class)
        element.setAttribute("draggable", true)
        element.dataset.name = name
        this.DOMMenu.appendChild(element)
        element.addEventListener("dragend", this.dragEndHandler.bind(this))
    }

    /**
     * Drag start
     * @param {Event} event 
     */
    dragStartHandler(event) {
        const name = event.target.dataset.name
        this.level.unselectBuilding()
        this.level.startPlacingBuilding(name)
    }

    /**
     * Drag finish
     * @param {Event} event 
     */
    dragEndHandler(event) {
        if (event.dataTransfer.dropEffect === 'none') {
            this.level.endPlacingBuilding()
        }
    }

    /**
     * Drag over
     */
    dragOverHandler() {}

}