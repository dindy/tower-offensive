export default class ContextualMenu {

    constructor(game) {
        this.game = game

        this.DOMContainer = document.getElementById(this.game.DOMConfig.contextualMenu.id)
        this.DOMTitle = document.getElementById(this.game.DOMConfig.contextualMenu.elements.title.id)
        this.DOMDeleteBtn = document.getElementById(this.game.DOMConfig.contextualMenu.elements.removeBtn.id)

        this.hiddenModifier = this.game.DOMConfig.contextualMenu.modifiers.hidden
        this.cssClass = this.game.DOMConfig.contextualMenu.class
        this.selectedBuilding = null

        this.DOMDeleteBtn.addEventListener('click', event => {
            this.game.currentLevel.removeBuilding(this.selectedBuilding)
            this.hide()
        })
    }

    show(tower) {
        this.selectedBuilding = tower
        this.DOMContainer.classList.remove(this.cssClass + this.hiddenModifier)
        this.DOMTitle.innerHTML = tower.constructor.name
    }

    hide() {
        this.selectedBuilding = null
        this.DOMContainer.classList.add(this.cssClass + this.hiddenModifier)
    }

}