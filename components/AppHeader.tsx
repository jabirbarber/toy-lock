import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors, spacing } from "../constants/theme";
import { useKiosk } from "../contexts/KioskContext";
import UIButtonIcon from "./ui/UIButtonIcon";

function getUpdateId(): string {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const Updates = require("expo-updates");
    const id = Updates.updateId;
    return id ? `Update: ${id.slice(0, 8)}` : "Embedded";
  } catch {
    return "Dev Build";
  }
}

export default function AppHeader() {
  const { isLocked, enterKioskMode, disableKioskMode } = useKiosk();
  const [showVersion, setShowVersion] = useState(false);
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
      <StatusBar hidden={isLocked} style="light" />
      <UIButtonIcon
        emoji={isLocked ? "🔒" : "🔓"}
        onLongPress={isLocked ? disableKioskMode : enterKioskMode}
      />
      <View style={styles.titleCtr}>
        <Text variant="headlineSmall" style={styles.title}>
          {isLocked ? "Lock Active" : "Unlocked"}
        </Text>
        <Text
          variant="bodySmall"
          style={styles.subtitle}
          onPress={() => setShowVersion((v) => !v)}
        >
          {showVersion
            ? getUpdateId()
            : isLocked
              ? "Hold the lock to exit toy mode."
              : "Hold the lock to enter toy mode."}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: spacing.sm,
  },
  titleCtr: {
    justifyContent: "flex-start",
  },
  title: {
    color: Colors.text,
    fontWeight: "700",
  },
  subtitle: {
    color: Colors.textMuted,
  },
});
