import React from "react";
import { Pressable, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { spacing } from "../constants/theme";

interface UIButtonIconProps extends React.ComponentProps<typeof Pressable> {
  icon: string;
  size?: number;
}

export default function UIButtonIcon({
  icon,
  size = spacing.xxl,
  ...props
}: UIButtonIconProps) {
  return (
    <Pressable style={styles.container} {...props}>
      <Text style={{ fontSize: size }}>{icon}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
  },
});
