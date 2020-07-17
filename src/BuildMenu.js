

export default class BuildMenu {

    constructor(DOMConfig) {
        this.DOMConfig = DOMConfig
        this.DOMMenu = document.getElementById(DOMConfig.buildMenu.id)
        this.addBuilding('Tour')
    }


    addBuilding = () => {
        const element = document.createElement('div')
        element.classList.add(this.DOMConfig.buildMenuItem.class)
        element.setAttribute("draggable", true)
        this.DOMMenu.appendChild(element)

        document.addEventListener("dragstart", this.dragStartHandler)
    }

    dragStartHandler = event => {
        // Créer un autre carré rouge
        // var img = new Image(); 
        // img.src = 'example.gif'; 
        // ev.dataTransfer.setDragImage(img, 10, 10);
        console.log('dragstart', event);
                
    }
    dragOverHandler = () => {}

    
    
}