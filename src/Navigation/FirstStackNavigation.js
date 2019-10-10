import React, { Component } from 'react';
import { createStackNavigator, createAppContainer } from 'react-navigation';

// Connexion et inscription
import First_screen from '../Vues/First_screen';
import Modes_de_connexion from '../Vues/Connexion_Inscription/Modes_de_connexion';
import Modes_inscription from '../Vues/Connexion_Inscription/Modes_incription';
import Inscription_Nom_Pseudo from '../Vues/Connexion_Inscription/Inscription_Nom_Pseudo';
import Inscription_Photo from '../Vues/Connexion_Inscription/Inscription_Photo';
import Inscription_Age_Zone from '../Vues/Connexion_Inscription/Inscription_Age_Zone'
import Confimation_Inscription from '../Vues/Connexion_Inscription/Confimation_Inscription'
import Inscription_CGU from '../Vues/Connexion_Inscription/Inscription_CGU'
import ProfilJoueur from '../Vues/Joueur/ProfilJoueur'
// Navigation "interne" avec tab bar
import NavigationInterne from '../Navigation/OngletsNavigator'


const FirstStackNavigation = createStackNavigator({

    /**
     * Fist_screen
     */
    first : {
        screen : First_screen,
        navigationOptions : {
        }
    },

    /**
     * Screen qui permet de choisir le mode de connexion
     */
    choixModeCo : {
        screen : Modes_de_connexion
    },


    /**
     * Screen qui permet de choisir le mode d'inscription
     */
    choixModeInscription : {
        screen : Modes_inscription
    },

    /**
     * Screen qui permet à l'utilisateur de renseigner
     * son nom et son pseudo lors de l'inscription
     */
    InscriptionNomPseudo : {
        screen : Inscription_Nom_Pseudo
    },

    InscriptionCGU : {
        screen: Inscription_CGU
    },

    /**
     * Screen qui permet à l'utilisateur de renseigner
     * sa photo de profil lors de l'inscription
     */
    InscriptionPhoto : {
        screen : Inscription_Photo
    },

    /**
     * Screen qui permet à l'utilisateur de renseigner
     * sa zone et son age lors de l'inscrption
     */
    InscriptionZone : {
        screen : Inscription_Age_Zone
    },


    ConfirmationInscription : {
        screen : Confimation_Inscription
    },

    

    NavigationInterne: {
        screen : NavigationInterne,
        navigationOptions: { title: '', header: null }
    },
    


}, {
    headerLayoutPreset: 'center'
})

export default createAppContainer(FirstStackNavigation)