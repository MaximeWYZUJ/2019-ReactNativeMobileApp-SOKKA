


export default class NormalizeString {

    static normalize(s) {

        s = s.replace(/é/g, "e");
        s = s.replace(/è/g, "e");
        s = s.replace(/ê/g, "e");
        s = s.replace(/ë/g, "e");
        s = s.replace(/ï/g, "i");
        s = s.replace(/î/g, "i");
        s = s.replace(/à/g, "a");
        s = s.replace(/â/g, "a");
        s = s.replace(/ä/g, "a");
        s = s.replace(/û/g, "u");
        s = s.replace(/ù/g, "u");
        s = s.replace(/ü/g, "u");
        s = s.replace(/ô/g, "o");
        s = s.replace(/ö/g, "o");
        
        s = s.replace(/Ë/g, "E");
        s = s.replace(/Ê/g, "E");
        s = s.replace(/Ï/g, "I");
        s = s.replace(/Î/g, "I");
        s = s.replace(/Â/g, "A");
        s = s.replace(/Ä/g, "A");
        s = s.replace(/Û/g, "U");
        s = s.replace(/Ü/g, "U");
        s = s.replace(/Ô/g, "O");
        s = s.replace(/Ö/g, "O");

        s = s.replace(/-/g, " ");

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