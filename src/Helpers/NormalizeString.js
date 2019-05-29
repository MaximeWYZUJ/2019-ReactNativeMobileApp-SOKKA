


export default class NormalizeString {

    static normalize(s) {

        s = s.replace("é", "e");
        s = s.replace("è", "e");
        s = s.replace("ê", "e");
        s = s.replace("ë", "e");
        s = s.replace("ï", "i");
        s = s.replace("î", "i");
        s = s.replace("à", "a");
        s = s.replace("â", "a");
        s = s.replace("ä", "a");
        s = s.replace("û", "u");
        s = s.replace("ù", "u");
        s = s.replace("ü", "u");
        s = s.replace("ô", "o");
        s = s.replace("ö", "o");
        
        s = s.replace("Ê", "E");
        s = s.replace("Ê", "E");
        s = s.replace("Ï", "I");
        s = s.replace("Î", "I");
        s = s.replace("Â", "A");
        s = s.replace("Ä", "A");
        s = s.replace("Û", "U");
        s = s.replace("Ü", "U");
        s = s.replace("Ô", "O");
        s = s.replace("Ö", "O");

        return s.toLowerCase();
    }

    
    static decompose(s) {

        s = this.normalize(s);

        t = this.decomposeFirsts(s);
        let tab = s.split(' ');

        for (elmt of tab) {
            tab_interm = this.decomposeFirsts(elmt);
            for (e of tab_interm) {
                t.push(e);
            }
        }

        if (tab.length > 2) {
            for (var i=0; i<tab.length-1; i++) {
                s_paire = tab[i] + ' ' + tab[i+1];
                tab_interm = this.decomposeFirsts(s_paire);
                for (e of tab_interm) {
                    t.push(e);
                }
            }
        }

        return t;
    }


    // Renvoie un tableau des premiers substrings de s
    static decomposeFirsts(s) {
        let tab = [];
        for (var i=1; i <= s.length; i++) {
            tab.push(s.substring(0, i));
        }
        return tab;
    }

}