import React from "react";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";
import { Text } from "react-native-paper";
import { Colors, spacing } from "../../constants/theme";

type UICardProps = {
  pressable?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
  children: React.ReactNode;
};

export default function UICard({
  pressable = false,
  onPress,
  style,
  children,
}: UICardProps) {
  if (pressable) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.card,
          pressed && styles.cardPressed,
          style,
        ]}
      >
        {children}
      </Pressable>
    );
  }
  return <View style={[styles.card, style]}>{children}</View>;
}

export function UICardLabel({ children }: { children: React.ReactNode }) {
  return <Text style={styles.label}>{children}</Text>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: spacing.md,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.md,
  },
  cardPressed: {
    backgroundColor: "rgba(255,255,255,0.6)",
  },
  label: {
    color: Colors.text,
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.5,
    marginTop: spacing.xs,
  },
});
