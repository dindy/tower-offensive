import Techtree from '../Techtree'

export default class Techtree_UI {
    
    constructor(game) {
        this.game = game
        this.container = document.getElementById(this.game.DOMConfig.techtree.id)
        this.refresh()
    }

    refresh() {

        this.container.innerHTML = ``

        const currentTechtree = Techtree.getCurrentTechtree()
        const ul = document.createElement("ul")
        const socialPoints = this.game.currentLevel.socialPoints
        
        for (let i = 0; i < currentTechtree.length; i++) {

            const tech = currentTechtree[i];
            const li = document.createElement("li")
            const coef = tech.level === 0 ? 1 : tech.values[tech.level]

            li.innerHTML = tech.name + ` (x${coef})`
            if (!tech.isMaxLevel) {
                const cost = tech.costs[tech.level]
                const btn = document.createElement("button")
                btn.textContent = `Upgrade || cost: ${cost}`
                btn.onclick = () => {
                    console.log("CLICK")
                    Techtree.upgrade.apply(null, [tech.name])
                    this.game.currentLevel.removeSocialPoints(cost)
                    this.refresh()
                }

                if (cost > socialPoints) btn.setAttribute('disabled', true)

                li.appendChild(btn)
            }

            ul.appendChild(li)
        }
        
        this.container.appendChild(ul)        
    }


}