import { MD3LightTheme } from "react-native-paper";

export default {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,

    primary: "rgb(157, 22, 185)",
    onPrimary: "rgb(255, 255, 255)",
    primaryContainer: "rgb(254, 214, 255)",
    onPrimaryContainer: "rgb(53, 0, 65)",

    secondary: "rgb(158, 64, 61)",
    onSecondary: "rgb(255, 255, 255)",
    secondaryContainer: "rgb(255, 218, 215)",
    onSecondaryContainer: "rgb(65, 0, 4)",

    tertiary: "rgb(0, 98, 157)",
    onTertiary: "rgb(255, 255, 255)",
    tertiaryContainer: "rgb(207, 229, 255)",
    onTertiaryContainer: "rgb(0, 29, 51)",

    background: "#261f32",
    onBackground: "#fbfafb",
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
} as const;
