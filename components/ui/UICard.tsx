import React from "react";
import {
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from "react-native";
import { useTheme } from "react-native-paper";
import { spacing } from "../../constants/theme";

interface UICardProps extends Omit<PressableProps, "style"> {
  color?: "default" | "tertiary";
  style?: StyleProp<ViewStyle>;
}

export default function UICard({
  onPress,
  style,
  children,
  color = "tertiary",
  ...props
}: UICardProps) {
  const theme = useTheme();
  return (
    <Pressable
      onPress={onPress}
      {...props}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor:
            color === "tertiary"
              ? theme.colors.onTertiaryContainer
              : "rgba(255,255,255,0.2)",
        },
        pressed && {
          backgroundColor: theme.colors.primary,
        },
        ...(Array.isArray(style) ? style : [style]),
      ]}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: spacing.md,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.md,
  },
});
