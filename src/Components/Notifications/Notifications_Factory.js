
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
import Notif_Refu_Equipe from './Notif_Equipe/Notif_Refu_Equipe';


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
            case Types_Notification.REFUSER_INVITATION_REJOINDRE_EQUIPE : 
                return(
                    <Notif_Refu_Equipe
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