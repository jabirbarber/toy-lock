import React from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { Colors } from "../../constants/theme";

export default function AnimalsScreen() {
  return (
    <View style={styles.container}>
      <Text variant="headlineLarge" style={styles.text}>
        Animals
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: Colors.text,
  },
});
