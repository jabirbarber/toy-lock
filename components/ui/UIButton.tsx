import { Button, ButtonProps } from "react-native-paper";

export default function UIButton({
  mode = "contained",
  ...props
}: ButtonProps) {
  return <Button mode={mode} {...props} />;
}
