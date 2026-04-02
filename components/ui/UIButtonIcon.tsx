import UIIcon, { UIIconProps } from "@/components/ui/UIIcon";
import React from "react";
import { Pressable, StyleSheet } from "react-native";
import { spacing } from "../../constants/theme";

interface UIButtonIconProps extends React.ComponentProps<typeof Pressable> {
  name?: UIIconProps["name"];
  emoji?: UIIconProps["emoji"];
  size?: UIIconProps["size"];
}

export default function UIButtonIcon({
  name,
  emoji,
  size = spacing.xl,
  ...props
}: UIButtonIconProps) {
  return (
    <Pressable style={styles.container} {...props}>
      <UIIcon name={name || "question-mark"} size={size} emoji={emoji} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
  },
});
