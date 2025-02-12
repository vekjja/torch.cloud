// src/theme.ts
import { createTheme } from "@mui/material/styles";

export default createTheme({
  colorSchemes: {
    dark: true,
  },
  palette: {
    mode: "dark",
    primary: {
      main: "#ff640a",
    },
    secondary: {
      main: "#414141",
    },
    info: {
      main: "#bbbbbb",
    },
    success: {
      main: "#58ffb4",
    },
    error: {
      main: "#ff3561",
    },
  },
});
