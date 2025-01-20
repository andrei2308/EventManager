import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2", // Primary Blue
    },
    secondary: {
      main: "#ff9800", // Secondary Orange
    },
    background: {
      default: "#e3f2fd", // Light Blue for the entire background
      paper: "#ffffff", // White for cards and modals
    },
    text: {
      primary: "#333333", // Dark Gray Text
      secondary: "#757575", // Gray Text
    },
  },
  typography: {
    fontFamily: `'Roboto', 'Arial', sans-serif`,
    h1: { fontSize: "2rem", fontWeight: 700 },
    h2: { fontSize: "1.5rem", fontWeight: 600 },
    body1: { fontSize: "1rem", color: "#333333" },
    body2: { fontSize: "0.875rem", color: "#757575" },
  },
});

export default theme;
