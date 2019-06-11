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
}