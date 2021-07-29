import { includeCustomTheming } from "nativeg";

const theme = {
  dark: {
    primary: "#A80874",
    onPrimary: "#ffffff",
    secondary: "#7C90DB",
    onSecondary: "#ffffff",
    surface: "#CFD2CD",
    onSurface: "#000000",
    background: "#222831",
    onBackground: "#ffffff",
    error: "#EE6352",
    onError: "#ffffff",
    info: "#08B2E3",
    onInfo: "#ffffff",
    succes: "#ACE4AA",
    onSucces: "#000000",
  },
};

export const { ThemingProvider } = includeCustomTheming(theme, "dark");
