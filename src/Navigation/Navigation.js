
import React, { Component } from 'react';
import { createStackNavigator, createAppContainer,createBottomTabNavigator, TabNavigator } from 'react-navigation';

import Profil_Equipe from '../Vues/Equipe/Profil_Equipe';
import Reglages_Equipe from '../Vues/Equipe/Reglages_Equipe'

import ProfilJoueur from '../Vues/Joueur/ProfilJoueur'
import ProfilJoueurMonReseau from '../Vues/Joueur/ProfilJoueurMonReseau'
import ProfilJoueurMesFavoris from '../Vues/Joueur/ProfilJoueurMesFavoris'
import ProfilJoueurMesEquipesFav from '../Vues/Joueur/ProfilJoueurMesEquipesFav'
import ProfilJoueurMesTerrainsFav from '../Vues/Joueur/ProfilJoueurMesTerrainsFav'
import Creation_Equipe_Nom from '../Vues/Creation_Equipe/Creation_Equipe_Nom'
import Creation_Equipe_Zone from '../Vues/Creation_Equipe/Creation_Equipe_Zone'
import Creation_Equipe_Ajouter_Joueurs from '../Vues/Creation_Equipe/Creation_Equipe_Ajouter_Joueurs'
import Creation_Equipe_Citation from '../Vues/Creation_Equipe/Creation_Equipe_Citation'
import Creation_Equipe_Photo from '../Vues/Creation_Equipe/Creation_Equipe_Photo'
import ProfilJoueurReglages from '../Vues/Joueur/ProfilJoueurReglages'
import Joueurs_qui_likent from '../Vues/Like/Joueurs_qui_likent'
import Profil_Terrain from '../Vues/Terrain/Profil_Terrain'
import ProfilJoueurMesEquipes from '../Vues/Joueur/ProfilJoueurMesEquipes';
import Calendrier_Joueur from '../Vues/Jouer/Historique/Calendrier_Joueur'
import Joueurs_Equipe from '../Vues/Equipe/Joueurs_Equipe'
import Choix_Capitaines_Equipe from '../Vues/Equipe/Choix_Capitaines_Equipe'
import Accueil_Conversation from "../Vues/Conversation/Accueil_Conversation"
import List_Messages from '../Vues/Conversation/List_Messages'
import New_Message from '../Vues/Conversation/New_Message'
import New_Groupe from '../Vues/Conversation/New_Groupe'
import Modifier_Groupe from '../Vues/Conversation/Modifier_Groupe'

const stackNavigator = createStackNavigator({

  ProfilJoueur : {
    screen : ProfilJoueur
  },

  /**
   * Screen qui permet à l'utilisateur de renseigner le nom d'une
   * équipe lors de sa creation
   */
  CreationEquipeNom : {
    screen : Creation_Equipe_Nom
  },

  /**
   * Screen qui permet à l'utilisateur de renseigner la zone d'une
   * équipe lors de sa creation
   */
  CreationEquipeZone : {
    screen : Creation_Equipe_Zone
  },

  /**
   * Screen qui permet à l'utilisateur d'ajouter des joueurs
   * à l'équipe qu'il est en train de créer.
   */
  CreationEquipeAjoutJoueurs : {
    screen : Creation_Equipe_Ajouter_Joueurs
  },


  /**
   * Screen qui permet à l'utilisateur de choisir une citation
   * pour l'équipe qu'il est en train de créer.
   */
  CreationEquipeCitation : {
    screen : Creation_Equipe_Citation
  },

  /**
   * Screen qui permet à l'utilisateur de choisir une photo
   * pour l'équipe qu'il est en train de créer.
   */
  CreationEquipePhoto : {
    screen : Creation_Equipe_Photo
  },


  /**
   * Screen qui affiche la liste des joueurs qui likent
   */
  JoueursQuiLikent : {
    screen : Joueurs_qui_likent
  },

  /**
   * Screen qui affiche le profil d'un terrain
   */
  ProfilTerrain : {
    screen : Profil_Terrain
  },


  /**
   * Screen qui affiche tous les joueurs d'une équipe
   */
  JoueursEquipe : {
    screen: Joueurs_Equipe
  },

  /**
   * Screen qui permet de choisir les capitaines de l'équipe
   */
  ChoixCapitainesEquipe : {
    screen  :Choix_Capitaines_Equipe 
  },


  /**
   * Screen qui affiche toutes les conversations de l'utilisateur
   */
  AccueilConversation : {
    screen : Accueil_Conversation
  },


  /**
   * Screen qui affiche la liste des messages d'une conversation
   */
  ListMessages : {
    screen : List_Messages
  },


  /**
   * Screen qui permet de choisir un joueur pour démarer une conversation ou éventuelement 
   * créer un groupe.
   */
  NewMessage : {
    screen : New_Message
  },

  NewGroupe : {
    screen : New_Groupe
  },

  ModifierGroupe : {
    screen : Modifier_Groupe
  },

  ProfilJoueurMonReseauScreen : {
    screen : ProfilJoueurMonReseau
  },

  ProfilJoueurMesEquipesScreen : {
    screen : ProfilJoueurMesEquipes
  },

  ProfilJoueurMesFavorisScreen : {
    screen : ProfilJoueurMesFavoris
  },

  ProfilJoueurMesEquipesFavScreen : {
    screen : ProfilJoueurMesEquipesFav
  },

  ProfilJoueurMesTerrainsFavScreen : {
    screen : ProfilJoueurMesTerrainsFav
  },

  ProfilJoueurReglagesScreen : {
    screen : ProfilJoueurReglages
  },


  Profil_Equipe: {
    screen: Profil_Equipe
  },

  Reglages_Equipe: {
    screen: Reglages_Equipe
  },

    /**
   * Screen qui affiche le calendrier des défi et partie de l'utilisateur
   */
  CalendrierJoueur : {
    screen : Calendrier_Joueur
  },
}, {
  headerLayoutPreset: 'center'
})

export default createAppContainer(stackNavigator)
