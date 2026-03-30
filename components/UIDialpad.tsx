import { windowWidth } from "@/constants/device";
import React, { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { Colors, spacing } from "../constants/theme";

type UIDialpadProps = {
  initialValue?: string;
  hasDisplay?: boolean;
  onChange?: (value: string) => void;
  onSubmit: (value: string) => void;
};

const KEYS = [
  { digit: "1", letters: "" },
  { digit: "2", letters: "" },
  { digit: "3", letters: "" },
  { digit: "4", letters: "" },
  { digit: "5", letters: "" },
  { digit: "6", letters: "" },
  { digit: "7", letters: "" },
  { digit: "8", letters: "" },
  { digit: "9", letters: "" },
  { digit: "*", letters: "" },
  { digit: "0", letters: "" },
  { digit: "#", letters: "" },
];

export default function UIDialpad({
  initialValue = "",
  hasDisplay = true,
  onChange,
  onSubmit,
}: UIDialpadProps) {
  const [value, setValue] = useState(initialValue);

  const handleChange = (digit: string) => {
    const next = value + digit;
    setValue(next);
    onChange?.(next);
  };

  const handleDelete = () => {
    const next = value.slice(0, -1);
    setValue(next);
    onChange?.(next);
  };

  const handleSubmit = () => {
    onSubmit(value);
  };
  return (
    <View style={styles.container}>
      {/* Number display */}
      {hasDisplay && (
        <View style={styles.display}>
          <Text style={styles.displayText}>{value}</Text>
        </View>
      )}
      {/* Number grid */}
      <View style={styles.grid}>
        {KEYS.map(({ digit, letters }) => (
          <Pressable
            key={digit}
            style={({ pressed }) => [styles.key, pressed && styles.keyPressed]}
            onPress={() => handleChange(digit)}
          >
            <Text style={styles.digit}>{digit}</Text>
            {letters ? <Text style={styles.letters}>{letters}</Text> : null}
          </Pressable>
        ))}
      </View>
      <View style={styles.bottomRow}>
        <View style={styles.bottomCell} />

        <Pressable
          style={({ pressed }) => [
            styles.callButton,
            pressed && styles.callButtonPressed,
          ]}
          onPress={handleSubmit}
        >
          <Text style={styles.callIcon}>📞</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.bottomCell,
            styles.deleteButton,
            pressed && styles.deleteButtonPressed,
          ]}
          onPress={handleDelete}
        >
          <Text style={styles.deleteIcon}>⌫</Text>
        </Pressable>
      </View>
    </View>
  );
}

const KEY_WIDTH = windowWidth / 3 - spacing.sm * 2;
const KEY_HEIGHT = windowWidth / 5;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: spacing.md,
  },
  display: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.15)",
    minHeight: 56,
  },
  displayText: {
    color: Colors.dark.text,
    fontSize: 36,
    fontWeight: "300",
    letterSpacing: 6,
    includeFontPadding: false,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    columnGap: spacing.sm,
    rowGap: spacing.sm,
  },
  key: {
    width: KEY_WIDTH,
    height: KEY_HEIGHT,
    borderRadius: KEY_HEIGHT / 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.07)",
  },
  keyPressed: {
    backgroundColor: "rgba(255,255,255,0.18)",
  },
  digit: {
    color: Colors.dark.text,
    fontSize: 32,
    fontWeight: "300",
    includeFontPadding: false,
  },
  letters: {
    color: Colors.dark.textSubtle,
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 2,
    marginTop: -2,
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: KEY_HEIGHT * 3 + spacing.xl * 2,
  },
  bottomCell: {
    width: KEY_HEIGHT,
    height: KEY_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  callButton: {
    width: KEY_WIDTH,
    height: KEY_HEIGHT,
    borderRadius: KEY_HEIGHT / 2,
    backgroundColor: "#22c55e",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: spacing.xl,
  },
  callButtonPressed: {
    backgroundColor: "#16a34a",
  },
  callIcon: {
    fontSize: 28,
  },
  deleteButton: {
    borderRadius: KEY_HEIGHT,
  },
  deleteButtonPressed: {
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  deleteIcon: {
    color: Colors.dark.text,
    fontSize: 24,
  },
});
