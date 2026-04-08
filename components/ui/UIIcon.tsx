import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { spacing } from "../../constants/theme";
import UIText from "./UIText";

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
    return (
      <UIText style={{ fontSize: size, color: props.color }}>{emoji}</UIText>
    );
  return <MaterialIcons name={name} size={size} {...props} />;
}
