import React from 'react'

import {View, Text,Image, Animated,TouchableOpacity,TextInput, Button, SafeAreaView,TouchableWithoutFeedback,StyleSheet, NativeModules, Keyboard,Platform, ImageBackground,KeyboardAvoidingView, ScrollView} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RF from 'react-native-responsive-fontsize';
import Database from '../../Data/Database'
import firebase from 'firebase'
import '@firebase/firestore'
import { Fumi } from 'react-native-textinput-effects';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import Sokka_Main_Component from '../Sokka_Main_Component'
import StylesHelpers from '../../Helpers/StylesHelpers'
import { Header } from 'react-navigation';
import { Constants } from 'expo';
import HideWithKeyboard from 'react-native-hide-with-keyboard';
import Back_arrow from '../../Components/Back_arrow'
const erreurMdpDiff = "Les mots de passe sont différents";
const erreurMdpTropCourt = "Le mot de passe doit faire au moins 6 caractères"
const erreurFormat = "Format du mail non reconnu"
const { StatusBarManager } = NativeModules;
import * as Font from 'expo-font';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input } from 'react-native-elements';
import LoginTopComponent from "../../Components/connexion_inscription/LoginTopComponent"

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBarManager.HEIGHT;
const CGU = "Conditions générales d'utilisation de SOKKA S.A.S.\n\n\nARTICLE 1 : Objet\nLa société SOKKA S.A.S. (ci-après : la « Société »), société par actions simplifiée, immatriculée au R.C.S. de Toulouse sous le numéro 851 299 420 R.C.S. Toulouse, dont le siège social est sis 8 rue Belle Paule – 31500 Toulouse, édite et exploite une plateforme de services dédiée aux acteurs du football amateurs disponible en tant qu’application sur iOS et Android.\nCette plateforme a pour vocation de faciliter l’organisation de rencontre sportive en favorisant : la mise en relation des joueurs de football, leur organisation, la logistique,…, le développement de communautés, et l’interaction entre les utilisateurs grâce à des fonctionnalités ludiques.\n\n\nLes présentes « conditions générales d'utilisation » (ci-après dénommées « CGU ») ont pour objet l'encadrement des conditions et modalités d’utilisation de la plateforme SOKKA ainsi que de définir les droits et devoirs des Utilisateurs.\n\nCe contrat est conclu entre :\n\nLa société SOKKA, ci-après désigné « La société »,\n\nToute personne physique ou morale souhaitant accéder à l’application et à ses services et au site, ci-après appelé « l’Utilisateur ».\n\nToute inscription à, accès à et/ou utilisation de la plateforme ou de tout autre service proposé par SOKKA, l’utilisateur (ou, le cas échéant, le partenaire) suppose l’acceptation de l’ensemble des conditions générales d'utilisation sans réserves. \nNous vous invitons à en prendre attentivement connaissance. \n\nARTICLE 2: accès, inscription à la plateforme et création de compte\n\n3 .1 Condition d’accès à la plateforme et protection des mineurs\n\nAfin d’utiliser la plateforme et les services SOKKA, l’utilisateur déclare avoir la capacité d’accepter les CGU.\nL'accès à la Plateforme est soumis préalablement à l’inscription de l’Utilisateur, son identification et l’utilisation d’un Compte Utilisateur.\nLors de la création de son Compte Utilisateur, l’Utilisateur sera amené à choisir son identifiant personnel et un mot de passe associé. \nDe plus, un formulaire d’inscription sera soumis à l’Utilisateur afin qu’il communique à SOKKA différentes informations à caractère personnel (adresse mail, mot de passe, âge, code postal, pseudonyme) obligatoires ou facultatives selon les mentions figurant sur le formulaire. A défaut de communication par l’Utilisateur des informations mentionnées comme obligatoires, la validation de la création du Compte Utilisateur ne pourra avoir lieu. Les \nCes données personnelles sont collectées et conservées avec le consentement de l’Utilisateur et feront l’objet d’un traitement tel que défini à l’article 6 défini ci-après.\nL’Utilisateur s’engage également à ne communiquer que des informations exactes et à jour et notamment à ne pas utiliser de pseudonyme ni d'adresse électronique qui pourrait porter atteinte aux droits des tiers (notamment utilisation du nom patronymique d’un tiers, du pseudonyme d’un tiers ou de la marque déposée par un tiers, ou d'œuvres protégées par le droit de la propriété intellectuelle). SOKKA utilisera notamment les informations que l’Utilisateur a accepté de communiquer pour lui constituer une fiche « profil ». \nSOKKA se réserve la possibilité de refuser toute inscription ne respectant pas les conditions énoncées ci-dessus.\n\nDans l'hypothèse où l’Utilisateur serait une personne physique mineure, il déclare et reconnaît avoir recueilli l'autorisation préalable de ses parents ou du (des) titulaire(s) de l'autorité parentale le concernant pour s’inscrire sur la Plateforme numérique. Le(s) titulaire(s) de l'autorité parentale a (ont) accepté d'être garant(s) du respect de l'ensemble des dispositions des présentes CGU lors de l’utilisation de la Plateforme par l’Utilisateur mineur. Ainsi, les parents (ou titulaires de l'autorité parentale) sont invités à surveiller l'utilisation faite par leurs enfants des Contenus et/ou Services mis à disposition sur la Plateforme et à garder présent à l'esprit qu'en leur qualité de tuteur légal il est de leur responsabilité de surveiller l'utilisation qui en est faite.\n\nLa société se réserve le droit de refuser et de supprimer tout compte généré par un robot. \n\nSOKKA ne peut être tenue pour responsable du mauvais fonctionnement du Service et du Programme pour un navigateur donné. SOKKA ne pourra être tenue responsable si les données relatives à l’inscription de l’Utilisateur ne lui parvenaient pas pour une quelconque raison dont elle ne pourrait être tenue responsable (par exemple, un problème de connexion à Internet où à une quelconque raison chez l'Utilisateur, une défaillance momentanée des serveurs pour une raison quelconque, etc.) ou lui arrivaient illisibles ou impossible à traiter (par exemple, si l’Utilisateur possède un matériel informatique ou un environnement logiciel inadéquat pour son inscription, etc.). \nLa plateforme et ses différents services peuvent être interrompus ou suspendus par l’Éditeur, notamment à l’occasion d’une maintenance, sans obligation de préavis ou de justification. \nSOKKA se réserve le droit, sans préavis, ni indemnité, de fermer temporairement ou définitivement la plateforme ou l’accès à un ou plusieurs Services à l’occasion de maintenances, de mises à jours, de modifications ou de changement sur les méthodes opérationnelles, les serveurs et les heures d’accessibilité, ou toute autre raison le nécessitant. \n\n\nARTICLE 3 : Description des Services et fonctionnement de la Plateforme\n\nSOKKA a pour objectif de faciliter la pratique du football et de mettre en relation la communauté associée. \nSOKKA ne garantit ni la réservation ni la disponibilité des terrains de jeux et ne pourra être tenue responsable de la non tenue de la manifestation proposée par un utilisateur. \nL’Utilisateur à accès aux services sous une forme et selon les fonctionnalités et moyens technique que SOKKA juge les plus appropriés pour répondre à cet objectif. \nL’accès et l’inscription à la Plateforme, de même que la recherche, la consultation et la publication de proposition de matchs sont gratuits. \nSOKKA se réserve le droit de proposer des services payants. Les CGU seront alors modifiées et mises à jour. \nLes frais supportés par l’Utilisateur pour accéder à la plateforme (connexion internet, matériel informatique, etc.) ne sont pas à la charge de la société. \nSOKKA se réserve le droit, à tout moment et unilatéralement, de mettre fin aux présentes CGU, de les compléter ou de les modifier de la façon qu’elle juge nécessaire. Chaque nouvelle version des CGU reçoit une application immédiate pour l’ensemble des Membres dès sa publication sur le site et/ou l’application SOKKA. \nSOKKA se réserve la possibilité de suspendre ou fermer un compte et de refuser, à l’avenir, l’accès à tout ou partie des services à toute personne physique ou morale ne respectant pas les CGU. \n\n\nARTICLE 4 : Règles générales - Responsabilités et engagements\n\nL’Utilisateur reconnaît être parfaitement informé des risques particuliers liés aux spécificités d’Internet, des réseaux et notamment du fait que des informations relatives à des données personnelles le concernant peuvent être captées et/ou transférées, notamment dans des pays n’assurant pas un niveau de protection adéquat des données personnelles et les accepter.\nL’utilisateur reconnaît avoir l’entière responsabilité de la conservation du caractère confidentiel de son code d’accès ou du code d’accès du Bénéficiaire qu’il représente.\nEn cas d’utilisation frauduleuse dudit code d’accès, l’Utilisateur s’engage à informer immédiatement SOKKA de l’utilisation non autorisée de son compte. \nSOKKA ne pourra pas être tenu responsable des préjudices découlant de la transmission de toute information par l’Utilisateur, y compris de celle de son identifiant et/ou de son mot de passe via la Plateforme.\nL’Utilisateur s'interdit d'utiliser tout matériel ou logiciel susceptible d'altérer, d'entraver ou de fausser le fonctionnement des Services et de la Plateforme numérique, ou d'introduire toute donnée dans un système de traitement automatisé de données de FRANCE TELEVISIONS susceptible d'altérer, d'entraver ou de fausser le fonctionnement normal des Services et de la Plateforme numérique et notamment de contourner les restrictions à l'utilisation définies par les présentes CGU.\nL’Utilisateur s’engage à accéder et utiliser la Plateforme et les Services conformément aux lois, règlements et obligations en vigueur, et aux présentes CGU.\nA cet égard, l’Utilisateur reconnait qu’aux fins exclusives de vérification du respect par lui des présentes Conditions Générales et des lois applicables, la Société peut prendre connaissance de tout Contenu publié ou échangé sur le Site.\nL’Utilisateur s’engage à réaliser toutes les déclarations et formalités nécessaires à son activité, ainsi qu’à satisfaire à toutes ses obligations légales, sociales, administratives et fiscales et à toutes les obligations spécifiques qui lui incombe le cas échéant en application du droit français et/ou de la législation étrangère dont il dépend, dans le cadre de son activité et de l’utilisation des Services.\nEn cas de demande, l’Utilisateur s’engage à fournir, sans délai, à la Société tout justificatif prouvant qu’il remplit les conditions énoncées dans le présent article.\n\nL’Utilisateur est seul responsable du bon accomplissement des formalités précitées qui lui incombent. La responsabilité de la Société ne pourra pas être engagée à ce titre.\nL’Utilisateur s’engage à ne publier que des propositions de manifestation ou rencontre, réellement envisagés et d’effectuer la rencontre tel que décrit dans l’annonce de rencontre sportive. \n\nL'Utilisateur est responsable des risques liés à l’utilisation de son identifiant de connexion et de son mot de passe. En cas de divulgation de mot de passe, la Société décline toute responsabilité.\n\nL’Utilisateur assume l’entière responsabilité de l’utilisation qu’il fait des informations et contenus présents sur la plateforme.\n\nLe site permet aux utilisateurs de publier sur le site :\nDes commentaires, \nDes photos,  \nDes avis, \nEtc.\n\nLe membre s’engage à tenir des propos respectueux des autres et de la loi et accepte que ces publications soient modérées ou refusées par la Société, sans obligation de justification. \nLa Société ne peut être tenue responsable des données, déclarations et informations qu’un autre Administrateur utilise ou serait susceptible d’utiliser dans le cadre de la Plateforme.\nL’Utilisateur s’engage à faire preuve de discernement dans le cadre de l’utilisation qu’il fait de la Plateforme.\nPar conséquent, SOKKA ne peut être tenue responsable des données, déclarations et informations qu’un autre Utilisateur utilise ou serait susceptible d’utiliser dans le cadre de la Plateforme.\nL’Utilisateur ne doit en aucune manière, vendre, revendre ou exploiter de quelque manière et pour quelque but que ce soit tout ou partie des contenus figurant sur la Plateforme.\nL’Utilisateur s‘engage à ne transmettre à SOKKA (notamment lors de la création ou la mise à jour de votre Compte) ou aux autres Utilisateurs aucune information fausse, trompeuse, mensongère ou frauduleuse. \nL’Utilisateur s‘engage à ne tenir aucun propos, n’avoir aucun comportement ou ne publier sur la Plateforme aucun contenu à caractère diffamatoire, injurieux, obscène, pornographique, vulgaire, offensant, agressif, déplacé, violent, menaçant, harcelant, raciste, xénophobe, à connotation sexuelle, incitant à la haine, à la violence, à la discrimination ou à la haine, encourageant les activités ou l’usage de substances illégales ou, plus généralement, contraires aux finalités de la Plateforme, de nature à porter atteinte aux droits de SOKKA ou d’un tiers ou contraires aux bonnes mœurs ; ne pas porter atteinte aux droits et à l’image de SOKKA, notamment à ses droits de propriété intellectuelle ; à ne pas ouvrir plus d’un Compte sur la Plateforme et ne pas ouvrir de Compte au nom d’un tiers ; à se conformer aux présentes CGU et à la Politique de Confidentialité.\n\nL’Utilisateur est entièrement responsable de tout contenu et communications qu’il publie et transmet via la Plateforme.\n\nL’Utilisateur joueur doit s’assurer que son contrat d’assurance comporte une garantie de responsabilité civile qui peut être étendue à la pratique du football, et soit à jour. \nSOKKA invite les utilisateurs à garantir les risques de dommages corporels par un contrat d’assurance adéquat. \n\nL’utilisateur s’engage à avoir une attitude Fair-Play vis-à-vis des autres joueurs ou de tiers. \n\nTout dysfonctionnement du serveur ou du réseau ne peut engager la responsabilité de la Société.\n\nDe même, la responsabilité de la plateforme ne peut être engagée en cas de force majeure ou du fait imprévisible et insurmontable d'un tiers.\n\nLa plateforme s'engage à mettre en œuvre tous les moyens nécessaires pour garantir la sécurité et la confidentialité des données. Toutefois, il n’apporte pas une garantie de sécurité totale.\n\nLa société se réserve la faculté d’une non-garantie de la fiabilité des sources, bien que les informations diffusées sur le site soient réputées fiables.\nVous êtes seul responsable de vos interactions avec d'autres utilisateurs. Vous comprenez que la société ne fait actuellement pas de contrôle pénal sur ses utilisateurs. La société ne vérifie pas les informations communiquées par les utilisateurs. L'entreprise ne fait aucune représentation ou garantie quant à la conduite des utilisateurs ou à leur compatibilité avec les utilisateurs actuels ou futurs. En aucun cas la société ne saurait être tenue responsable de dommages, directs, indirects, généraux, spéciaux, compensatoires, consécutifs et / ou accessoires découlant de la conduite de vous ou de toute autre personne en relation avec l'utilisation de le service, y compris, sans s'y limiter, les blessures corporelles, la détresse émotionnelle et / ou tout autre dommage résultant de communications ou de rencontres avec d'autres utilisateurs. Vous acceptez de prendre des précautions raisonnables dans toutes les interactions avec d'autres utilisateurs du service en particulier si vous décidez de communiquer hors du Service.\nARTICLE 5 : Propriété intellectuelle\n\nLes services et les contenus (tel que logos, textes, éléments graphiques, vidéos, données, bases de données, information, marques, illustrations, etc.) qui sont disponibles ou apparaissent sur la Plateforme et sur le site www.sokka.app sont réservés et protégés par le droit d’auteur, droit des marques, droit des producteurs de base de données, en vertu du Code de la propriété intellectuelle ou de tout autre droit reconnu par la législation en vigueur. \n\nToute copie, reproduction, représentation, adaptation, altération, modification, diffusion non autorisée, intégrale ou partielle, des Services et/ou du contenu de la Plateforme, qu’il s’agisse du contenu appartenant à SOKKA, à un tiers ou à un autre Utilisateur, est illicite et pourra engager la responsabilité pénale et civile de l’Utilisateur contrevenant.\n\nSOKKA accordent à l’Utilisateur respectivement pour les Contenus les concernant l’autorisation incessible, gratuite, non exclusive, personnelle et privée d’utiliser les Services et la Plateforme pour un usage uniquement personnel et privé, et dans le strict respect des conditions d'utilisation établies par les présentes CGU. Tout usage commercial ou lucratif est interdit. \n\nL’Utilisateur est entièrement responsable de tout contenu et communications qu’il publie et transmet via la Plateforme et il s’engage à ne pas porter atteinte à un tiers. \n\nLa Société se réserve le droit de modérer ou de supprimer librement et à tout moment les contenus mis en ligne par les utilisateurs, et ce sans justification. \n\nEn publiant sur la plateforme, tout Utilisateur cède, à titre gracieux et non exclusif, à SOKKA et pour toute la durée de la propriété intellectuelle à compter de la transmission par tout moyen de ses Contenus, le droit de reproduire, représenter, copier, céder, modifier, rééditer, communiquer, distribuer, adapter et plus généralement d'exploiter tout ou partie des Contenus sur la Plateforme numérique et tous les services associés pour des besoins de promotion de l’activité de la Plateforme numérique, directement ou par un tiers autorisé.\nCes droits sont cédés pour le monde entier pour toutes exploitations sur tous supports et par tous procédés de diffusion connus ou inconnus à ce jour.\nLa société s'engage toutefois à citer l’utilisateur en cas d’utilisation de  sa publication. \n\nL’utilisateur reconnaît et accepte expressément qu’aucune exploitation des Contenus et telle qu’autorisée dans le cadre des présentes ne pourra donner lieu à rétribution quelconque (en nature comme en espèces). \n\nARTICLE 6 : Données personnelles\n\nL’Utilisateur doit obligatoirement fournir des informations personnelles pour procéder à son inscription sur le site. \n\nLes données à caractère personnel sont toutes informations se rapportant à une personne physique identifiée ou identifiable, directement ou indirectement.\nConformément à la loi dite « Informatique et Libertés » du 6 janvier 1978 modifiée par la loi du 6 août 2004, l’Utilisateur est informé que la Société procède à des traitements automatisés des données à caractère personnel de l’Utilisateur, notamment lors de sa connexion ou inscription au Site.\nSOKKA se conforme au règlement général sur la protection des données (RGPD).\nLa Société est destinataire des données à caractère personnel recueillies par l'intermédiaire du Site et de l’Application et est soucieuse de protéger les données à caractère personnel communiquées par les Utilisateurs les concernant. Dans ce cadre, SOKKA s’engage à mettre tous les moyens en œuvre pour assurer la sécurité et la confidentialité de ces données.\nLes données à caractère personnel sont traitées par SOKKA à des fins de gestion des profils Utilisateur, d’études marketing et statistiques, de suivi de qualité des Services, de gestion de la relation client et de prospection commerciale, d’envoi de newsletter et de sms, ceci dans le but de fournir aux Utilisateurs les Services fonctionnels et les mieux adaptés. \nCes données peuvent être recueillies par SOKKA : \nSoit de manière directe lorsque l’Utilisateur les renseigne librement : \n-Pour la création et la gestion de comptes Utilisateur, des données d’identification (identifiant et mot de passe) et de données relatives à l’identité (nom, prénom, pseudonyme, date de naissance, ville et code postale et adresse électronique) sont demandées. L’Utilisateur peut modifier ces informations et/ou supprimer son compte à tout moment depuis l’espace de gestion de son compte.\n\n- Pour permettre à l’Utilisateur de recevoir des newsletters ou informations ou alertes par le biais entre autres de l’inscription à la newsletter, des données relatives à l’identité (nom, prénom, pays, ville et adresse électronique) sont demandées. L’Utilisateur peut se désabonner de la lettre d’information à tout moment.\nCes données sont accessibles à tout moment dans la rubrique « Profil » grâce à l’adresse e-mail, au login et au mot de passe de l’Utilisateur. \n- Pour se conformer à l’obligation légale d’identification des utilisations abusives de la Plateforme concernant la publication de Commentaires et/ou Contenu Utilisateur.\n\nL’Utilisateur s’engage à ne communiquer que des informations exactes et à jour, révélant une véritable identité et qui ne pourrait porter atteinte aux droits des tiers, notamment aux droits de propriété intellectuelle.\n\nL’Utilisateur est informé du caractère facultatif ou obligatoire des informations qui lui sont demandées.\nSoit de manière indirecte lorsque les données à caractère personnel sont collectées automatiquement via des moyens informatiques. Il s’agit des données de connexion (adresse IP, logs, date et heure de connexion).\nAprès accord de l’Utilisateur, les données de géolocalisation sont utilisées afin d’afficher une position, définir une zone de pratique, calculer un itinéraire entre deux localisations, fournir à l’utilisateur les services les mieux adaptés, tel que la suggestion de sessions sportives ou d’évènements.\nConformément à la loi n° 78-17 du 6 janvier 1978 relative à l'informatique, aux fichiers et aux libertés, modifiée par la loi n°2004-801 du 6 août 2004, l’Utilisateur dispose d’un:\nDroit d’opposition pour motif légitime à ce que les données personnelles le concernant fassent l’objet d’un traitement, et d’un droit d’opposition à ce que ces données soient utilisées à des fins de prospection notamment commerciales ;\nDroit d’accès à toutes ses données personnelles ; \nDroit de demander que ses données soient rectifiées, complétées, mises à jour, verrouillées ou effacées lorsqu’elles sont inexactes, incomplètes, équivoques ou périmées, ou dont la collecte, l’utilisation, la communication ou la conservation est interdite.\n Pour exercer ses droits, il suffit à l’Utilisateur d’écrire à l’adresse électronique suivante « contact@sokka.app » ou d'adresser un courrier à : SOKKA, 8 rue Belle Paule 31500 TOULOUSE.\nConsultez le site cnil.fr pour plus d’informations sur vos droits.\nSi vous estimez, après nous avoir contactés, que vos droits « Informatique et Libertés » ne sont pas respectés, vous pouvez adresser une réclamation à la CNIL.\n\nL’Utilisateur peut également, pour des motifs légitimes, s’opposer au traitement des données le concernant.\n\nLes données peuvent également être communiquées aux sous- traitants de SOKKA qui agissent au nom et pour le compte de SOKKA, et notamment l’hébergeur de l’Application. A cette fin, SOKKA utilise Firebase (database, analytics, etc) pour stocker une partie des données: les données sont stockées aux Etats-Unis par la société Google Inc. La Société a mise en place les mesures nécessaires pour assurer un niveau adéquat de protection des données personnelles des Utilisateurs.\nCette application utilise \"Firebase Services\" (Firebase), un service d'analyse de Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irlande (\"Google\").\nPour Firebase Analytics, Google utilise non seulement le \"ID d'instance\" décrit ci-dessus, mais aussi l'ID publicitaire de l'appareil final. Dans les paramètres de votre appareil mobile, vous pouvez limiter l'utilisation de l'ID publicitaire.\nPour Android : Paramètres > Google > Annonces > Réinitialiser identifiant publicitaire.\nPour iOS : Paramètres > Confidentialité > Publicité > Suivi publicitaire limité\nLes données issues de ce processus peuvent être transmises par Google à un serveur aux Etats-Unis pour évaluation et y être stockées. Dans le cas où des données personnelles sont transférées aux États-Unis, Google s est soumis au « Privacy Shield Framework » entre l'UE et les États-Unis.\nPour plus d'informations sur la protection de la vie privée sur Google et Firebase, visitez https://www.google.com/policies/privacy/ et https://firebase.google.com/support/privacy/\nLes données à caractère personnel ne seront conservées que pour la durée strictement nécessaire à la gestion de la relation client et prospect et ne dépassant pas la durée durant laquelle le Compte SOKKA du Bénéficiaire sera actif.\nARTICLE 7 : Cookies \nSOKKA recourt à l’usage de cookies dans le but de personnaliser les services proposés aux Utilisateurs.\nL’Utilisateur est informé que, lors de ses visites sur la Plateforme, un cookie peut être installé automatiquement sur son logiciel de navigation. Un cookie est un fichier, souvent anonyme, contenant des données, notamment un identifiant unique, transmis par le serveur de la Plateforme numérique au navigateur de l’Utilisateur et stocké sur son disque dur. Ces cookies permettent lors de chaque visite par un Utilisateur sur la Plateforme numérique, de réaliser des études statistiques globales sur l’audience de la Plateforme numérique, d’identifier le cas échéant l’Utilisateur, d’étudier le comportement des Utilisateurs au sein des différentes rubriques de la Plateforme numérique et ce, afin de personnaliser au mieux lesdits Sites et Services en terme d’organisation, d’affichage et de contenus, notamment de contenus publicitaires.\nLes cookies tiers utilisés sont les suivant : Google Analytics, Firebase. SOKKA n’a aucun accès et ne peut exercer aucun contrôle sur les cookies tiers. Cependant SOKKA accepte que les sociétés tiers autorisées traitent ces informations collectées dans le strict respect de la loi «Informatique et Libertés » du 6 janvier 1978 modifiée ou de la loi en vigueur. \nL’Utilisateur dispose toutefois de la possibilité de s’opposer à lutilisation des cookies en configurant son logiciel de navigation. Chaque logiciel de navigation étant différent, l’Utilisateur est invité à consulter la notice de son navigateur pour le paramétrer comme il le souhaite.\nEn tout état de cause, la Société se réserve le droit de mettre fin à cette autorisation à tout moment s’il lui paraît que le lien établi avec le Site est de nature à porter atteinte à ses intérêts, à sa réputation et/ou son image.\nARTICLE 8 : Liens hypertextes\nL’existence d’un lien hypertexte en provenance d’un site tiers vers le Site n’implique en aucun cas une coopération/partenariat entre le Site et ce site tiers. La Société n’exerce aucun contrôle sur les sites de tiers et n’engage par conséquent, aucune responsabilité quant aux contenus et aux produits et/ou services disponibles sur ou à partir de ces sites tiers comportant un lien hypertexte vers le Site.\nLe Site peut contenir des liens vers des sites de partenaires de la Société ou vers des sites de tiers autorisés par la Société. Tout autre lien hypertexte renvoyant vers des pages secondaires à la plateforme est formellement interdit, sauf autorisation expresse de SOKKA. La Société n’exerce aucun contrôle sur ces sites et n’assume par conséquent, aucune responsabilité quant à la disponibilité de ces sites, leur contenu et sur les produits et/ou services disponibles sur ou à partir de ces sites.\nLa Société ne sera aucunement responsable des dommages directs ou indirects pouvant survenir à l’occasion de l’accès de l’Utilisateur au site du partenaire et/ou du tiers et de l’utilisation des contenus et les produits et/ou services de ce site par l’Utilisateur.\n\nARTICLE 9 : Évolution des conditions générales d’utilisation\nLes présentes Conditions Générales constituent l’intégralité des documents contractuels faisant foi entre les Parties.\nLa Société se réserve le droit de modifier les clauses de ces conditions générales d’utilisation à tout moment et sans justification.\nARTICLE 10 : Durée du contrat\nLe présent contrat est conclu pour une durée indéterminée à compter de l’acceptation des Conditions Générales par l’Utilisateur.\nARTICLE 11 : Service clientèle\nPour toute question ou information concernant la plateforme et les Services, l’Utilisateur peut contacter la Société en lui adressant un courrier électronique à l’adresse suivante : « contact@sokka.app »\nARTICLE 12 : Droit applicable et juridiction compétente\n\nLe présent contrat dépend de la législation française.\nSi une partie quelconque des dispositions des présentes CGU devait savérer illégale, invalide ou inapplicable pour quelque raison que ce soit, le terme ou les termes en question seraient déclarés inexistants et les termes restants garderaient toute leur force et leur portée et continueraient à être applicables. Les termes déclarés inexistants seront remplacés par des termes qui se rapprocheront le plus quant à leur contenu de la clause annulée.\n\nLes CGU sont soumises à la loi française. Tout désaccord ou litige qui ne se règle pas par la voie amiable, dans un délai de 30 (trente) jours suivant la notification d’un conflit par lettre recommandée avec accusé de réception, sera soumis aux Tribunaux de Toulouse."

/**
 * Classe qui va permettre d'afficher les modes d'inscription, y compris les champs pour 
 * les mails et mdp.
 */
export default class Modes_incription extends React.Component {


    constructor(props) {
        super(props)
        this.state = {
            txt :'',
            phone: '',

            mail : ' ',
            mailErrorMsg : ' ',
            mdpErrorMsg : ' ',
            mailFormat: ' ',
            mdp : '',
            phone:'',
            mdp_confimation : '',
            inscriptionReussie : false,
            nextDisabled: true,
            checkMail: false,
            checkMdp: false,
            keyboardShown : false,
            fontsLoaded: false,
            dialogTermsVisible : false

        }
        this.mailAnimation = new Animated.ValueXY({ x: wp('-100%'), y:hp('-5%') })
        this.facebookAnimation =  new Animated.ValueXY({ x: wp('100%'), y:hp('0%') })
        this.txtOuAnimation = new Animated.ValueXY({ x: wp('0%'), y:hp('-2.5%') })


    }

    static navigationOptions = { title: '', header: null };

    async componentDidMount(){
        console.log("before loading")

        this._moveConnexionFacebook()
        this._moveConnexionMail()
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
        await Font.loadAsync({
            //font1 or 2 can be any name. This'll be used in font-family
            "montserrat-regular" :require("../../../assets/fonts/montserrat-regular.ttf"), 
            "montserrat-medium": require("../../../assets/fonts/montserrat-medium.ttf"),       
            "montserrat-light": require("../../../assets/fonts/montserrat-light.ttf"),       
            "montserrat-extrabold" :require("../../../assets/fonts/montserrat-extrabold.ttf"), 
                   
        });
        console.log("loaded")
        this.setState({fontsLoaded: true});
    }

    _hideDialog = () => this.setState({ dialogTermsVisible: false });


    /*componentDidMount() {
        this._moveConnexionFacebook()
        this._moveConnexionMail()
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
    }*/

    _keyboardDidShow () {
       // console.log("in keyboard didshow")
       //this.setState({keyboardShown : true})

      }
    
      _keyboardDidHide () {
      //  this.setState({keyboardShown : false})
    }
   
    /**
     * Fonction qui permet de déplacer le boutton se connecter via facebook
     */
    _moveConnexionFacebook = () => {
        Animated.spring(this.facebookAnimation, {
          toValue: {x: 0, y: hp('2%')},
        }).start()
    }

    /**
     * Fonction qui permet de déplacer le boutton se connecter via mail
     */
    _moveConnexionMail = () => {
        Animated.spring(this.mailAnimation, {
          toValue: {x: 0, y: hp('-5%')},
        }).start()
    }

   

    /* Pour recuperer l'email */
    mailTextInputChanged (text) {
        this.setState({
            mail : text
        })
    }

    /* Pour recuperer le mot de passe */
    passwordTextInputChanged (text) {
        this.setState({
            mdp : text
        })    
    }

    /* Verification du format du mail */
    checkMail () {
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
        if(reg.test(this.state.mail) === false)
        {
            this.setState({
                checkMail: false,
                mailFormat: erreurFormat
            })
        }
        else {
            this.setState({
                checkMail: true,
                mailFormat: ' '
            })
        }
    }

   /* Pour recuperer la confirmation du mot de passe */
   passwordConfirmationTextInputChanged () {
        if (!(this.state.mdp === this.state.mdp_confimation)) {
            this.setState({
                mdpErrorMsg : erreurMdpDiff,
                checkMdp : false
            })
        } else if (this.state.mdp.length < 6) {
            this.setState({
                mdpErrorMsg : erreurMdpTropCourt,
                checkMdp : false
            })
        } else {
            this.setState({
                mdpErrorMsg : ' ',
                checkMdp : true
            })
        }
    }

    /**
     * Fonction qui va permettre de poursuivre l'inscription (par email)
     * si les infos rentrées sont bonnes
     */
    callNextStep() {

        var db = Database.initialisation();

        if (this.state.mdp === this.state.mdp_confimation) {
            firebase.auth().createUserWithEmailAndPassword(this.state.mail, this.state.mdp)
            .then((userCred) => {
                userCred.user.delete();

                this.setState({
                    mailErrorMsg : ' ',
                    inscriptionReussie : true,
                })

                this.props.navigation.push(
                    "InscriptionCGU", {
                        mail : this.state.mail,
                        mdp : this.state.mdp
                })
            })
            .catch((error) => {            
                switch(error.code) {
                    case "auth/email-already-in-use": {this.setState({mailErrorMsg: 'Cette adresse email est déjà associée à un compte. Veuillez vous connecter avec votre mot de passe.'}); break;}
                    case "auth/invalid-email": {this.setState({mailErrorMsg: 'Adresse email incorrect...'}); break;}
                    case "auth/weak-password": {this.setState({mailErrorMsg: "Le mot de passe est trop facile à deviner. Essaie de le ralonger et d'ajouter des caractères spéciaux..."}); break;}
                    default : {this.setState({mailErrorMsg: "Cette adresse email et ce mot de passe ne conviennent pas"}); break;}
                }
            });
        }
    }
    


    
    displayTxtInsc() {
        return (
            <View>
                <Text>{this.state.mailErrorMsg}</Text>
                <Text>{this.state.mailFormat}</Text>
                <Text>{this.state.mdpErrorMsg}</Text>
            </View>
        )
    
    }


    //============================== TEST ======================
    
  

  formatText = (text) => {
    return text.replace(/[^+\d]/g, '');
  };
  //==================================
   
  renderBefore(){
    let { phone } = this.state;


        
        return (
            <View style = {styles.main_container}>

                {/* View contenant le text Agoora */}
                <View style = {styles.view_agoora}>
                    <Text style = {styles.txt}>SOKKA</Text>
                </View>

                {/* Image de l'herbre */}
                <View style = {styles.View_grass}>
                    <Image 
                        source = {require('app/res/grass.jpg')}
                        style = {styles.grass}
                    />

                </View>

                {/* View contenant les champs pour l'inscription via mail */}
                <Animated.View style={[this.mailAnimation.getLayout(), {width : wp('88%')}]}>
                    <View 
                        style = {styles.animatedConnexion}
                        >
                        
                        
                        
                        <TextInput 
                            style = {styles.txt_input}
                            placeholder = 'Adresse mail'
                            placeholderTextColor = '#CECECE'
                            keyboardType = 'email-address'
                            onChangeText ={(text) => this.mailTextInputChanged(text)} 
                            onEndEditing ={() => this.checkMail()}
                        />
                        
                        
                        <TextInput 
                            style = {styles.txt_input}
                            placeholder = 'Mot de passe'
                            placeholderTextColor = '#CECECE'
                            secureTextEntry ={true}
                            onChangeText ={(text) => this.passwordTextInputChanged(text)} 
                        />

                        <TextInput 
                            style = {styles.txt_input}
                            placeholder = 'Confirme ton mot de passe'
                            placeholderTextColor = '#CECECE'
                            secureTextEntry ={true}
                            onChangeText ={(text) => this.setState({mdp_confimation : text})}
                            onEndEditing={() => this.passwordConfirmationTextInputChanged()}
                        />

                        {this.displayTxtInsc()}

                        <TouchableOpacity style = {this.state.checkMdp && this.state.checkMail ? styles.btn_Connexion : {...styles.btn_Connexion, backgroundColor: '#6a818c'}}
                            disabled={!(this.state.checkMdp && this.state.checkMail)}
                            onPress = {() => this.callNextStep()}>
                            <Text style = {styles.txt_btn}>Suivant</Text>
                        </TouchableOpacity>
                    </View>


                </Animated.View>


                {/*View contenant le txt ou */}  
                <Animated.View style={this.txtOuAnimation.getLayout()}> 
                    <Text>ou</Text>
                </Animated.View>

                {/* View contenant le boutton se connecter via facebook 
                <Animated.View style={[this.facebookAnimation.getLayout(),{width : wp('77%')}]}>
                    <TouchableOpacity 
                        style = {styles.animatedFacebook}
                        >
                        <Image
                            source = {require('app/res/fb.png')}
                            style = {styles.fb}
                        />
                        <Text style = {styles.txt_btn}>Utilise Facebook</Text>
                    </TouchableOpacity>
                </Animated.View>*/}

            <TextField
        label='Phone number'
        value={phone}
        onChangeText={ (phone) => this.setState({ phone }) }
      />
            </View>

        )
    
  }

  

  showAlert() {
      if(this.state.dialogTermsVisible) {
          return(

            <View>
                 <TouchableOpacity 
                        onPress = {() => this.setState({dialogTermsVisible : false})}
                        style = {{zIndex : 10, alignSelf : "flex-end",marginTop : hp("6%"), marginEnd : wp("8.65%") }}>

                    <Image
                        source = {require("../../../res/white_cross.png")}
                        style = {{ width : 26, height : 26}}/>
                </TouchableOpacity>
              <View 
                style = {{height : hp('100%'), width : wp('100%'), position : "absolute" , zIndex : 5,backgroundColor : 'rgba(25, 28, 47, 0.75)', alignContent : "center", justifyContent : "center"}}>

               
                <View style = {{width : wp("82.7"), height : hp("70.9%"), backgroundColor : "white", alignSelf : "center", paddingHorizontal : wp("3.7%")}}>

                    <View style = {{marginBottom : hp("2.5%")}}>
                        <Text style = {{fontFamily : "montserrat-extrabold", fontSize : 26, zIndex : 2, marginTop : hp("3.4%")}}>{"CONDITIONS\nGÉNÉRALES"}</Text>

                        <Image 
                            source = {require("../../../res/condition_image.png")}
                            style = {{position : "absolute", width :wp("27.3%"),height : hp("9.9%"),alignSelf : "flex-end", resizeMode : "contain", marginTop : hp("1.5%")}}/>
                    </View>

                        <ScrollView>
                            <Text style = {{fontFamily : "montserrat-regular", fontSize : 10}}>
                                {CGU}
                            </Text>
                        </ScrollView>
                </View>

               
              </View>
              </View>

          )
      }
  }
  
  renderButton(){
    return(
        <TouchableOpacity
            style = {StylesHelpers.login_btn_container_style}
            disabled={!(this.state.checkMdp && this.state.checkMail)}
                            onPress = {() => this.callNextStep()}>

        <Text style = {StylesHelpers.login_btn_txt_style}>SUIVANT</Text>
        
        <Image
            source = {require("../../../res/right_arrow.png")}
            style = {{width : 25, height : 17, marginStart : wp("2.7%"), alignSelf : "center"}}
            />
    </TouchableOpacity>

    )
    
}



renderTerms() {
    return(
        <Text style = {{fontFamily :"montserrat-regular", fontSize : 10, marginTop : hp("3%") }}>En vous inscrivant, vous acceptez nos 
            <Text 
            onPress = {() => this.setState({dialogTermsVisible : true})}
            style = {{fontFamily : "montserrat-bold"}}> Conditions générales</Text>.  
            Découvrez comment nous recueillons, utilisons et partageons vos données en lisant notre Politique d’utilisation des données et comment nous utilisons les cookies et autres technologies similaires en consultant notre Politique d’utilisation des cookies.</Text>
    )
}



renderMainFrame() {
    if(this.state.fontsLoaded) {
        return( 
            <View style = {{flex : 1}}>
            
                <Back_arrow
                    navigation = {this.props.navigation}/>

                    <HideWithKeyboard>
                    <LoginTopComponent/>
                    </HideWithKeyboard>
                        
                    <Text style = {StylesHelpers.login_title_style}>INSCRIPTION</Text>

                <KeyboardAvoidingView behavior="padding" style={StylesHelpers.form_container_style}>
            
                    <View style = {{flex :1}}>
                            <Fumi
                                label={'Adresse email'}
                                labelStyle={{ color: StylesHelpers.inputLabel}}
                                inputStyle={{ color: 'black',fontFamily : "montserrat-light" }}
                                keyboardType = 'email-address'
                                iconClass={FontAwesomeIcon}
                                iconName={'envelope'}
                                iconColor={'black'}
                                iconSize={15}
                                onChangeText ={(text) => this.mailTextInputChanged(text)} 
                                onEndEditing ={() => this.checkMail()}
                                height = {StylesHelpers.input_height}
                                style = {[StylesHelpers.first_input_style,StylesHelpers.input_style]}
                            />

                            <Fumi
                                style={StylesHelpers.input_style}
                                label={'Téléphone'}
                                labelStyle={{ color: StylesHelpers.inputLabel}}
                                inputStyle={{ color: 'black' }}
                                iconClass={FontAwesomeIcon}
                                height = {StylesHelpers.input_height}
                                iconName={'phone'}
                                iconColor={'black'}
                                onChangeText ={(text) => {
                                    this.setState({phone : text})
                                }}
                            />

                            <Fumi
                                style={[StylesHelpers.last_input_style, StylesHelpers.input_style]}
                                label={'Mot de passe'}
                                iconClass={FontAwesomeIcon}
                                labelStyle={{ color: StylesHelpers.inputLabel}}
                                inputStyle={{ color: 'black',fontFamily : "montserrat-light" }}
                                iconName={'unlock'}
                                iconColor={'black'}
                                secureTextEntry={true}
                                height = {StylesHelpers.input_height}
                                onChangeText ={(text) => {
                                    this.passwordTextInputChanged(text)
                                    this.setState({mdp_confimation : text})
                                }} 
                            />
                         
                               {this.renderTerms()}


                            {this.displayTxtInsc()} 
                            
            
                    </View>
                    
                </KeyboardAvoidingView>
                
            
        </View>
        )
        } else {
            return(
                <View>

                </View>
            )
        }
    }


    renderSideFrame(){
        return(
            <View style  = {{width : 200}}/>
        )
    }
    render() {
        if(this.state.fontsLoaded)
        {
            return (
           
                <View>
                    <Sokka_Main_Component
                        main_frame = {this.renderMainFrame()}
                        topBarHidden = {false}
                        button = {this.renderButton()}
                        side_frame = {this.renderSideFrame()}
                        backgroundColor = {StylesHelpers.mainGray} />   
                    {this.showAlert()}
                </View>
               
            );
        } else {
            return(
                <View>
                    <Text>Loading</Text>
                </View>
            )
        }
        
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: StylesHelpers.mainGray,
      borderBottomEndRadius :StylesHelpers.mainRadius
    },
    header: {
    },
    description: {
      fontSize: 14,
      color: 'white',
    },
    input: {
        marginTop: 2,
      },
    legal: {
      margin: 10,
      color: '#333',
      fontSize: 12,
      textAlign: 'center',
    },
    form: {
      flex: 1,
      paddingHorizontal : 14,
      justifyContent: 'center',
    },
  });
  
/*const styles = StyleSheet.create({
    container: {
        backgroundColor: '#4c69a5',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      },

    main_container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    grass : {
        width : wp('100%'),
        height : wp('22%')
    },

    View_grass : {
        backgroundColor : 'white',
        alignItems : 'center',
        position : 'absolute',
        bottom : 0,
        right : 0,
        paddingTop : hp('2%')

        
    },

    view_agoora : {
        borderWidth : 1,
        position : 'absolute',
        top : hp('3%'),
        paddingTop : hp('2%'),
        paddingBottom : hp('2%'),
        width : wp('75%'),
        alignSelf : 'center',
        alignItems : 'center',
        borderRadius : 10,
        
    },

    txt : {
        fontSize : RF(3.5),
        fontWeight : 'bold'
    },

    txt_btn : {
        fontSize : RF(2.7),
        color : 'white',
        fontWeight : 'bold'
    },

    txt_input : {
        fontSize: RF(2.5),
        //backgroundColor:'#F0F0F0',
        width : wp('77%'),
        //paddingTop : wp('3%'),
        marginBottom : hp('3%'),
        //paddingBottom : wp('3%'),
        paddingLeft : wp('2%'),
        borderBottomWidth : 1


    },

    animatedConnexion: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 10,
        //paddingLeft : wp('15%'),
        //paddingRight : wp('15%'),
        paddingTop : wp('3%'),
        paddingBottom : wp('3%'),
        //borderWidth : 1
    },

    btn_Connexion : {
        backgroundColor: '#52C3F7',
        width : wp('77%'),
        paddingTop : wp('4%'),
        paddingBottom : wp('4%'),
        paddingLeft : wp('2%'),
        borderRadius : 20,
        alignItems : 'center',
        shadowColor: 'rgba(0,0,0, .4)', // IOS
        shadowOffset: { height: 1, width: 1 }, // IOS
        shadowOpacity: 1, // IOS
        shadowRadius: 1, //IOS
        elevation: 5, // Android

    },

    animatedFacebook : {
        display: 'flex',
        flexDirection : 'row',
        backgroundColor : '#4167B2',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        //paddingLeft : wp('15%'),
        //paddingRight : wp('15%'),
        paddingTop : wp('3%'),
        paddingBottom : wp('3%'),
        shadowColor: 'rgba(0,0,0, .4)', // IOS
        shadowOffset: { height: 1, width: 1 }, // IOS
        shadowOpacity: 1, // IOS
        shadowRadius: 1, //IOS
        elevation: 5, // Android
    },
    
    fb : {
        width : wp('8%'),
        height : wp('8%'),
        marginRight : wp('10%')
    },
   
      input: {
        marginTop: 2,
      },
}*/
