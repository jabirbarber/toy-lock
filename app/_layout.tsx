import theme from "@/constants/theme";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PaperProvider } from "react-native-paper";
import { KioskProvider } from "../contexts/KioskContext";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider theme={theme}>
        <KioskProvider>
          <Stack screenOptions={{ headerShown: false }} />
        </KioskProvider>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}
