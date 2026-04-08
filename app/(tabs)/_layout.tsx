import UIIcon from "@/components/ui/UIIcon";
import { Tabs } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "react-native-paper";
import AppHeader from "../../components/AppHeader";
import { spacing } from "../../constants/theme";

export default function TabLayout() {
  const theme = useTheme();

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <AppHeader />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: theme.colors.background,
            borderTopWidth: 0,
            elevation: 0,
            marginBottom: spacing.sm,
          },
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.colors.onBackground,
          sceneStyle: {
            backgroundColor: theme.colors.background,
          },
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
            title: "Zoo",
            tabBarIcon: ({ color, size }) => (
              <UIIcon name="pets" color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="camera"
          options={{
            title: "Camera",
            tabBarIcon: ({ color, size }) => (
              <UIIcon name="camera-alt" color={color} size={size} />
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
});
