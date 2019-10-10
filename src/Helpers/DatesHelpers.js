export default class DatesHelpers {



    /**
     * Fonction qui va permettre de construire un String correspondant à la 
     * date au format :   JJ/MM/AAAA
     * @param {Date} date 
     */
    static buildDate(date) {
        console.log("************ " + date+ " *******" )
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

        console.log("in build date string")
        var j = date.getDay()
        console.log('j',j)
        var numJour = date.getDate()
        console.log('numJour',numJour)
        var mois  =(date.getMonth() + 1).toString()
        if(mois.length == 1) {
            mois = '0' + mois 
        }
        console.log('mois',mois)
        var an  = date.getFullYear()
        var heure = date.getHours()

        var minute = (date.getMinutes()).toString()
        if(minute.length == 1) {
            minute = '0' + minute 
        }
        var heureFin = this.calculHeureFin(heure,minute,duree)

        return DAY[j] + ' ' + numJour  + '/' + mois + '/' + an + ' - ' +  heure + 'h' +minute + ' à ' + heureFin
    }


    
    static calculHeureFin(heure,minutes, duree){
        console.log("in calcul heure de fin")

        var heure = parseInt(heure) + Math.trunc(duree)
        console.log("heure",heure)
        var minutes =    parseInt(minutes) +  (duree -Math.trunc(duree)) * 60
        if(minutes >= 60) {
            heure ++
            minutes -= 60
        }
        console.log("minutes",minutes)
        if(minutes.toString().length == 1) {
            minutes = '0'+ minutes.toString()
        }
        console.log("before return")
        return heure + 'h' + minutes
    }

    static calculAge(dateNaissance) {
        var now = new Date()
        console.log("now.getFullYear()",now.getFullYear())
        console.log("dateNaissance.getFullYear()",dateNaissance.getFullYear())
        var age = now.getFullYear() - dateNaissance.getFullYear()
        console.log("AGE ABSOLU ", age)
        if(now.getMonth() == dateNaissance.getMonth()) {
            if(now.getDate() < dateNaissance.getDate() ) {
                age = age - 1
            }
        } else if(now.getMonth() < dateNaissance.getMonth()){
            age = age - 1
        }
        return age
    }
}