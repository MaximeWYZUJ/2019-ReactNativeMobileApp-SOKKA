/**
 * Classe qui va énumérer tous les types de notifications possible
 */
export default class Types_Notification {


    //=========================================================================
    //========================== POUR LES DEFIS ET PARTIE =====================
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
     * Quand une équipe crée un défis contre une équipe dont l'utilisateur
     * est capitaine (diapo 51 CDC)
     */
    static ACCEPTER_DEFIS_CONTRE_EQUIPE = "ACCEPTER_DEFIS_CONTRE_EQUIPE"
}