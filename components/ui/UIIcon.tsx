import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Text } from "react-native-paper";
import { spacing } from "../../constants/theme";

export interface UIIconProps extends React.ComponentProps<
  typeof MaterialIcons
> {
  name: React.ComponentProps<typeof MaterialIcons>["name"];
  emoji?: string;
}

export default function UIIcon({
  size = spacing.xl,
  name,
  emoji,
  children,
  ...props
}: UIIconProps) {
  if (emoji)
    return <Text style={{ fontSize: size, color: props.color }}>{emoji}</Text>;
  return <MaterialIcons name={name} size={size} {...props} />;
}
