export default class DatesHelpers {



    /**
     * Fonction qui va permettre de construire un String correspondant à la 
     * date au format :   JJ/MM/AAAA
     * @param {Date} date 
     */
    static buildDate(date) {
        //var j = date.getDay()
        var numJour = date.getDate()
        var mois  =(date.getMonth() + 1).toString()
        if(mois.length == 1) {
            mois = '0' + mois 
        }
        var an  = date.getFullYear()
        return numJour  + '/' + mois + '/' + an
    }


    static buildDateString(date,duree) {
        DAY = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']

        var j = date.getDay()
        var numJour = date.getDate()
        var mois  =(date.getMonth() + 1).toString()
        if(mois.length == 1) {
            mois = '0' + mois 
        }
        var an  = date.getFullYear()
        var heure = date.getHours()

        var minute = (date.getMinutes()).toString()
        if(minute.length == 1) {
            minute = '0' + minute 
        }
        var heureFin = this.calculHeureFin(heure,minute,duree)

        return DAY[j] + ' ' + numJour  + '/' + mois + '/' + an + ' - ' +  heure + 'h' +minute + ' à ' + heureFin
    }


    static buildDateNotif(date) {
        var j = date.getDay()
        var numJour = date.getDate()
        var mois  =(date.getMonth() + 1).toString()
        if(mois.length == 1) {
            mois = '0' + mois 
        }
        var an  = date.getFullYear()
        var heure = date.getHours()

        var minute = (date.getMinutes()).toString()
        if(minute.length == 1) {
            minute = '0' + minute 
        }

        return numJour  + '/' + mois + '/' + an + ' - ' +  heure + ':' +minute
    }


    
    static calculHeureFin(heure,minutes, duree){

        var heure = parseInt(heure) + Math.trunc(duree)
        var minutes =    parseInt(minutes) +  (duree -Math.trunc(duree)) * 60
        if(minutes >= 60) {
            heure ++
            minutes -= 60
        } if(heure >=24) {
            heure = heure - 24
        }

        if(heure.toString().length == 1) {
            heure = "0" + heure.toString()
        }
        if(minutes.toString().length == 1) {
            minutes = '0'+ minutes.toString()
        }
        return heure + 'h' + minutes
    }

    static calculAge(dateNaissance) {
        var now = new Date()
        var age = now.getFullYear() - dateNaissance.getFullYear()
        if(now.getMonth() == dateNaissance.getMonth()) {
            if(now.getDate() < dateNaissance.getDate() ) {
                age = age - 1
            }
        } else if(now.getMonth() < dateNaissance.getMonth()){
            age = age - 1
        }
        return age
    }

    static buildDateWithTimeZone(date) {
        var tzDifference = date.getTimezoneOffset();
        return new Date(date.getTime() - tzDifference * 60 * 1000);
    }


    static isMatchEnded(jour, duree) {
        console.log("**************************")
        console.log("duree",duree)
        console.log("NOW", this.buildDateWithTimeZone(new Date()))
        console.log("jour, ", jour)
        console.log(this.buildDateWithTimeZone(new Date()) - jour)
        console.log("is ended ",((this.buildDateWithTimeZone(new Date()) - jour) > duree * 3600000))
        console.log("**************************")

        return ((this.buildDateWithTimeZone(new Date()) - jour) > duree * 3600000) // Converti duree en ms 
    }
}