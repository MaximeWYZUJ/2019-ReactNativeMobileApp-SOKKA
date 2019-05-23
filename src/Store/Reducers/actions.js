
/**
 * Classe qui va permettre de définir les actions pouvant être effectuées sur 
 * le state gloabal
 */
export default class actions {

    /**
     * Pour ajouter un joueur à l'équipe que l'utilisateur est en train
     * de créer.
     */
    static AJOUTER_JOUEUR_EQUIPE_CREATION = "AJOUT_JOUEUR_EQUIPE_CREATION"

    /**
     * Pour choisir un terrain sur lequel organiser un défi
     */
    static CHOISIR_TERRAIN = "CHOISIR UN TERRAIN"


    /**
     * Pour sauvegarder le InsNom et EqNom du terrain choisi par l'utilisateur
     */
    static SAVE_NOM_TERRAIN = "SAVE_NOM_TERRAIN"
    /**
     * Pour enregistrer les coordonnées de l'utilisateur dans le state global
     */
    static SAVE_COORDONNATES = "SAVE_COORDONATES"

    /**
     * Pour enregister l'équipe adverse lors de la création d'un défi
     */
    static CHOISIR_EQUIPE_ADVERSE = "CHOISIR_EQUIPE_ADVERSE"

    /**
     * Pour enregistrer l'equipe que l'utilisateur (equipe dont il est capitaine) a
     * choisi lors de la creation d'un  defis entre dexu équipes
     */
    static CHOISIR_UNE_DE_MES_EQUIPES = "CHOISIR_UNE_DE_MES_EQUIPES"

    /**
     * Pour sauvegarder les équipes favorites de l'utilisateurs
     */
    static SAVE_EQUIPES_FAVORITES = "SAVE_EQUIPES_FAVORITES"

    /**
     * Pour choisir un joueur lors de la création d'une partie
     */
    static CHOISIR_JOUEUR_PARTIE = "CHOISIR_JOUEUR_PARTIE"

    /**
     * Pour enregistrer les participants à une partie 
     */
    static STORE_PARTICIPANTS_PARTIE = "STORE_PARTICIPANTS_PARTIE"

    /**
     * Pour enregistrer le nombre de joueurs recherchés pour une partie donnée.
     */
    static STORE_NB_JOUEURS_RECHERCHES_PARTIES = "STORE_NB_JOUEURS_RECHERCHES_PARTIES"

    /**
     * Permet de réinitialiser la liste des joueurs séléctionnés pour une partie
     */
    static RESET_JOUEURS_PARTIE = "RESET_JOUEURS_PARTIE"

    /**
     * Pour sauvegarder le nombre minimum de joueurs que doit avoir une équipe pour pouvoir
     * être séléctionné pour la création d'un défi
     */
    static STORE_NB_MIN_JOUEURS_EQUIPE = "STORE_NB_MIN_JOUEURS_EQUIPE"


    /**
     * Pour sauvegarder la liste des joueurs invite pour une partie
     */
    static STORE_JOUEURS_INVITES = "STORE_JOUEURS_INVITES"

    /**
     * Pour sauvegarder dans le state global toutes les données d'une partie
     */
    static STORE_ALL_DATA_PARTIE = "STORE_ALL_DATA_PARTIE"


    /**
     * Pour sauvegarder les joueurs bien présent à une partie ou un défi
     */
    static STORE_JOUEURS_PRESENT =  "STORE_JOUEURS_PRESENT"


    /**
     * Pour mettre à jour le nombre de but d'un joueur
     */
    static MAJ_BUTEUR = "MAJ_BUTEUR"

    /**
     * Pour mettre à jour le vote de l'utilisateur
     */
    static MAJ_VOTE = "MAJ_VOTE"


    /**
     *  Pour sauvegarder la liste des joueurs de l'équipe de l'utilisateur
     *  participants à un defi
     */
    static STORE_LISTE_JOUEURS_DEFI = "STORE_LISTE_JOUEURS_DEFI"


    /**
     * Pour sauvegarder toutes les données d'un défi
     */
    static STORE_ALL_DATA_DEFI = "STORE_ALL_DATA_DEFI"


    /**
     * Pour sauvegarder les données de l'équipe dont l'utilisateur fait 
     * parti
     */
    static STORE_EQUIPE_USER = "STORE_EQUIPE_USER"


    /**
     * Pour sauvegarder toutes les données des joueurs convoqués pour 
     * un defis
     */
    static STORE_DATA_JOUEURS_DEFI = "STORE_DATA_JOUEURS_DEFI"

}