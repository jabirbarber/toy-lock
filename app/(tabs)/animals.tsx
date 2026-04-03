import UICard, { UICardLabel } from "@/components/ui/UICard";
import { windowWidth } from "@/constants/device";
import { createAudioPlayer, preload } from "expo-audio";
import React from "react";
import { FlatList, StyleSheet, Text } from "react-native";
import { spacing } from "../../constants/theme";

const CARD_GAP = spacing.sm;
const CARD_SIZE = (windowWidth - spacing.md * 2 - CARD_GAP * 2) / 3;

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

const ANIMALS: Animal[] = [
  {
    name: "Tiger",
    emoji: "🐅",
    sound: createAudioPlayer(SOUND_SOURCES.tiger),
  },
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

function AnimalCard({ item }: { item: Animal }) {
  const handlePress = () => {
    item.sound.seekTo(0);
    item.sound.play();
  };

  return (
    <UICard pressable onPress={handlePress} style={styles.card}>
      <Text style={styles.emoji}>{item.emoji}</Text>
      <UICardLabel>{item.name}</UICardLabel>
    </UICard>
  );
}

export default function AnimalsScreen() {
  return (
    <FlatList
      data={ANIMALS}
      keyExtractor={(item) => item.name}
      numColumns={2}
      contentContainerStyle={styles.list}
      columnWrapperStyle={styles.row}
      renderItem={({ item }) => <AnimalCard item={item} />}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    padding: spacing.md,
    gap: CARD_GAP,
    backgroundColor: "#0b6259",
    flexGrow: 1,
  },
  row: {
    gap: CARD_GAP,
  },
  card: {
    width: windowWidth / 2 - spacing.md - CARD_GAP / 2,
    height: CARD_SIZE,
  },
  emoji: {
    fontSize: 60,
  },
});
