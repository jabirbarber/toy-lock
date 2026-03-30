import React from "react";
import { Pressable, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { spacing } from "../constants/theme";

type UIButtonIconProps = {
  icon: string;
  size?: number;
  onPress: () => void;
};

export default function UIButtonIcon({
  icon,
  size = spacing.xxl,
  onPress,
}: UIButtonIconProps) {
  return (
    <Pressable onPress={onPress} style={styles.container}>
      <Text style={{ fontSize: size }}>{icon}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
  },
});
