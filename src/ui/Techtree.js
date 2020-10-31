import Techtree from '../Techtree'

export default class Techtree_UI {
    
    constructor(game) {
        this.game = game
        this.container = document.getElementById(this.game.DOMConfig.techtree.id)
        this.DOMConfig = this.game.DOMConfig.techtree
        this.init()
    }
    
    /**
     * Active ou désactive les boutons en fonction des réserves de SocialPoints du joueur
     */
    refreshSocialPoints() {
        const socialPoints = this.game.currentLevel.socialPoints
        const currentTechtree = Techtree.getCurrentTechtree()
        for (let i = 0; i < currentTechtree.length; i++) {
            const tech = currentTechtree[i]
            const btn = this
                .getDOMTechItem(tech.name)
                .querySelector(`.${this.DOMConfig.elements.btnUpdate.class}`)

            if (tech.cost <= socialPoints){
                btn.disabled = false
            } else { 
                btn.disabled = true
            }
            
        }
    }

    getDOMTechItem(techName) {
        const id = this.DOMConfig.id
        const itemsClass = this.DOMConfig.elements.items.class
        const itemClass = this.DOMConfig.elements.item.class
        return document.querySelector(`#${id}>.${itemsClass}>.${itemClass}[data-tech=${techName}]`)
    }

    /**
     * Update le text du li en fonction du level atteint par le joueur
     * @param {text} name 
     */
    refreshTechLevel(name) {
        
        const tech = Techtree.getTechnologyByName(name)
        
        const li = this.getDOMTechItem(name)
        const itemLabel = li.querySelector(`.${this.DOMConfig.elements.label.class}`)
        const btn = li.querySelector(`.${this.DOMConfig.elements.btnUpdate.class}`)
        const coef = tech.level === 0 ? 1 : tech.values[tech.level]

        itemLabel.innerHTML = tech.name + ` (x${coef})`

        if (!tech.isMaxLevel) {
            btn.textContent = `Upgrade || cost: ${tech.cost}`
        } else {
            btn.style.display = 'none'
        }
    }
    
    init() {

        this.container.innerHTML = ``

        const currentTechtree = Techtree.getCurrentTechtree()
        const ul = document.createElement("ul")
        
        this.container.appendChild(ul) 

        for (let i = 0; i < currentTechtree.length; i++) {

            const tech = currentTechtree[i];
            const li = document.createElement("li")
            const itemLabel = document.createElement('span')

            itemLabel.classList.add(this.DOMConfig.elements.label.class)            
            li.appendChild(itemLabel)
            li.dataset.tech = tech.name
            li.classList.add(this.DOMConfig.elements.item.class)
            
            const btn = document.createElement("button")
            btn.disabled = true
            btn.classList.add(this.DOMConfig.elements.btnUpdate.class)
            btn.onclick = () => {
                Techtree.upgrade.apply(null, [tech.name])
                this.game.currentLevel.removeSocialPoints(tech.cost)                    
                this.refreshTechLevel(tech.name)
                this.refreshSocialPoints()
            }
            li.appendChild(btn)
            ul.appendChild(li)
            ul.classList.add(this.DOMConfig.elements.items.class)
            this.refreshTechLevel(tech.name)
        }
    }
}