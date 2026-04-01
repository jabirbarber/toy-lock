import { Stack } from "expo-router";
import { MD3DarkTheme, PaperProvider } from "react-native-paper";
import { KioskProvider } from "../contexts/KioskContext";

export default function RootLayout() {
  return (
    <PaperProvider theme={MD3DarkTheme}>
      <KioskProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </KioskProvider>
    </PaperProvider>
  );
}
