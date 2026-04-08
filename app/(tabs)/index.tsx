import UIDialpad from "@/components/ui/UIDialpad";
import React from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "react-native-paper";

export default function PhoneScreen() {
  const theme = useTheme();
  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <UIDialpad
        onChange={(digit) => console.log("Pressed digit:", digit)}
        onSubmit={(value) => console.log("Submit:", value)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
