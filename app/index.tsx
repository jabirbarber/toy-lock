import {
  checkIfKioskEnabled,
  disableExitByUnpinning,
  exitKioskMode as kioskExit,
  onRecentButtonPressed,
  startKioskMode,
} from "expo-kiosk-control";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  AppState,
  AppStateStatus,
  BackHandler,
  StyleSheet,
  View,
} from "react-native";
import { Button, Text } from "react-native-paper";

export default function KioskScreen() {
  const [isLocked, setIsLocked] = useState(false);

  // Keep state in sync if kiosk is exited externally
  useEffect(() => {
    const syncState = async () => {
      const enabled = await checkIfKioskEnabled();
      setIsLocked(enabled);
    };
    syncState();
  }, []);

  // Block hardware back button while locked
  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      () => isLocked,
    );
    return () => subscription.remove();
  }, [isLocked]);

  // Handle recent-apps button press while in kiosk mode
  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      (_state: AppStateStatus) => {
        if (isLocked) {
          onRecentButtonPressed();
        }
      },
    );
    return () => subscription.remove();
  }, [isLocked]);

  const enterKioskMode = async () => {
    startKioskMode();
    disableExitByUnpinning();
    setIsLocked(true);
  };

  const exitKioskMode = async () => {
    kioskExit();
    setIsLocked(false);
  };

  return (
    <View
      style={[styles.container, isLocked ? styles.lockedBg : styles.unlockedBg]}
    >
      <StatusBar hidden={isLocked} style="light" />

      {/* Lock icon */}
      <View style={styles.iconContainer}>
        <Text style={styles.lockIcon}>{isLocked ? "🔒" : "🔓"}</Text>
      </View>

      {/* Title */}
      <Text variant="headlineLarge" style={styles.title}>
        {isLocked ? "Device Locked" : "Kiosk Control"}
      </Text>

      {/* Sub-label */}
      <Text variant="bodyLarge" style={styles.subtitle}>
        {isLocked
          ? "Kiosk mode is active.\nPress Unlock to exit."
          : "Press Lock to enter kiosk mode and\ndisable system navigation."}
      </Text>

      {/* Action button */}
      {isLocked ? (
        <Button
          mode="contained"
          onPress={exitKioskMode}
          style={styles.button}
          contentStyle={styles.buttonContent}
          labelStyle={styles.buttonLabel}
          buttonColor="#22c55e"
          textColor="#ffffff"
        >
          Unlock
        </Button>
      ) : (
        <Button
          mode="contained"
          onPress={enterKioskMode}
          style={styles.button}
          contentStyle={styles.buttonContent}
          labelStyle={styles.buttonLabel}
          buttonColor="#ef4444"
          textColor="#ffffff"
        >
          Lock
        </Button>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    paddingHorizontal: 32,
  },
  unlockedBg: {
    backgroundColor: "#0f172a",
  },
  lockedBg: {
    backgroundColor: "#1e1b4b",
  },
  iconContainer: {
    marginBottom: 8,
  },
  lockIcon: {
    fontSize: 72,
  },
  title: {
    color: "#f8fafc",
    fontWeight: "700",
    textAlign: "center",
  },
  subtitle: {
    color: "#94a3b8",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 8,
  },
  button: {
    marginTop: 16,
    borderRadius: 12,
    minWidth: 220,
    elevation: 4,
  },
  buttonContent: {
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  buttonLabel: {
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 1,
  },
});
