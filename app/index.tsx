import UIDialpad from "@/components/UIDialpad";
import {
  checkIfKioskEnabled,
  disableExitByUnpinning,
  exitKioskMode,
  startKioskMode,
} from "expo-kiosk-control";
import { StatusBar } from "expo-status-bar";
import * as Updates from "expo-updates";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import UIButtonIcon from "../components/UIButtonIcon";
import { Colors, spacing } from "../constants/theme";

export default function KioskScreen() {
  const [isLocked, setIsLocked] = useState(false);
  const [showVersion, setShowVersion] = useState(false);

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

  const enterKioskMode = async () => {
    startKioskMode();
    disableExitByUnpinning();
    setIsLocked(true);
  };

  const disableKioskMode = async () => {
    exitKioskMode();
    setIsLocked(false);
  };

  return (
    <View
      style={[styles.container, isLocked ? styles.lockedBg : styles.unlockedBg]}
    >
      <StatusBar hidden={isLocked} style="light" />
      <View style={styles.header}>
        <UIButtonIcon
          icon={isLocked ? "🔒" : "🔓"}
          onLongPress={isLocked ? disableKioskMode : enterKioskMode}
        />
        <View style={styles.titleCtr}>
          <Text variant="headlineLarge" style={styles.title}>
            {isLocked ? "Lock Active" : "Unlocked"}
          </Text>
          <Text
            variant="bodyLarge"
            style={styles.subtitle}
            onPress={() => setShowVersion(!showVersion)}
          >
            {showVersion
              ? `Update: ${Updates.updateId?.slice(0, 8)}`
              : isLocked
                ? "Hold the lock to exit toy mode."
                : "Hold the lock to enter toy mode."}
          </Text>
        </View>
      </View>
      <View style={styles.body}>
        <UIDialpad
          onChange={(digit) => console.log("Pressed digit:", digit)}
          onSubmit={() => console.log("Submit")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  unlockedBg: {
    backgroundColor: Colors.backgroundMuted,
  },
  lockedBg: {
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: spacing.xxl, // should use safe area insets here
  },
  titleCtr: {
    justifyContent: "flex-start",
  },
  title: {
    color: Colors.text,
    paddingTop: spacing.xs,
    fontWeight: "700",
  },
  subtitle: {
    color: Colors.textSubtle,
    lineHeight: 24,
  },
  body: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: spacing.xxxl,
  },
});
