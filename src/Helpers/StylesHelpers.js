import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export default class StylesHelpers {


    static mainRadius = 30
    static sideBarWidth = "3%"
    static mainFrameWidth = "97s%"

    static nav_arrow_style = {
        postion : "absolute",
        width : 24,
        height : 24,
    }


    // ======================== LOGIN ===============================

    static login_title_style = {
        fontFamily : "montserrat-extrabold",
        fontSize : 40,
        marginVertical : hp("3.7"),
        alignSelf : "center"
        
    }

    static form_container_style = {
        flex: 1,
        flexDirection : "column",
        paddingHorizontal : wp('5%'),
        justifyContent: 'space-between',

        
    }

    static first_input_style = {
        borderTopLeftRadius : 20, 
        borderTopRightRadius : 20
    }
    static input_style = {
        fontFamily : "montserrat-light",
        fontSize : 11,
        height : hp("2%"),
        marginBottom : 2
    }

    static input_height = hp("7%")

    static login_btn_txt_style = {
        fontFamily : "montserrat-bold",
        color : "white",
        fontSize : 15,
        alignSelf : "center"
    }

    static login_btn_container_style = {
        flexDirection : "row", 
        paddingStart : wp("5.3%"), 
        paddingEnd : wp('8.2%'), 
        paddingVertical : hp("1.9%")
    }


    static last_input_style = {
        borderBottomEndRadius : 20,
         borderBottomStartRadius : 20
    }

    static clickable_text_style = {
        fontFamily : "montserrat-bold" 

    }



    // ============================ COLORS =======================
    static mainGray = "#F6F5F5"
    static mainRed = "#FF0000"
    static inputLabel = "#CCCCCC"

    
}
