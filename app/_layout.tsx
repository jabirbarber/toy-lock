import theme from "@/constants/theme";
import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";
import { KioskProvider } from "../contexts/KioskContext";

export default function RootLayout() {
  return (
    <PaperProvider theme={theme}>
      <KioskProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </KioskProvider>
    </PaperProvider>
  );
}
