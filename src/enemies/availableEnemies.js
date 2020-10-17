import Bezos from './Bezos'
import Ceo from './Ceo'
import Crs from './Crs'

const enemyClasses = [Bezos, Ceo, Crs]

const getAllAvailableEnemiesClasses = () => enemyClasses

const getAvailableEnemyClassByName = name => enemyClasses
    .filter(enemyClass => enemyClass.name == name)
    [0]

const getAvailableEnemyInstanceByName = (name, ...args) => {
    const c = getAvailableEnemyClassByName(name)
    return new c(...args)
}
    
export { getAllAvailableEnemiesClasses, getAvailableEnemyClassByName, getAvailableEnemyInstanceByName }