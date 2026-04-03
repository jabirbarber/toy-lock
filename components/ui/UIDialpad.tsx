import { windowWidth } from "@/constants/device";
import { createAudioPlayer, preload } from "expo-audio";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { Colors, spacing } from "../../constants/theme";

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
    const nextCount = submitCount + 1;
    setSubmitCount(nextCount);
    const nextState = Math.abs(nextCount) % 2 === 1 ? "Calling" : "Idle";
    if (nextState === "Calling") {
      RINGTONE.seekTo(0);
      RINGTONE.play();
    } else {
      RINGTONE.pause();
    }
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
            onPressIn={() => handleChange(digit, tone)}
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
          onPressIn={() => handleChange("", undefined, true)}
          onLongPress={() => setValue("")}
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
    color: Colors.textMuted,
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

const RINGTONE = createAudioPlayer(require("../../assets/sounds/ringtone.wav"));

const TONE_SOURCES = {
  "1": require("../../assets/sounds/dtmf_1.wav"),
  "2": require("../../assets/sounds/dtmf_2.wav"),
  "3": require("../../assets/sounds/dtmf_3.wav"),
  "4": require("../../assets/sounds/dtmf_4.wav"),
  "5": require("../../assets/sounds/dtmf_5.wav"),
  "6": require("../../assets/sounds/dtmf_6.wav"),
  "7": require("../../assets/sounds/dtmf_7.wav"),
  "8": require("../../assets/sounds/dtmf_8.wav"),
  "9": require("../../assets/sounds/dtmf_9.wav"),
  star: require("../../assets/sounds/dtmf_star.wav"),
  "0": require("../../assets/sounds/dtmf_0.wav"),
  hash: require("../../assets/sounds/dtmf_hash.wav"),
};
Object.values(TONE_SOURCES).forEach((src) => preload(src));

const KEYS = [
  {
    digit: "1",
    letters: "",
    tone: createAudioPlayer(TONE_SOURCES["1"]),
  },
  {
    digit: "2",
    letters: "",
    tone: createAudioPlayer(TONE_SOURCES["2"]),
  },
  {
    digit: "3",
    letters: "",
    tone: createAudioPlayer(TONE_SOURCES["3"]),
  },
  {
    digit: "4",
    letters: "",
    tone: createAudioPlayer(TONE_SOURCES["4"]),
  },
  {
    digit: "5",
    letters: "",
    tone: createAudioPlayer(TONE_SOURCES["5"]),
  },
  {
    digit: "6",
    letters: "",
    tone: createAudioPlayer(TONE_SOURCES["6"]),
  },
  {
    digit: "7",
    letters: "",
    tone: createAudioPlayer(TONE_SOURCES["7"]),
  },
  {
    digit: "8",
    letters: "",
    tone: createAudioPlayer(TONE_SOURCES["8"]),
  },
  {
    digit: "9",
    letters: "",
    tone: createAudioPlayer(TONE_SOURCES["9"]),
  },
  {
    digit: "*",
    letters: "",
    tone: createAudioPlayer(TONE_SOURCES["star"]),
  },
  {
    digit: "0",
    letters: "",
    tone: createAudioPlayer(TONE_SOURCES["0"]),
  },
  {
    digit: "#",
    letters: "",
    tone: createAudioPlayer(TONE_SOURCES["hash"]),
  },
];
