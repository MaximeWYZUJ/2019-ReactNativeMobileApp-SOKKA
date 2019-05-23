export default class Distance {

    /**
     * Fonction qui permet de calculer la distance entre deux points en km
     * @param {float} lat_a 
     * @param {float} long_a 
     * @param {float} lat_b 
     * @param {float} lon_b 
     */
    static calculDistance(lat_a,long_a,lat_b, lon_b) {
        let rad_lata = (lat_a * Math.PI)/180;
        let rad_long = ((long_a- lon_b) * Math.PI)/180;
        let rad_latb = (lat_b * Math.PI)/180;

        let d = Math.acos(Math.sin(rad_lata)*Math.sin(rad_latb)+
        Math.cos(rad_lata)*Math.cos(rad_latb)*Math.cos(rad_long))*6371
        return d;
    }

     
}