import Basic from './Basic'
import Sniper from './Sniper'
import Seeker from './Seeker'

const buildingClasses = [Basic, Sniper, Seeker]

const getAllAvailableBuildingsClasses = () => buildingClasses

const getAvailableBuildingClassByName = name => buildingClasses
    .filter(buildingClass => buildingClass.name == name)
    [0]

const getAvailableBuildingInstanceByName = (name, ...args) => {
    const c = getAvailableBuildingClassByName(name)
    return new c(...args)
}
    
export { getAllAvailableBuildingsClasses, getAvailableBuildingClassByName, getAvailableBuildingInstanceByName }