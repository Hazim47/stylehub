import { createTheme } from "@mui/material/styles";


const theme = createTheme({

    palette: {

        primary: {
            main: "#111111",
        },


        secondary: {
            main: "#d4af37",
        },


        background:{
            default:"#ffffff"
        }

    },


    typography: {

        fontFamily:
        "Arial, sans-serif"

    }

});


export default theme;