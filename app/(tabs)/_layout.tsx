import UIIcon from "@/components/ui/UIIcon";
import { Tabs } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";
import AppHeader from "../../components/AppHeader";
import { Colors, spacing } from "../../constants/theme";
import { useKiosk } from "../../contexts/KioskContext";

export default function TabLayout() {
  const { isLocked } = useKiosk();
  const bgColor = isLocked ? Colors.background : Colors.backgroundMuted;

  return (
    <View
      style={[styles.container, isLocked ? styles.lockedBg : styles.unlockedBg]}
    >
      <AppHeader />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: bgColor,
            borderTopWidth: 0,
            elevation: 0,
            marginBottom: spacing.sm,
          },
          tabBarActiveTintColor: Colors.tint,
          tabBarInactiveTintColor: Colors.textMuted,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Phone",
            tabBarIcon: ({ color, size }) => (
              <UIIcon name="call" color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="animals"
          options={{
            title: "Animals",
            tabBarIcon: ({ color, size }) => (
              <UIIcon name="pets" color={color} size={size} />
            ),
          }}
        />
      </Tabs>
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
});
