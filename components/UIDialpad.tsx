import { windowWidth } from "@/constants/device";
import { createAudioPlayer } from "expo-audio";
import * as Haptics from "expo-haptics";
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

export default function UIDialpad({
  initialValue = "",
  hasDisplay = true,
  onChange,
  onSubmit,
}: UIDialpadProps) {
  const [value, setValue] = useState(initialValue);
  const [submitCount, setSubmitCount] = useState(0);

  const pressFeedback = (tone?: ReturnType<typeof createAudioPlayer>) => {
    if (tone) {
      tone.seekTo(0);
      tone.play();
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  };

  const handleChange = (
    digit: string,
    tone?: ReturnType<typeof createAudioPlayer>,
    isDelete = false,
  ) => {
    pressFeedback(isDelete ? undefined : tone);
    const next = isDelete ? value.slice(0, -1) : value + digit;
    setValue(next);
    onChange?.(next);
  };

  const handleSubmit = () => {
    pressFeedback(KEYS[0].tone);
    setSubmitCount(submitCount + 1);
    onSubmit(value);
  };

  const callState = Math.abs(submitCount) % 2 === 1 ? "Calling" : "Idle";

  return (
    <View style={styles.container}>
      {hasDisplay && (
        <View style={styles.display}>
          <Text
            style={styles.displayText}
            numberOfLines={1}
            ellipsizeMode="head"
          >
            {value}
          </Text>
        </View>
      )}
      <View style={styles.grid}>
        {KEYS.map(({ digit, letters, tone }) => (
          <Pressable
            key={digit}
            style={({ pressed }) => [styles.key, pressed && styles.keyPressed]}
            onPress={() => handleChange(digit, tone)}
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
            {
              backgroundColor:
                callState === "Calling" ? Colors.error : Colors.success,
            },
            pressed && {
              backgroundColor:
                callState === "Calling"
                  ? Colors.errorMuted
                  : Colors.successMuted,
            },
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
          onPress={() => handleChange("", undefined, true)}
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
    padding: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.15)",
    minHeight: 56,
    overflow: "hidden",
  },
  displayText: {
    color: Colors.text,
    fontSize: 36,
    fontWeight: "300",
    letterSpacing: 6,
    includeFontPadding: false,
    textAlign: "center",
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
    color: Colors.text,
    fontSize: 32,
    fontWeight: "300",
    includeFontPadding: false,
  },
  letters: {
    color: Colors.textSubtle,
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
    paddingTop: spacing.lg,
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
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: spacing.xl,
  },
  callIcon: {
    fontSize: 28,
    color: Colors.tint,
  },
  deleteButton: {
    borderRadius: KEY_HEIGHT,
  },
  deleteButtonPressed: {
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  deleteIcon: {
    fontSize: 24,
  },
});

const KEYS = [
  {
    digit: "1",
    letters: "",
    tone: createAudioPlayer(require("../assets/sounds/dtmf_1.wav")),
  },
  {
    digit: "2",
    letters: "",
    tone: createAudioPlayer(require("../assets/sounds/dtmf_2.wav")),
  },
  {
    digit: "3",
    letters: "",
    tone: createAudioPlayer(require("../assets/sounds/dtmf_3.wav")),
  },
  {
    digit: "4",
    letters: "",
    tone: createAudioPlayer(require("../assets/sounds/dtmf_4.wav")),
  },
  {
    digit: "5",
    letters: "",
    tone: createAudioPlayer(require("../assets/sounds/dtmf_5.wav")),
  },
  {
    digit: "6",
    letters: "",
    tone: createAudioPlayer(require("../assets/sounds/dtmf_6.wav")),
  },
  {
    digit: "7",
    letters: "",
    tone: createAudioPlayer(require("../assets/sounds/dtmf_7.wav")),
  },
  {
    digit: "8",
    letters: "",
    tone: createAudioPlayer(require("../assets/sounds/dtmf_8.wav")),
  },
  {
    digit: "9",
    letters: "",
    tone: createAudioPlayer(require("../assets/sounds/dtmf_9.wav")),
  },
  {
    digit: "*",
    letters: "",
    tone: createAudioPlayer(require("../assets/sounds/dtmf_star.wav")),
  },
  {
    digit: "0",
    letters: "",
    tone: createAudioPlayer(require("../assets/sounds/dtmf_0.wav")),
  },
  {
    digit: "#",
    letters: "",
    tone: createAudioPlayer(require("../assets/sounds/dtmf_hash.wav")),
  },
];
