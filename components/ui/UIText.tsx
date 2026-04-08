import React from "react";
import { Text, TextProps, useTheme } from "react-native-paper";

export default function UIText({ style, ...props }: TextProps<string>) {
  const theme = useTheme();
  return <Text style={[{ color: theme.colors.onPrimary }, style]} {...props} />;
}
