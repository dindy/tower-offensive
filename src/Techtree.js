import techtree from "./techtree.json"

export default class Techtree {

    static levels = {}
    
    static upgrade = techName => {
        if (typeof Techtree.levels[techName] === 'undefined') Techtree.levels[techName] = 1
        else Techtree.levels[techName]++
    }
                        
    static getTechnologiesByNames = names => techtree
        .filter(tech => names.includes(tech.name))
        .map(tech => (tech.values[Techtree.levels[tech.name]] || 1 )) 
        .reduce((total, modifier) => modifier * total, 1)

    static getCurrentTechtree = () => techtree
        .map(tech => {     
            const level = Techtree.levels[tech.name] || 0
            const isMaxLevel = level === tech.values.length - 1
            return {...tech, level, isMaxLevel }
        })
}
