import { createMuiTheme } from "@material-ui/core/styles";

// Create a theme instance.
const theme = createMuiTheme({
  palette: {
    secondary: {
      light: "#fa5455",
      main: "#890004",
      dark: "#c1162c",
    },
    primary: {
      light: "#2c2c2c",
      main: "#3a3a3a",
      dark: "#000000",
    },
  },
  //  typography: {
  //    button: {
  //      textTransform: "none",
  //    },
  //  },
});

export default theme;
