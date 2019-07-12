
import React from 'react'
import {View, Text,Image, ImageBackground,  StyleSheet, Animated,TouchableOpacity,TextInput, Alert} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';
import Colors from '../Colors'
import Types_Notification from '../../Helpers/Notifications/Types_Notification'
import Notif_Convocation_Defi from './Notif_Defi_Partie/Notif_Convocation_Defi'
import Notif_Presence_Defi from './Notif_Defi_Partie/Notif_Presence_Defi'
import Notif_Defis_Contre_Equipe from './Notif_Defi_Partie/Notif_Defis_Contre_Equipe'
import Notif_Accepter_Releve_Defi from './Notif_Defi_Partie/Notif_Accepter_Releve_Defi'
import Notif_Convocation_Partie from './Notif_Defi_Partie/Notif_Convocation_Partie'
import Notif_Presence_Partie from './Notif_Defi_Partie/Notif_Presence_Partie'
import Notif_Invitation_Equipe from './Notif_Equipe/Notif_Invitation_Equipe'
import Notif_Refu_Accepte_Equipe from './Notif_Equipe/Notif_Refu_Accepte_Equipe';
import Notif_Ajout_Reseau from './Notifs_Reseau/Notif_Ajout_Reseau';
import Notif_Accepter_Refuser_Defi_Adverse from './Notif_Defi_Partie/Notif_Accepter_Refuser_Defi_Adverse'
import Notif_feuille_completee_Defi from './Notifs_Feuille_Match/Notif_feuille_completee_Defi'
import Notif_feuille_completee_Defi_adverse from './Notifs_Feuille_Match/Notif_feuille_completee_Defi_adverse'
import Notif_feuille_completee_Partie from './Notifs_Feuille_Match/Notif_feuille_completee_Partie'
import Notif_Ajout_Equipe_Favorite from './Notif_Equipe/Notif_Ajout_Equipe_Favorite'
import Notif_Demande_Integrer_Equipe from './Notif_Equipe/Notif_Demande_Integrer_Equipe'
import Notif_Rep_Demande_Integration_Equipe from './Notif_Equipe/Notif_Rep_Demande_Integration_Equipe'
import Notif_Demande_Rejoindre_Capitaines from './Notifs_Capitaines/Notif_Demande_Rejoindre_Capitaines'

/**
 * class qui va permettre d'afficher le bon type de notification en fonction 
 * de la notification recue en props
 *   Props : notification : Notification a afficher
 */
export default class Notifications_Factory extends React.Component {

    constructor(props) {
        super(props)
    }


    /**
     * Fonction qui renvoie le composant correspondant au type
     * de la notification
     */
    chooseNotifToRender()  {

        switch(this.props.notification.type) {

            // Notification de convoc ou relance à un Défi
            case Types_Notification.CONVOCATION_RELANCE_DEFI : 
                return(
                    <Notif_Convocation_Defi
                        notification = {this.props.notification}
                    />
                )
                break
            
            // Un joueur à confirmé sa présence à un defi
            case Types_Notification.CONFIRMER_PRESENCE_DEFI : 
                return(
                    <Notif_Presence_Defi
                        notification = {this.props.notification}
                    />
                )
            // Un joueur à annulé sa présence à un defi
            case Types_Notification.ANNULER_PRESENCE_DEFI : 
                return(
                    <Notif_Presence_Defi
                        notification = {this.props.notification}
                    />
                )

            // Une équipe à crée un défi contre une de mes équipes
            case Types_Notification.ACCEPTER_DEFIS_CONTRE_EQUIPE : 
                return(
                    <Notif_Defis_Contre_Equipe
                        notification = {this.props.notification}
                    />
                )

            // Une  équipe relève un défi qu'une de mes équipe à posté
            case Types_Notification.ACCEPTER_DEFI_RELEVE : 
                return(
                    <Notif_Accepter_Releve_Defi
                        notification = {this.props.notification}
                    />
                )

            // Un joueur t'as convoqué / relancer pour une partie
            case Types_Notification.CONVOCATION_RELANCE_PARTIE :
                return(
                    <Notif_Convocation_Partie
                        notification = {this.props.notification}
                    />
                )
            
            // Un joueur confirme sa présence pour une partie que l'utilisateur a organisée
            case Types_Notification.CONFIRMER_PRESENCE_PARTIE :
                return(
                    <Notif_Presence_Partie
                        notification = {this.props.notification}
                    />
                )
            
            // Un joueur annule sa présence pour une partie que l'utilisateur a organisée
            case Types_Notification.ANNULER_PRESENCE_PARTIE :
                return(
                    <Notif_Presence_Partie
                        notification = {this.props.notification}
                    />
                )
             // Un joueur annule sa présence pour une partie que l'utilisateur a organisée
             case Types_Notification.INVITATION_REJOINDRE_EQUIPE :
             return(
                 <Notif_Invitation_Equipe
                     notification = {this.props.notification}
                 />
             )

            // Un joueur refuse de rejoindre une équipe
            case Types_Notification.REFUSER_INVITATION_REJOINDRE_EQUIPE : 
                return(
                    <Notif_Refu_Accepte_Equipe
                        notification = {this.props.notification}
                    />
                )
            
            // Un joueur accepte de rejoindre une équipe
            case Types_Notification.ACCEPTER_INVITATION_REJOINDRE_EQUIPE : 
                return(
                    <Notif_Refu_Accepte_Equipe
                        notification = {this.props.notification}
                    />
                )

            // Un joueur à ajouté l'utilisateur à son réseau
            case Types_Notification.AJOUT_RESEAU : 
                return(
                    <Notif_Ajout_Reseau
                        notification = {this.props.notification}
                    />
                )

            // Une équipe a accepté un défi proposé
            case Types_Notification.ACCEPTER_CONVOCATION_DEFI_ADVERSE : 
                    return(
                        <Notif_Accepter_Refuser_Defi_Adverse
                            notification = {this.props.notification}
                        />
                    )

            // Une équipe a refusé un défi proposé 
            case Types_Notification.REFUSER_CONVOCATION_DEFI_ADVERSE :
                return(
                    <Notif_Accepter_Refuser_Defi_Adverse
                        notification = {this.props.notification}
                    />
                )

            // Le capitaine de mon équipe a complété la feuille de match d'un défi
            case Types_Notification.FEUILLE_COMPLETEE : 
                return(
                    <Notif_feuille_completee_Defi
                        notification = {this.props.notification}/>
                )
            
            // Le cap adversse à complété la feuille de match d'un défi
            case Types_Notification.FEUILLE_COMPLETEE_ADVERSE : 
                return(
                    <Notif_feuille_completee_Defi_adverse
                        notification = {this.props.notification}
                        />
                )

            // L'organisateur d'une partie a complété la feuille de match
            case Types_Notification.FEUILLE_COMPLETEE_PARTIE : 
                return(
                    <Notif_feuille_completee_Partie
                        notification = {this.props.notification}
                    />
                )
            
            
            // Un joueur demande d'intégrer une équipe dont je suis cap
            case Types_Notification.DEMANDE_REJOINDRE_EQUIPE : 
                    return(
                        <Notif_Demande_Integrer_Equipe
                            notification = {this.props.notification}
                        />
                    )
            

            // Si notre demande pour intégrer une équipe a été refusée
            case Types_Notification.REFUSER_DEMANDE_INTEGRATION_EQUIPE : 
                return(
                    <Notif_Rep_Demande_Integration_Equipe
                        notification = {this.props.notification}
                    />
                )
            
            // Si notre demande pour intégrer une équipe a été acceptée
            case Types_Notification.ACCEPTER_DEMANDE_INTEGRATION_EQUIPE : 
            return(
                <Notif_Rep_Demande_Integration_Equipe
                    notification = {this.props.notification}
                />
            )

            // Si on a demandé à l'utilisateur d'être capitaine
            case Types_Notification.DEMANDE_REJOINDRE_CAPITAINES  :
            return(
                <Notif_Demande_Rejoindre_Capitaines
                    notification = {this.props.notification}
                />
            )
            default : 
        }
        
     }

    render() {
        return(
            <View>
                {this.chooseNotifToRender()}
            </View>
        )
    }
}