
import { createStackNavigator, createAppContainer } from 'react-navigation';


import Accueil_Jouer from '../Vues/Jouer/Accueil_Jouer'
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
import Fiche_Partie_Rejoindre from '../Vues/Jouer/Rejoindre/Fiche_Partie_Rejoindre'
import Choix_Date_Defis from '../Vues/Jouer/Creation/Choix_Date_Defis'
import Feuille_Partie_A_Venir from '../Vues/Jouer/Feuille_de_Match/Feuille_Partie_A_Venir'
import Calendrier_Joueur from '../Vues/Jouer/Historique/Calendrier_Joueur'
import Feuille_Partie_Passee from '../Vues/Jouer/Feuille_de_Match/Feuille_Partie_Passee'
import Fiche_Defi_Rejoindre from '../Vues/Jouer/Rejoindre/Fiche_Defi_Rejoindre'
import Feuille_Defi_A_Venir from '../Vues/Jouer/Feuille_de_Match/Feuille_Defi_A_Venir'
import Feuille_Defi_Passe from '../Vues/Jouer/Feuille_de_Match/Feuille_Defi_Passe'
import StackProfil from './Navigation'
import ProfilJoueur from '../Vues/Joueur/ProfilJoueur'

const stackNavigator = createStackNavigator({

  /**
   * Page d'acceuil pour jouer
   */
  AccueilJouer : {
    screen : Accueil_Jouer
  },


  /**
   * Page de choix du format des défis
   */
  ChoixFormatDefi : {
    screen : Choix_Format_Defi
  },



  /**
   * Screen qui permet à l'utilisateur d'indiquer la date du défis qu'il
   * est en train de créer
   */
  ChoixDateDefis : {
    screen : Choix_Date_Defis
  },


  /**
   * Screen qui permet à un utilisateur de choisir le terrain pour le defis qu'il est
   * en train de créer
   */
  ChoixTerrainDefis : {
    screen : Choix_Terrain_Defis
  },

  /**
   * Screen qui permet à un utilisateur de choisir un de ses équipes lors de l'organisation
   * des defi.
   */
  ChoixEquipeDefis : {
    screen : Choix_Equipe_Defis
  },

  /**
   * Screen qui permet à l'utilisateur de choisir les joueurs de son équipe lors de
   * l'organisation d'un defi.
   */
  ChoixJoueursDefis2Equipes : {
    screen : Choix_Joueurs_Defis_2_Equipes
  },

  /**
   * Screen qui permet à l'utilisateur de choisir si il veut rechercher une équipe
   * à affronter ou si il veut poster une annonce (lors de la création d'un defi
   * entre 2 équipes)
   */
  Defis2EquipesContreQui : {
    screen : Defis_2_Equipes_Contre_Qui
  },

  /**
   * Screen qui permet à l'utilisateur de selectionner une équipe adverse
   * lors de la création d'un défis entre 2 équipes
   */
  ChoixEquipeAdverse : {
    screen : Choix_Equipe_Adverse
  },



  /**
   * Screen qui permet à l'utilisateur de choisir un message de chauffe
   * lors de la création d'un défi.
   */
  ChoixMessageChauffe : {
	  screen : Choix_Message_Chauffe
  },


  /**
   * Screen qui affiche le récapitulatif d'un défis que viens de créer
   * l'utilisateur
   */
  RecapitulatifDefis : {
	screen :Recapitulatif_Defis
  },


  /**
   * Screen qui permet à l'utilisateur de choisir les joueurs à inviter
   * lors de la création d'une partie
   */
  ChoixJoueursPartie : {
	  screen : Choix_Joueurs_Partie
  },


  /**
   * Screen qui permet à l'utilisateur de choisir le nombre de joueurs qu'il
   * recherche pour la création d'une partie
   */
  ChoixNbrJoueursPartie : {
	  screen : Choix_Nbr_Joueurs_Partie
  },

  /**
   * Screen qui affiche le récapitulatif d'une partie que l'utilisateur viens de créer.
   */
  RecapitulatifPartie : {
	  screen : Recapitulatif_Partie
  },

  /**
   * Screen qui affiche à l'utilisateur les défis et parties auxquels il peut participer.
   */
  RejoindrePartieDefi : {
    screen : Rejoindre_Partie_Defi
  },

  /**
   * Screen qui affiche le récap d'une partie et permet à l'utilisateur de la 
   * rejoindre
   */
  FichePartieRejoindre : {
    screen : Fiche_Partie_Rejoindre
  },

    /**
   * Screen qui affiche la feuille de match d'une partie à venir
   */
  FeuillePartieAVenir : {
    screen : Feuille_Partie_A_Venir
  },

  /**
   * Screen qui affiche le calendrier des défi et partie de l'utilisateur
   */
  CalendrierJoueur : {
    screen : Calendrier_Joueur
  },

  /**
   * Screen qui affiche la feuille de match d'une partie passée
   */
  FeuillePartiePassee : {
    screen : Feuille_Partie_Passee
  },


  /**
   * Fiche d'un défi
   */
  FicheDefiRejoindre : {
    screen : Fiche_Defi_Rejoindre
  },


  /**
   * Feuille de match d'un défi à venir
   */
  FeuilleDefiAVenir : {
    screen : Feuille_Defi_A_Venir
  },


  /**
   * Feuille de match d'un défi passé
   */
  FeuilleDefiPasse : {
    screen : Feuille_Defi_Passe
  },

  ProfilJoueur : {
    screen : ProfilJoueur
  }

}, {
  headerLayoutPreset: 'center'
})

export default createAppContainer(stackNavigator)
