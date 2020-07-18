

export default class BuildMenu {

    constructor(DOMConfig) {
        this.DOMConfig = DOMConfig
        this.DOMMenu = document.getElementById(DOMConfig.buildMenu.id)
        this.addBuilding('Tour')
    }
    setLevel = level => {
        this.level = level
    }

    addBuilding = () => {
        const element = document.createElement('div')
        element.classList.add(this.DOMConfig.buildMenuItem.class)
        element.setAttribute("draggable", true)
        this.DOMMenu.appendChild(element)

        document.addEventListener("dragstart", this.dragStartHandler)
    }

    dragStartHandler = event => {
        this.level.startPlacingBuilding()
    }

    dragOverHandler = () => {}

}