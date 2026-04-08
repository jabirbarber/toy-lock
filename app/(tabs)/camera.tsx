import UIButton from "@/components/ui/UIButton";
import UIText from "@/components/ui/UIText";
import { createAudioPlayer, preload } from "expo-audio";
import { CameraView, useCameraPermissions } from "expo-camera";
import React, { useRef } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { spacing } from "../../constants/theme";

const SHUTTER_SRC = require("../../assets/sounds/shutter.mp3");
preload(SHUTTER_SRC);
const shutterPlayer = createAudioPlayer(SHUTTER_SRC);

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

  if (!permission) return <View style={styles.container} />;

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <UIText style={styles.message}>Camera permission is required.</UIText>
        <UIButton onPress={requestPermission}>Grant Permission</UIButton>
      </View>
    );
  }

  const handleCapture = () => {
    shutterPlayer.seekTo(0);
    shutterPlayer.play();
  };

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing="front"
        pictureSize="640x480"
      />
      <View style={styles.controls}>
        <Pressable
          style={({ pressed }) => [
            styles.captureButton,
            pressed && styles.captureButtonPressed,
          ]}
          onPressIn={handleCapture}
        >
          <View style={styles.captureButtonInner} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  camera: {
    flex: 1,
    width: "100%",
  },
  controls: {
    position: "absolute",
    bottom: spacing.xxl,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  captureButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 4,
    borderColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  captureButtonPressed: {
    opacity: 0.7,
  },
  captureButtonInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#fff",
  },
  message: {
    marginBottom: spacing.md,
    textAlign: "center",
  },
});
