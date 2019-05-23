


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

}