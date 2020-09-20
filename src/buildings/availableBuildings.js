import Basic from './Basic'
import Sniper from './Sniper'
import Seeker from './Seeker'
import Tesla from './Tesla'
import Mortar from './Mortar'

const buildingClasses = [Basic, Sniper, Seeker, Tesla, Mortar]

const getAllAvailableBuildingsClasses = () => buildingClasses

const getAvailableBuildingClassByName = name => buildingClasses
    .filter(buildingClass => buildingClass.name == name)
    [0]

const getAvailableBuildingInstanceByName = (name, ...args) => {
    const c = getAvailableBuildingClassByName(name)
    return new c(...args)
}
    
export { getAllAvailableBuildingsClasses, getAvailableBuildingClassByName, getAvailableBuildingInstanceByName }