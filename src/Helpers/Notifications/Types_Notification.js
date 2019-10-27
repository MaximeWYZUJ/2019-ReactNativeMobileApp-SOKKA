/**
 * Classe qui va énumérer tous les types de notifications possible
 */
export default class Types_Notification {


    //=========================================================================
    //============================ POUR LES DEFIS  ============================
    //=========================================================================

    /**
     * Quand l'utilisateur est convoqué ou relancé à un défi
     */
    static CONVOCATION_RELANCE_DEFI = "CONVOCATION_RELANCE_DEFI"


    /**
     * Quand un joueur confirme sa présence à un défi
     */
    static CONFIRMER_PRESENCE_DEFI = "CONFIRMER_PRESENCE_DEFI"


    /**
     * Quand un joueur annule sa présence à un defi
     */
    static ANNULER_PRESENCE_DEFI = "ANNULER_PRESENCE_DEFI"


    /**
     * Quand une équipe crée un défis contre une équipe dont l'utilisateur
     * est capitaine (diapo 51 CDC)
     */
    static ACCEPTER_DEFIS_CONTRE_EQUIPE = "ACCEPTER_DEFIS_CONTRE_EQUIPE"


    /**
     * Quand une équipe relève un défis posté par une de mes équipes
     */
    static ACCEPTER_DEFI_RELEVE = "ACCEPTER_DEFI_RELEVE"


    /**
     * Quand l'utilisateur accepte de défier une équipe qui lui a proposé un défi
     */
    static ACCEPTER_CONVOCATION_DEFI_ADVERSE  = "ACCEPTER_CONVOCATION_DEFI_ADVERSE"

    /**
     * Quand l'utilisateur refuse de défier une équipe qui lui a proposé un défi
     */
    static REFUSER_CONVOCATION_DEFI_ADVERSE  = "REFUSER_CONVOCATION_DEFI_ADVERSE"



    /**
     * Quand l'utilisateur refuse qu'une equipe relève un défi qu'il a posté
     */
    static REFUSER_EQUIPE_DEFIEE = "REFUSER_EQUIPE_DEFIEE"

    
    /**
     * Quand l'utilisateur accepte qu'une equipe relève un défi qu'il a posté
     */
    static ACCEPTER_EQUIPE_DEFIEE = "ACCEPTER_EQUIPE_DEFIEE"
    
    //=========================================================================
    //============================ POUR LES PARTIE  ===========================
    //=========================================================================


    /**
     * Quand l'utilisateur est convoqué ou relancé à une partie
     */
    static CONVOCATION_RELANCE_PARTIE = "CONVOCATION_RELANCE_PARTIE"

    /**
     * Quand l'utilisateur confirme sa présence à une partie
     */
    static CONFIRMER_PRESENCE_PARTIE = "CONFIRMER_PRESENCE_PARTIE"


    /**
     * Quand l'utilisateur annule sa présence à une partie
     */
    static ANNULER_PRESENCE_PARTIE = "ANNULER_PRESENCE_PARTIE"



    /**
     * Quand un joueur s'inscris à une partie que l'utilisateur à créee.
     */
    static INSCRIPTION_PARTIE = "INSCRIPTION_PARTIE"

    //=========================================================================
    //============================ POUR LES EQUIPES  ==========================
    //=========================================================================


    /**
     * Quand l'utilisateur est invité à rejoindre une partie
     */
    static INVITATION_REJOINDRE_EQUIPE  = "INVITATION_REJOINDRE_EQUIPE"


    /**
     * Quand l'utilisateur refuse de rejoindre une équipe
     */
    static REFUSER_INVITATION_REJOINDRE_EQUIPE ="REFUSER_INVITATION_REJOINDRE_EQUIPE"

    /**
     * Quand l'utilisateur accepte de rejoindre une équipe
     */
    static ACCEPTER_INVITATION_REJOINDRE_EQUIPE ="ACCEPTER_INVITATION_REJOINDRE_EQUIPE"


    /**
     * Quand une équipe dont l'utilisateur est capitaine est ajouté aux équipes favorites 
     * d'un autre joueur.
     */
    static AJOUT_EQUIPE_FAVORITE = "AJOUT_EQUIPE_FAVORITE"


    /**
     * Quand l'utilisateur demande à rejoindre une "équipe"
     */
    static DEMANDE_REJOINDRE_EQUIPE = "DEMANDE_REJOINDRE_EQUIPE"
    

    /**
     * Quand le cap d'une équipe accepte que j'intègre une des ses équipe
     */
    static ACCEPTER_DEMANDE_INTEGRATION_EQUIPE = "ACCEPTER_DEMANDE_INTEGRATION_EQUIPE"

     /**
     * Quand le cap d'une équipe refuse que j'intègre une des ses équipe
     */
    static REFUSER_DEMANDE_INTEGRATION_EQUIPE = "REFUSER_DEMANDE_INTEGRATION_EQUIPE"

    //=========================================================================
    //============================= POUR LE RESEAU  ===========================
    //=========================================================================


    /**
     * Quand l'utilisateur est ajouté dans le reseau d'un autre joueur
     */
    static AJOUT_RESEAU ="AJOUT_RESEAU"



    //=========================================================================
    //======================= POUR LES FEUILLES DE MATCH  =====================
    //=========================================================================


    /**
     * Quand l'utilisateur complete la feuille de match pour une équipe dont il 
     * est capitaine
     */
    static FEUILLE_COMPLETEE = "FEUILLE_COMPLETEE"


    /**
     * Quand le cap de l'équipe adverse d'un défi à complété la feuille de match
     */
    static FEUILLE_COMPLETEE_ADVERSE = "FEUILLE_COMPLETEE_ADVERSE"


     /**
     * Quand l'organisateur d'une partie complete la feuille de match
     */
    static FEUILLE_COMPLETEE_PARTIE = "FEUILLE_COMPLETEE_PARTIE"


    
    //=========================================================================
    //=========================== POUR LES CAPITAINES  ========================
    //=========================================================================

    /**
     * Quand on propose à un joueur d'être capitaine.
     */
    static DEMANDE_REJOINDRE_CAPITAINES = "DEMANDE_REJOINDRE_CAPITAINES"


    /**
     * Quand un joueur à qui on a proposé d'être cap a refusé
     */ 
    static REFUS_DEMANDE_CAPITAINE = "REFUS_DEMANDE_CAPITAINE"

    /**
     * Quand un joueur à qui on a proposé d'être cap a accepté
     */ 
    static ACCEPTE_DEMANDE_CAPITAINE = "ACCEPTE_DEMANDE_CAPITAINE"


    /**
     * Quand l'éuquipe a un nouveau capitaine
     */
    static NEW_CAP = "NEW_CAP"


    /**
     * Quand un joueur arrete d'être capitaine
     */
    static ARRET_CAPITAINE = "ARRET_CAPITAINE"
}