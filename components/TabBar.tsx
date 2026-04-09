import UIIcon, { UIIconProps } from "@/components/ui/UIIcon";
import { windowWidth } from "@/constants/device";
import { spacing } from "@/constants/theme";
import React, { useRef } from "react";
import { Animated, Easing, Pressable, StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
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

  const getCenter = (index: number) =>
    index * tabWidth + tabWidth / 2 - PILL_SIZE / 2;

  const dragDelta = useRef(new Animated.Value(0)).current;

  // baseX is a native-thread interpolation — reliably tracks screen swipes
  const baseX = position.interpolate({
    inputRange: navigationState.routes.map((_, i) => i),
    outputRange: navigationState.routes.map((_, i) => getCenter(i)),
    extrapolate: "clamp",
  });

  const pillX = Animated.add(baseX, dragDelta);

  const swipeGesture = Gesture.Pan()
    .runOnJS(true)
    .activeOffsetX([-10, 10])
    .onBegin(() => {
      dragDelta.stopAnimation();
    })
    .onUpdate((event) => {
      const currentCenter = getCenter(navigationState.index);
      const minDelta = getCenter(0) - currentCenter;
      const maxDelta = getCenter(tabCount - 1) - currentCenter;
      dragDelta.setValue(
        Math.max(minDelta, Math.min(maxDelta, event.translationX)),
      );
    })
    .onEnd((event) => {
      const nearestIndex = Math.round(
        navigationState.index + event.translationX / tabWidth,
      );
      const clampedIndex = Math.max(0, Math.min(nearestIndex, tabCount - 1));
      jumpTo(navigationState.routes[clampedIndex].key);
      // Animate dragDelta back to 0 with the same decelerate curve the pager
      // uses, so baseX rising and dragDelta falling cancel each other out and
      // the pill appears to stay locked on the target tab.
      Animated.timing(dragDelta, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start();
    });

  return (
    <GestureDetector gesture={swipeGesture}>
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
              transform: [{ translateX: pillX }],
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
    </GestureDetector>
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
