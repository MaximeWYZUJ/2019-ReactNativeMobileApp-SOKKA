import actions from './actions'
import Joueurs from '../../Helpers/JoueursForAjout'
import { State } from 'react-native-gesture-handler';
const initialState = { joueurs : Joueurs}


function initialiserState() {
    var j = []
    for (var i = 0; i < Joueurs.length; i++) {
        let joueur = {
            nom : Joueurs[i].nom,
            photo : Joueurs[i].photo,
            id : Joueurs[i].id,
            checked : false,
            position : Joueurs[i].position
            // A FINIR ON VA ENSUITE UNIQUEMENT MODIFIER L4OBJET QUI NOUS INTERESSE
        }
        j.push(joueur);
    }
    return {
        joueurs : j, 
        equipesFav : [],
        joueursSelectionnes : [],               
        terrainSelectionne : undefined,         // Id du terrain sélectionné pour défi ou partie
        nomsTerrainSelectionne : undefined,     // Ins et EquNom du terrain selectionné pour défi ou partie
        latitude : 43.596953, 
        longitude : 1.443966,
        monEquipe : undefined,                  
        equipeAdverse : undefined,              // Equipe adverse pour un défi entre deux équipes
        joueursPartie : [] ,                    // Joueurs séléctionnés pour une partie lors de sa création ou lors d'une participation
        JoueursParticipantsPartie : [],         // Joueurs qui participent déjà à la partie pour laquelle l'user veut s'inscrire
        nbJoueursRecherchesPartie : 0,			// Nbr de joueurs recherchés pour une partie donnée.
        nbJoueursMinEquipe : 0,                 // Nbr min de joueurs que doit posséder une équipe
        joueursInvites  : [],                   // Joueurs ayant confirmé leur présences
        partie : undefined ,                    // Partie dont les données ont été sauvegardées
        joueursPresents : [] ,                  // Joueurs présents à une partie ou un défi
        buteurs : [],                           // Buteurs d'une partie ou d'un défi
        votes : [],                             // Votes pour l'homme du match d'une partie ou un defi
        defi : undefined,                       // Défi dont les données ont été sauvegardées
        joueursDefi : [],                       // Liste des id des joueurs participants à un défi passé,
        equipeUserDefi : undefined,             // Equipe de l'utilisateur pour un défi          
        dataJoueursDefi : [],                   // Données des joueurs convoqués pour un défi
    }
}




/**
 * Fonction qui permet de gerer l'ajout ou la suppression de joueurs lors 
 * de l'ajout de joueurs dans la création d'une équipe.
 * @param {*} state 
 * @param {*} action 
 */
function handleGlobalStetChange(state = initialiserState(Joueurs), action) {
    let nextState
    //console.log(state.joueurs[0])
    switch(action.type) {
        /* Cas où on veut ajouter un joueur.*/ 
        case "AJOUTER_JOUEUR_EQUIPE_CREATION": 

            var exist = state.joueursSelectionnes.includes(action.value);
            var j = [];
            var arrayLength = state.joueursSelectionnes.length;
            for (var i = 0; i < arrayLength; i++) {
                if(state.joueursSelectionnes[i] != action.value) {
                    j.push(state.joueursSelectionnes[i]);
                }
            }
            if(! exist) {
                j.push(action.value); 
            }
            
            nextState = {
                ...state,
                joueursSelectionnes : j
            }
            
            return nextState || state;
           
         
        
        case "SUPPRIMER_JOUEUR_EQUIPE_CREATION": 
            var j = [];
            var arrayLength = state.joueursSelectionnes.length;
            for (var i = 0; i < arrayLength; i++) {
                if(state.joueursSelectionnes[i] != action.value) {
                    j.push(state.joueursSelectionnes[i]);
                }
            }
            nextState = {
                ...state,
                joueursSelectionnes : j
            }
      
            return nextState || state


        case actions.SAVE_EQUIPES_FAVORITES : 
            nextState = {
                ...state,
                equipesFav : action.value
            }
            return nextState || state
            
        /*
        * Cas où on choisit un terrain lors de la création d'un défi.
        */
        case actions.CHOISIR_TERRAIN : 
            if(action.value == state.terrainSelectionne) {
                nextState = {
                    ...state,
                    terrainSelectionne : undefined,
                    
                } 
            } else {
                nextState = {
                    ...state,
                    terrainSelectionne : action.value
                }
            }

            return nextState || state

        
        /**
         * Pour sauvegarder le InsNom et EquNom d'un terrain
         */
        case actions.SAVE_NOM_TERRAIN : 
            nextState = {
                ...state,
                nomsTerrainSelectionne : {
                    InsNom :  action.value.InsNom,
                    EquNom : action.value.EquNom
                }
            }

            return nextState || state

        /**
         * Cas où on récupère les coordonnées de l'utilisateur
         */
        case actions.SAVE_COORDONNATES : 
            nextState = {
                ...state,
                latitude : action.value.latitude,
                longitude : action.value.longitude,

            }
            return nextState || state

        /**
         * Cas où on choisit une des équipes de l'user lors de la création d'un 
         * défis
         */
        case actions.CHOISIR_UNE_DE_MES_EQUIPES : 
            console.log("in reducer choisir une de mes equipes")
            nextState = {
                ...state,
                monEquipe : action.value

            }
            return nextState || state

        /*
        * Cas où on sauvegarde l'id de l'équipe adverse lors de la creation d'un défi entre 2 équipe
        */
       case actions.CHOISIR_EQUIPE_ADVERSE : 
            if(action.value == state.equipeAdverse) {
                nextState = {
                    ...state,
                    equipeAdverse : undefined
                } 
            } else {
                nextState = {
                    ...state,
                    equipeAdverse : action.value
                }
            }
            return nextState

        /**
         * Cas où on choisit des joueurs à inviter pour une partie
         */
        case actions.CHOISIR_JOUEUR_PARTIE  : 
            var exist = isJoueurPresent(state.joueursPartie, action.value);
            var j = [];
            var arrayLength = state.joueursPartie.length;
            for (var i = 0; i < arrayLength; i++) {
                if(state.joueursPartie[i].id != action.value.id) {
                    j.push(state.joueursPartie[i]);
                }
            }
            if(! exist) {
                j.push(action.value); 
            }
            nextState = {
                ...state,
                joueursPartie : j
            }
            
            return nextState || state;

        /**
         * On vas sauvegarder tous les participants à une partie 
         */
        case actions.STORE_PARTICIPANTS_PARTIE : 
            nextState = {
                ...state,
                JoueursParticipantsPartie : action.value
            }
            
            return nextState || state;
        /**
         * Cas où on sauvegarde le nombre de joueurs recherchés pour une partie
         */
		case actions.STORE_NB_JOUEURS_RECHERCHES_PARTIES :
			nextState = {
				...state,
				nbJoueursRecherchesPartie : action.value
			}
			return nextState || state

        /**
         * Cas où on remet à zéro la liste des joueurs pour une partie
         */
		case actions.RESET_JOUEURS_PARTIE : 
			nextState = {
				...state,
				joueursPartie : []
			}
			return nextState || state
            
        /**
         * Cas où on sauvegarde le nbr min de joueurs pour une équipe
         */    
        case actions.STORE_NB_MIN_JOUEURS_EQUIPE :
            nextState = {
                ...state,
                nbJoueursMinEquipe : action.value
            }
            return nextState || state


        /**
         * Cas où on sauvegarde le joueurs ayant été invités pour 
         * une partie (voir défi)
         */
        case actions.STORE_JOUEURS_INVITES :
            nextState = {
                ...state,
                joueursInvites : action.value
            }
            return nextState || state
            
        /**
         * Cas où on sauvegarde toutes les données d'une partie.
         */
        case actions.STORE_ALL_DATA_PARTIE : 
            nextState = {
                ... state,
                partie : action.value,
                buteurs : action.value.buteurs,
                votes : action.value.votes,
                joueursPresents : action.value.confirme
            }
           
            return nextState || state

        /**
         * Cas où on sauvegarde les joueurs présents à une partie ou défi.
         */
        case actions.STORE_JOUEURS_PRESENT : 
            nextState = {
                ... state,
                joueursPresents : action.value
            }
           
            return nextState || state

        
        /**
         * Cas où on met à jour le nombre de but d'un joueur
         */
        case actions.MAJ_BUTEUR : 
            // action.value = {id :  , newnbBut : }
            var dejaMarque = false
            var liste = []
            for(var i= 0; i < state.buteurs.length; i++) {
                if(state.buteurs[i].id != action.value.id) {
                    liste.push(state.buteurs[i])
                } else {
                    var obj = {
                        id : action.value.id,
                        nbButs : action.value.newNbButs
                    }
                    dejaMarque = true
                    console.log(obj)
                    liste.push(obj)
                }
                
            }
            if(! dejaMarque ) {
                liste.push({id : action.value.id, nbButs : action.value.newNbButs})
            }
            nextState = {
                ... state,
                buteurs : liste
            }
           
            return nextState || state
        
        /**
         * Cas où on met à jour le vote d'un utilisateur 
         */
        case actions.MAJ_VOTE : 
            // action.value = {idVotant : String, idVote : String}
            var liste = []
            var adejaVote = false       // L'utilisateur à déjà voté
            for(var i = 0; i <state.votes.length; i++) {
                if(state.votes[i].idVotant == action.value.idVotant) {
                    if(action.value.idVote != state.votes[i] ) {
                        var obj = {
                            idVote : action.value.idVote,
                            idVotant : action.value.idVotant
                        }
                        liste.push(obj)
                        adejaVote = true
                    }
                } else {
                    liste.push(state.votes[i])
                }
            }
            if(! adejaVote) {
                var obj = {
                    idVote : action.value.idVote,
                    idVotant : action.value.idVotant
                }
                liste.push(obj)  
            }
            nextState = {
                ... state,
                votes : liste
            }
           
            return nextState || state
            
        /**
         * Cas où on sauvegarde toutes les données d'un défi
         */
        case actions.STORE_ALL_DATA_DEFI : 
            nextState = {
                ... state,
                defi : action.value,
                buteurs : action.value.buteurs,
                votes : action.value.votes,

            }
        
            return nextState || state

        /**
         * Pour sauvegarder la liste des joueurs de la même équipe que l'user
         * participant à un défi
         */
        case actions.STORE_LISTE_JOUEURS_DEFI : 
            nextState = {
                ... state,
                joueursDefi : action.value
            }
            return nextState || state
        

        /**
         * Pour sauvegarder toutes les données de l'équipe de l'utilisateur
         */
        case actions.STORE_EQUIPE_USER :
            nextState = {
                ... state,
                equipeUserDefi : action.value
            }
            return nextState || state

        case actions.STORE_DATA_JOUEURS_DEFI : 
            nextState = {
                ... state,
                dataJoueursDefi : action.value
            }
            return nextState || state
		default : 
            return state
        

    }


}

/**
 * Renvoie true si le joueur est present dans la liste
 * @param {*} liste 
 * @param {*} joueur  : {id : ...  , photo : ...}
 */
function isJoueurPresent(liste, joueur) {
    for(var i = 0; i < liste.length ; i++) {
        if(liste[i].id == joueur.id){
            return true 
        }
    }
    return false
}
export default handleGlobalStetChange