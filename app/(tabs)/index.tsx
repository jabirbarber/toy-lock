import UIDialpad from "@/components/ui/UIDialpad";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Colors } from "../../constants/theme";

export default function PhoneScreen() {
  return (
    <View style={styles.container}>
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
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
});
