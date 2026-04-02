import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Text } from "react-native-paper";
import { Colors, spacing } from "../../constants/theme";

export interface UIIconProps extends React.ComponentProps<
  typeof MaterialIcons
> {
  name: React.ComponentProps<typeof MaterialIcons>["name"];
  emoji?: string;
}

export default function UIIcon({
  color = Colors.text,
  size = spacing.xl,
  name,
  emoji,
  children,
  ...props
}: UIIconProps) {
  if (emoji) return <Text style={{ fontSize: size }}>{emoji}</Text>;
  return <MaterialIcons name={name} color={color} size={size} {...props} />;
}
