import UIIcon, { UIIconProps } from "@/components/ui/UIIcon";
import { windowWidth } from "@/constants/device";
import { spacing } from "@/constants/theme";
import React from "react";
import { Animated, Pressable, StyleSheet, View } from "react-native";
import { useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type {
  NavigationState,
  SceneRendererProps,
} from "react-native-tab-view";

const TAB_HEIGHT = 120;
const ICON_SIZE = 24;
const PILL_PADDING = spacing.sm;
const PILL_SIZE = ICON_SIZE + PILL_PADDING * 2;

export type TabRoute = {
  key: string;
  title: string;
  icon: UIIconProps["name"];
};

type Props = SceneRendererProps & {
  navigationState: NavigationState<TabRoute>;
};

export default function TabBar({ navigationState, position, jumpTo }: Props) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const tabCount = navigationState.routes.length;
  const tabWidth = windowWidth / tabCount;

  const translateX = position.interpolate({
    inputRange: navigationState.routes.map((_, i) => i),
    outputRange: navigationState.routes.map(
      (_, i) => i * tabWidth + tabWidth / 2 - PILL_SIZE / 2,
    ),
  });

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.background,
          paddingBottom: insets.bottom,
        },
      ]}
    >
      <Animated.View
        style={[
          styles.indicator,
          {
            backgroundColor: theme.colors.primaryContainer,
            top: (TAB_HEIGHT - insets.bottom) / 2 - PILL_SIZE / 2,
            transform: [{ translateX }],
          },
        ]}
      />
      {navigationState.routes.map((route, index) => {
        const isFocused = navigationState.index === index;

        return (
          <Pressable
            key={route.key}
            onPress={() => jumpTo(route.key)}
            style={[styles.tab, { width: tabWidth }]}
          >
            <View style={styles.iconContainer}>
              <UIIcon
                name={route.icon}
                color={
                  isFocused ? theme.colors.primary : theme.colors.onBackground
                }
                size={ICON_SIZE}
              />
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: TAB_HEIGHT,
    flexDirection: "row",
    alignItems: "center",
  },
  tab: {
    height: TAB_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    width: PILL_SIZE,
    height: PILL_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  indicator: {
    position: "absolute",
    top: 0,
    left: -PILL_SIZE / 2,
    width: PILL_SIZE * 2,
    height: PILL_SIZE,
    borderRadius: PILL_SIZE / 2,
  },
});
