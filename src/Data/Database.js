import firebase from 'firebase'
import '@firebase/firestore'
import LocalUser from './LocalUser.json'

export default class Database {

    static config = {
        apiKey: "AIzaSyCwFc_A3KZlTgfLJC9PWVR1o99MbGHZXNw",
        authDomain: "agoora-ccf6c.firebaseapp.com",
        databaseURL: "https://agoora-ccf6c.firebaseio.com",
        projectId: "agoora-ccf6c",
        storageBucket: "agoora-ccf6c.appspot.com",
        messagingSenderId: "486777683016"
    };

    
    static config2 = {
        apiKey: "AIzaSyDtl0_2Zx18V5m3SwtJVAbXkMbsvMruFsI",
        authDomain: "sokka-47c20.firebaseapp.com",
        databaseURL: "https://sokka-47c20.firebaseio.com",
        projectId: "sokka-47c20",
        storageBucket: "sokka-47c20.appspot.com",
        messagingSenderId: "952597067241",
        appId: "1:952597067241:web:1f1b5c742caabbb0"
      };
    
    static initialisation() {
        var config = {
            apiKey: "AIzaSyCwFc_A3KZlTgfLJC9PWVR1o99MbGHZXNw",
            authDomain: "agoora-ccf6c.firebaseapp.com",
            databaseURL: "https://agoora-ccf6c.firebaseio.com",
            projectId: "agoora-ccf6c",
            storageBucket: "agoora-ccf6c.appspot.com",
            messagingSenderId: "486777683016"
        };

        /*var config2 =  {
            apiKey: "AIzaSyDtl0_2Zx18V5m3SwtJVAbXkMbsvMruFsI",
            authDomain: "sokka-47c20.firebaseapp.com",
            databaseURL: "https://sokka-47c20.firebaseio.com",
            projectId: "sokka-47c20",
            storageBucket: "sokka-47c20.appspot.com",
            messagingSenderId: "952597067241",
            appId: "1:952597067241:web:1f1b5c742caabbb0"
          };*/

        if (!firebase.apps.length) {
            firebase.initializeApp(config);
        };
        var db = firebase.firestore();
        return db;
    }


    /**
     * Methode qui permet de recuperer un doc d'une collection.
     * Renvoie le resultat au format {id, data, ref}
     * 
     * string collection : collection dont fait partie le doc
     * string idDoc : id du document dont on veut la subcollection
     */
    static async getDocument(collectionString, documentId) {
        db = Database.initialisation();
        docRef = db.collection(collectionString).doc(documentId);
        docRef.get().then((doc) => {
            return {id: documentId, data: doc.data(), ref: docRef}
        })
    }



    /**
     * Méthode qui permet de récupérer tous les docs réels d'une collection
     * d'un doc dont on a la ref. (doc réel = doc pointé par une référence,
     * c'est à dire que la fonction renvoie le doc pointé plutot que sa ref)
     * Renvoie un tableau d'elements au format {id, data, ref}
     * 
     * string collection : collection dont on veut les docs
     * ref document : document qui contient la collection
     * string champ : champ du doc qui fait ref au doc réel
     */
    static async getCollection(docRef, collectionString, champ) {
        tab = []
        collectionOfRef = await docRef.collection(collectionString).get();

        for (item of collectionOfRef.docs) {
            refTrueDoc = item.data().champ
            refTrueDoc.get().then((trueDoc) => {
                tab.push({id: refTrueDoc.id, data: trueDoc.data(), ref: trueDoc})
            })
        }

        return tab // attendre la fin de la boucle for avant...
    }






    /**
     * Méthode qui permet de récupérer les données d'une équipe depuis firebase
     * @param {*} id 
     */
    static getEquipeWithId(id, callback) {
        var db = this.initialisation();
        var docRef = db.collection('Equipes').doc(id);

        docRef.get().then(function(doc) {
            if (doc.exists) {
               // console.log(doc.data())
                callback(doc.data())
                //return doc.data();  
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
                //return "No such doc"
            }
        }).catch(function(error) {
            console.log("Error getting document:", error);
            //return "erreur"
        });

        callback()
        

    }

    /**
     * Fonction permettant d'enregister un utilisateur dans le cloud firestore
     * à partir de son identifiant.
     * @param {string} id 
     * @param {object} user 
     */
    static storeUser(id, user) {

        /* Initialisation de la base de données. */
        var db = this.initialisation()

        /* Enregistrer l'utilisateur dans la base de données. */
        db.collection("Joueurs").doc(id).set({
            age : user.age,
            equipes : user.equipes,
            id : user.id,
            equipesFavorites : user.equipesFavorites,
            fiabilite : user.fiabilite,
            mail :user.mail,
            naissance : user.naissance,
            nom : user.nom,
            photo : user.photo,
            reseau : user.reseau,
            telephone : user.telephone,
            terrains : user.terrains,
            zone : user.zone

            }).then(function() {
            console.log("Document successfully written!");
            console.log(id)
        }).catch(function(error) {
            console.error("Error writing document: ", error);
        });
    }


    static async addDocToCollection(obj, id, collection) {
        var db = this.initialisation();
        console.log(obj.id);

        db.collection(collection).doc(id).set(obj)
        .then((docRef) => {return docRef;})
    }


    static async getDocumentData(id, collection) {
        console.log("in get doc data")
        var db = Database.initialisation();
        let docRef = db.collection(collection).doc(id);
        console.log("before docRef.get()")
        let doc = await docRef.get();
        
        if (doc.exists) {
            return doc.data()
        } else {
            console.log("No such document!", id);
        }
    }


    static async getArrayDocumentData(arrayId, collection) {
        db = Database.initialisation();
        let array = [];

        for (id of arrayId) {
            let data = await this.getDocumentData(id, collection);
            array.push(data);
        }

        return array;
    }


    static isUser(idProfilJoueur) {
        if (LocalUser.exists) {
            let b = idProfilJoueur === LocalUser.data.id;
            return b;
        }
        console.log("PROBLEME : LocalUser doesn't exist")
        return false;
    }



    // ------------------------------------------------------
    // ---------- Methodes pour ajouter une ID --------------
    // ---------------- à un tableau d'ID -------------------
    // ------------------------------------------------------

    // ----- LIKES -----
    static async changeSelfToOtherArray_Aiment(otherId, otherCollection, boolAdd) {
        if (LocalUser.exists) {
            db = Database.initialisation();

            selfId = LocalUser.data.id;

            if (boolAdd) { // on s'ajoute aux likes de other
                db.collection(otherCollection).doc(otherId).update({
                    aiment : firebase.firestore.FieldValue.arrayUnion(selfId)
                })
            } else { // on se retire des likes de other
                db.collection(otherCollection).doc(otherId).update({
                    aiment : firebase.firestore.FieldValue.arrayRemove(selfId)
                })
            }
        }
    }
    

    // ----- RESEAU -----
    static async changeOtherIdToSelfArray_Reseau(otherId, boolAdd) {
        if (LocalUser.exists) {
            db = Database.initialisation();

            selfId = LocalUser.data.id;

            if (boolAdd) { // on ajoute other à nos likes
                // Add in database
                db.collection("Joueurs").doc(selfId).update({
                    reseau : firebase.firestore.FieldValue.arrayUnion(otherId)
                })
                // Add in local user
                if (!LocalUser.data.reseau.some(elmt => elmt === otherId)) {
                    LocalUser.data.reseau.push(otherId);
                }
            } else { // on retire other de nos likes
                // Remove in database
                db.collection("Joueurs").doc(selfId).update({
                    reseau : firebase.firestore.FieldValue.arrayRemove(otherId)
                })
                // Remove in local user
                LocalUser.data.reseau = LocalUser.data.reseau.filter((val, index, arr) => {return (!(val === otherId))})
            }
        }
    }


    // ----- EQUIPES FAV -----
    static async changeOtherIdToSelfArray_EquipesFav(otherId, boolAdd) {
        if (LocalUser.exists) {
            db = Database.initialisation();

            selfId = LocalUser.data.id;

            if (boolAdd) { // on ajoute other à nos equipes fav
                // Add in database
                db.collection("Joueurs").doc(selfId).update({
                    equipesFav : firebase.firestore.FieldValue.arrayUnion(otherId)
                })
                // Add in local user
                if (!LocalUser.data.equipesFav.some(elmt => elmt === otherId)) {
                    LocalUser.data.equipesFav.push(otherId);
                }
            } else { // on retire other de nos equipes fav
                // Remove in database
                db.collection("Joueurs").doc(selfId).update({
                    equipesFav : firebase.firestore.FieldValue.arrayRemove(otherId)
                })
                // Remove in local user
                LocalUser.data.equipesFav = LocalUser.data.equipesFav.filter((val, index, arr) => {return (!(val === otherId))})
            }
        }
    }


    // ----- TERRAINS FAV -----
    static async changeOtherIdToSelfArray_TerrainsFav(otherId, boolAdd) {
        if (LocalUser.exists) {
            db = Database.initialisation();

            selfId = LocalUser.data.id;

            if (boolAdd) { // on ajoute other à nos likes
                // Add in database
                db.collection("Joueurs").doc(selfId).update({
                    terrains : firebase.firestore.FieldValue.arrayUnion(otherId)
                })
                // Add in local user
                if (!LocalUser.data.terrains.some(elmt => elmt === otherId)) {
                    LocalUser.data.terrains.push(otherId);
                }
            } else { // on retire other de nos likes
                // Remove in database
                db.collection("Joueurs").doc(selfId).update({
                    terrains : firebase.firestore.FieldValue.arrayRemove(otherId)
                })
                // Remove in local user
                LocalUser.data.terrains = LocalUser.data.terrains.filter((val, index, arr) => {return (!(val === otherId))})
            }
        }
    }


     /**
     * Fonction qui va permettre d'uploader la photo de profil dans le storage
     * firebase.
     * 
     * uri : uri de la photo de profil
     * imageName : Nom à donner au fichier sur le storage
     */
    static uploadImageFinal = async (uri, imageName,isEquipe) => {
        var dossier = "Photos_profil_Joueurs"
        if(isEquipe) {
            dossier = "Photos_Profil_Equipes"
        }
        const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function() {
              resolve(xhr.response);
            };
            xhr.onerror = function() {
              reject(new TypeError('Network request failed'));
            };
            xhr.responseType = 'blob';
            xhr.open('GET', uri, true);
            xhr.send(null);
        });
        var r = Math.random(500)
        var ref = firebase.storage().ref().child(dossier +"/tests/" + imageName+r);
        await ref.put(blob);
        var url = await ref.getDownloadURL()
        return url
    }

}