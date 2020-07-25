

export default class BuildMenu {

    /**
     * Constructor
     * @param {JSON} DOMConfig 
     */
    constructor(DOMConfig) {
        this.DOMConfig = DOMConfig
        this.DOMMenu = document.getElementById(DOMConfig.buildMenu.id)
        this.addBuilding('Tour')
    }

    /**
     * Ajoute le level en cours au propriétés
     * @param {Object} level 
     */
    setLevel = level => {
        this.level = level
    }

    /**
     * Ajoute le building au menu
     */
    addBuilding = () => {
        const element = document.createElement('div')
        element.classList.add(this.DOMConfig.buildMenuItem.class)
        element.setAttribute("draggable", true)
        this.DOMMenu.appendChild(element)

        document.addEventListener("dragstart", this.dragStartHandler)
        document.addEventListener("dragend", this.dragEndHandler)
    }

    /**
     * Drag start
     * @param {Event} event 
     */
    dragStartHandler = event => {
        this.level.unselectBuilding()
        this.level.startPlacingBuilding()
    }

    /**
     * Drag finish
     * @param {Event} event 
     */
    dragEndHandler = event => {
        if (event.dataTransfer.dropEffect === 'none') {
            this.level.endPlacingBuilding()
        }
    }

    /**
     * Drag over
     */
    dragOverHandler = () => {}

}