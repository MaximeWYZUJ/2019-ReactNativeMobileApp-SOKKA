
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
import Rechercher_Terrains_Map from '../Vues/Terrain/Rechercher_Terrains_Map'
import Choix_Date_Defis from '../Vues/Jouer/Creation/Choix_Date_Defis'
import Rechercher_Terrain_Nom from '../Vues/Terrain/Rechercher_Terrain_Nom'
import ProfilJoueurMesEquipes from '../Vues/Joueur/ProfilJoueurMesEquipes';
import Calendrier_Joueur from '../Vues/Jouer/Historique/Calendrier_Joueur'
import Joueurs_Equipe from '../Vues/Equipe/Joueurs_Equipe'
import Choix_Capitaines_Equipe from '../Vues/Equipe/Choix_Capitaines_Equipe'
import Accueil_Conversation from "../Vues/Conversation/Accueil_Conversation"
import List_Messages from '../Vues/Conversation/List_Messages'


/*import Accueil_Jouer from '../Vues/Jouer/Accueil_Jouer'
import Choix_Format_Defi from '../Vues/Jouer/Creation/Choix_Format_Defi'
import Choix_Terrain_Defis from '../Vues/Jouer/Creation/Choix_Terrain_Defis'
import Choix_Equipe_Defis from '../Vues/Jouer/Creation/Choix_Equipe_Defis'
import Choix_Joueurs_Defis_2_Equipes from '../Vues/Jouer/Creation/Defis_2_Equipes/Choix_Joueurs_Defis_2_Equipes'
import Defis_2_Equipes_Contre_Qui from '../Vues/Jouer/Creation/Defis_2_Equipes/Defis_2_Equipes_Contre_Qui'
import Choix_Equipe_Adverse  from '../Vues/Jouer/Creation/Defis_2_Equipes/Choix_Equipe_Adverse'
import Choix_Message_Chauffe from '../Vues/Jouer/Creation/Choix_Message_Chauffe'
import Recapitulatif_Defis from '../Vues/Jouer/Creation/Recapitulatif_Defis'
import Choix_Joueurs_Partie from '../Vues/Jouer/Creation/Partie_Entre_Joueurs/Choix_Joueurs_Partie'
import Choix_Nbr_Joueurs_Partie from '../Vues/Jouer/Creation/Partie_Entre_Joueurs/Choix_Nbr_Joueurs_Partie'
import Recapitulatif_Partie from '../Vues/Jouer/Creation/Partie_Entre_Joueurs/Recapitulatif_Partie'
import Rejoindre_Partie_Defi from '../Vues/Jouer/Rejoindre/Rejoindre_Partie_Defi'
import Fiche_Partie_Rejoindre from '../Vues/Jouer/Rejoindre/Fiche_Partie_Rejoindre'*/

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
   * Screen qui permet d'afficher une carte des terrains
   * autours de l'utilisateur
   */
  RechercherTerrainsMap  : {
    screen : Rechercher_Terrains_Map
  },

  /**
   * Screen qui permet à l'utilisateur de rechercher un terrain
   * en fonction de son nom
   */
  RechercherTerrainsNom : {
    screen : Rechercher_Terrain_Nom
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

  ListMessages : {
    screen : List_Messages
  },
  /**
   * Page d'acceuil pour jouer
   *
  AccueilJouer : {
    screen : Accueil_Jouer
  },


  /**
   * Page de choix du format des défis
   *
  ChoixFormatDefi : {
    screen : Choix_Format_Defi
  },



  /**
   * Screen qui permet à l'utilisateur d'indiquer la date du défis qu'il
   * est en train de créer
   *
  ChoixDateDefis : {
    screen : Choix_Date_Defis
  },


  /**
   * Screen qui permet à un utilisateur de choisir le terrain pour le defis qu'il est
   * en train de créer
   *
  ChoixTerrainDefis : {
    screen : Choix_Terrain_Defis
  },

  /**
   * Screen qui permet à un utilisateur de choisir un de ses équipes lors de l'organisation
   * des defi.
   *
  ChoixEquipeDefis : {
    screen : Choix_Equipe_Defis
  },

  /**
   * Screen qui permet à l'utilisateur de choisir les joueurs de son équipe lors de
   * l'organisation d'un defi.
   *
  ChoixJoueursDefis2Equipes : {
    screen : Choix_Joueurs_Defis_2_Equipes
  },

  /**
   * Screen qui permet à l'utilisateur de choisir si il veut rechercher une équipe
   * à affronter ou si il veut poster une annonce (lors de la création d'un defi
   * entre 2 équipes)
   *
  Defis2EquipesContreQui : {
    screen : Defis_2_Equipes_Contre_Qui
  },

  /**
   * Screen qui permet à l'utilisateur de selectionner une équipe adverse
   * lors de la création d'un défis entre 2 équipes
   *
  ChoixEquipeAdverse : {
    screen : Choix_Equipe_Adverse
  },



  /**
   * Screen qui permet à l'utilisateur de choisir un message de chauffe
   * lors de la création d'un défi.
   *
  ChoixMessageChauffe : {
	  screen : Choix_Message_Chauffe
  },


  /**
   * Screen qui affiche le récapitulatif d'un défis que viens de créer
   * l'utilisateur
   *
  RecapitulatifDefis : {
	screen :Recapitulatif_Defis
  },


  /**
   * Screen qui permet à l'utilisateur de choisir les joueurs à inviter
   * lors de la création d'une partie
   *
  ChoixJoueursPartie : {
	  screen : Choix_Joueurs_Partie
  },


  /**
   * Screen qui permet à l'utilisateur de choisir le nombre de joueurs qu'il
   * recherche pour la création d'une partie
   *
  ChoixNbrJoueursPartie : {
	  screen : Choix_Nbr_Joueurs_Partie
  },

  /**
   * Screen qui affiche le récapitulatif d'une partie que l'utilisateur viens de créer.
   *
  RecapitulatifPartie : {
	  screen : Recapitulatif_Partie
  },

  /**
   * Screen qui affiche à l'utilisateur les défis et parties auxquels il peut participer.
   *
  RejoindrePartieDefi : {
    screen : Rejoindre_Partie_Defi
  },

  /**
   * Screen qui affiche le récap d'une partie et permet à l'utilisateur de la
   * rejoindre
   *
  FichePartieRejoindre : {
    screen : Fiche_Partie_Rejoindre
  },*/

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
