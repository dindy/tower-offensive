/**
 * Classe parente du plus haut niveau.
 */
export default class Thing {

   /**
    * Compteur statique permettant d'attribuer un identifiant unique à chaque chose.
    */
    static counter = 0
    
   /**
    * Thing identifier
    */    
    id = null

    /**
     * @constructor Attribue un identifiant unique à l'instance
     */
    constructor() {
        
        Thing.counter++

        this.id = Thing.counter
    }
}