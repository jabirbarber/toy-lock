import React from "react";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";
import { Text } from "react-native-paper";
import { spacing } from "../../constants/theme";

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
  return <Text variant="bodySmall">{children}</Text>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: spacing.md,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.md,
  },
  cardPressed: {
    backgroundColor: "rgba(255,255,255,0.6)",
  },
});
