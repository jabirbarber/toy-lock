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
import { Text } from "react-native-paper";
import UIButtonIcon from "../components/UIButtonIcon";
import { spacing } from "../constants/theme";

export default function KioskScreen() {
  const [isLocked, setIsLocked] = useState(false);

  // Enter kiosk mode on launch if not already active
  useEffect(() => {
    const initKiosk = async () => {
      const enabled = await checkIfKioskEnabled();
      if (!enabled) {
        startKioskMode();
        disableExitByUnpinning();
      }
      setIsLocked(true);
    };
    initKiosk();
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

      <View style={styles.header}>
        <View style={styles.titleCtr}>
          <UIButtonIcon
            icon={isLocked ? "🔒" : "🔓"}
            onPress={isLocked ? exitKioskMode : enterKioskMode}
          />
          <Text variant="headlineLarge" style={styles.title}>
            {isLocked ? "Toy Active" : "Toy Mode"}
          </Text>
        </View>
        <Text variant="bodyLarge" style={styles.subtitle}>
          {isLocked
            ? "Tap the lock to exit toy mode."
            : "Tap the lock to enter toy mode and\ndisable system navigation."}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.xl,
  },
  header: {
    alignItems: "center",
    paddingTop: spacing.xxxl,
    gap: spacing.sm,
  },
  unlockedBg: {
    backgroundColor: "#0f172a",
  },
  lockedBg: {
    backgroundColor: "#1e1b4b",
  },
  titleCtr: {
    flexDirection: "row",
    alignItems: "center",
    //gap: spacing.sm,
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
    marginBottom: spacing.sm,
  },
});
