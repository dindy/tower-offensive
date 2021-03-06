
export default class LevelData_UI {
    
    constructor (game) {
        this.game = game
        this.DOMValue = document.getElementById(this.game.DOMConfig.value.id)
        this.DOMBuildingPoints = document.getElementById(this.game.DOMConfig.buildingPoints.id)
        this.DOMSocialPoints = document.getElementById(this.game.DOMConfig.socialPoints.id)
    }

    render() {
        if(this.game.currentLevel !== null){
            let value = this.game.currentLevel.value
            this.DOMValue.innerHTML = `Valeur: ${value}`

            let buildingPoints = this.game.currentLevel.buildingPoints
            this.DOMBuildingPoints.innerHTML = `Points de construction : ${buildingPoints}`

            let socialPoints = this.game.currentLevel.socialPoints
            this.DOMSocialPoints.innerHTML = `Points sociaux : ${socialPoints}`
        }


    }
}





