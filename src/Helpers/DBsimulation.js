import Exemple from "./JoueurExemple.json"

export function get_profil_joueur(id) {
    
    for (var i=0; i<Exemple.DB.length; i++) {
        if (Exemple.DB[i].id === id) {
            return Exemple.DB[i]
        }
    }
    return {}
}