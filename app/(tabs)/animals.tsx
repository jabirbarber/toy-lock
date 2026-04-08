import UICard from "@/components/ui/UICard";
import UIText from "@/components/ui/UIText";
import { windowWidth } from "@/constants/device";
import { createAudioPlayer, preload } from "expo-audio";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "react-native-paper";
import { spacing } from "../../constants/theme";

const ROWS = 5;
const COLS = 2;
const PADDING = spacing.md;
const CARD_GAP = spacing.sm;
const CARD_WIDTH = (windowWidth - PADDING * 2 - CARD_GAP * (COLS - 1)) / COLS;

type Animal = {
  name: string;
  emoji: string;
  sound: ReturnType<typeof createAudioPlayer>;
};

const SOUND_SOURCES: Record<string, number> = {
  cat: require("../../assets/sounds/animal_cat.wav"),
  dog: require("../../assets/sounds/animal_dog.wav"),
  duck: require("../../assets/sounds/animal_duck.mp3"),
  elephant: require("../../assets/sounds/animal_elephant.mp3"),
  frog: require("../../assets/sounds/animal_frog.mp3"),
  monkey: require("../../assets/sounds/animal_monkey.mp3"),
  lion: require("../../assets/sounds/animal_lion.mp3"),
  bird: require("../../assets/sounds/animal_bird.mp3"),
  tiger: require("../../assets/sounds/animal_tiger.mp3"),
  flamingo: require("../../assets/sounds/animal_flamingo.mp3"),
};

Object.values(SOUND_SOURCES).forEach((src) => preload(src));

let currentPlayer: ReturnType<typeof createAudioPlayer> | null = null;

const ANIMALS: Animal[] = [
  { name: "Tiger", emoji: "🐅", sound: createAudioPlayer(SOUND_SOURCES.tiger) },
  {
    name: "Elephant",
    emoji: "🐘",
    sound: createAudioPlayer(SOUND_SOURCES.elephant),
  },
  {
    name: "Monkey",
    emoji: "🐒",
    sound: createAudioPlayer(SOUND_SOURCES.monkey),
  },
  {
    name: "Flamingo",
    emoji: "🦩",
    sound: createAudioPlayer(SOUND_SOURCES.flamingo),
  },
  { name: "Frog", emoji: "🐸", sound: createAudioPlayer(SOUND_SOURCES.frog) },
  { name: "Duck", emoji: "🦆", sound: createAudioPlayer(SOUND_SOURCES.duck) },
  { name: "Cat", emoji: "🐱", sound: createAudioPlayer(SOUND_SOURCES.cat) },
  { name: "Dog", emoji: "🐶", sound: createAudioPlayer(SOUND_SOURCES.dog) },
  { name: "Bird", emoji: "🐦", sound: createAudioPlayer(SOUND_SOURCES.bird) },
  { name: "Lion", emoji: "🦁", sound: createAudioPlayer(SOUND_SOURCES.lion) },
];

function AnimalCard({
  item,
  cardHeight,
}: {
  item: Animal;
  cardHeight: number;
}) {
  const theme = useTheme();
  const handlePress = () => {
    if (currentPlayer && currentPlayer !== item.sound) {
      currentPlayer.pause();
    }
    currentPlayer = item.sound;
    item.sound.seekTo(0);
    item.sound.play();
  };

  return (
    <UICard
      onPress={handlePress}
      style={{ width: CARD_WIDTH, height: cardHeight }}
    >
      <UIText style={styles.emoji}>{item.emoji}</UIText>
      <UIText
        variant="bodySmall"
        style={{
          marginTop: spacing.sm,
          fontWeight: "bold",
          color: theme.colors.tertiaryContainer,
        }}
      >
        {item.name}
      </UIText>
    </UICard>
  );
}

export default function AnimalsScreen() {
  const theme = useTheme();
  const [containerHeight, setContainerHeight] = useState(0);

  const cardHeight =
    containerHeight > 0
      ? (containerHeight - PADDING * 2 - CARD_GAP * (ROWS - 1)) / ROWS
      : 0;

  const rows: Animal[][] = [];
  for (let i = 0; i < ROWS; i++) {
    rows.push(ANIMALS.slice(i * COLS, i * COLS + COLS));
  }

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.tertiary }]}
      onLayout={(e) => setContainerHeight(e.nativeEvent.layout.height)}
    >
      {containerHeight > 0 &&
        rows.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((animal) => (
              <AnimalCard
                key={animal.name}
                item={animal}
                cardHeight={cardHeight}
              />
            ))}
          </View>
        ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: PADDING,
    gap: CARD_GAP,
  },
  row: {
    flexDirection: "row",
    gap: CARD_GAP,
  },
  emoji: {
    fontSize: 50,
  },
});
