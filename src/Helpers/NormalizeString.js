


export default class NormalizeString {

    static normalize(s) {
        console.log(s);

        s.replace("é", "e");
        s.replace("è", "e");
        s.replace("ê", "e");
        s.replace("ë", "e");
        s.replace("ï", "i");
        s.replace("î", "i");
        s.replace("à", "a");
        s.replace("â", "a");
        s.replace("ä", "a");
        s.replace("û", "u");
        s.replace("ù", "u");
        s.replace("ü", "u");
        s.replace("ô", "o");
        s.replace("ö", "o");
        
        s.replace("Ê", "E");
        s.replace("Ê", "E");
        s.replace("Ï", "I");
        s.replace("Î", "I");
        s.replace("Â", "A");
        s.replace("Ä", "A");
        s.replace("Û", "U");
        s.replace("Ü", "U");
        s.replace("Ô", "O");
        s.replace("Ö", "O");

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