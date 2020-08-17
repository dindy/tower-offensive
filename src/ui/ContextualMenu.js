export default class ContextualMenu {

    constructor(game) {
        this.game = game
        this.DOMElement = document.getElementById(this.game.DOMConfig.contextualMenu.id)
        this.hiddenModifier = this.game.DOMConfig.contextualMenu.modifiers.hidden
        this.cssClass = this.game.DOMConfig.contextualMenu.class
    }

    show(tower) {
      this.DOMElement.classList.remove(this.cssClass + this.hiddenModifier)
      this.DOMElement.innerHTML = tower.constructor.name
    }

    hide() {
        this.DOMElement.classList.add(this.cssClass + this.hiddenModifier)
    }

}