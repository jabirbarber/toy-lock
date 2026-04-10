import UIIcon, { UIIconProps } from "@/components/ui/UIIcon";
import { windowWidth } from "@/constants/device";
import { spacing } from "@/constants/theme";
import React, { useEffect } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { useTheme } from "react-native-paper";
import Animated, {
  cancelAnimation,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
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

const SPRING = {
  damping: 20,
  stiffness: 200,
  mass: 0.8,
  overshootClamping: true,
} as const;

export default function TabBar({ navigationState, jumpTo }: Props) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const tabCount = navigationState.routes.length;
  const tabWidth = windowWidth / tabCount;

  const getCenter = (index: number) =>
    index * tabWidth + tabWidth / 2 - PILL_SIZE / 2;

  const pillX = useSharedValue(getCenter(navigationState.index));

  useEffect(() => {
    cancelAnimation(pillX);
    pillX.value = withSpring(getCenter(navigationState.index), SPRING);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigationState.index]);

  const gesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .onBegin(() => {
      "worklet";
      cancelAnimation(pillX);
    })
    .onUpdate((e) => {
      "worklet";
      const origin =
        navigationState.index * tabWidth + tabWidth / 2 - PILL_SIZE / 2;
      const min = tabWidth / 2 - PILL_SIZE / 2;
      const max = (tabCount - 1) * tabWidth + tabWidth / 2 - PILL_SIZE / 2;
      pillX.value = Math.max(min, Math.min(max, origin + e.translationX));
    })
    .onEnd((e) => {
      "worklet";
      const nearest = Math.round(
        navigationState.index + e.translationX / tabWidth,
      );
      const target = Math.max(0, Math.min(nearest, tabCount - 1));
      pillX.value = withSpring(
        target * tabWidth + tabWidth / 2 - PILL_SIZE / 2,
        SPRING,
      );
      runOnJS(jumpTo)(navigationState.routes[target].key);
    });

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: pillX.value }],
  }));

  const maskInnerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: PILL_SIZE / 2 - pillX.value }],
  }));

  return (
    <GestureDetector gesture={gesture}>
      <View
        style={[
          styles.container,
          {
            backgroundColor: theme.colors.background,
            paddingBottom: insets.bottom,
          },
        ]}
      >
        {/* Tab Icon Buttons */}
        {navigationState.routes.map((route) => (
          <Pressable
            key={route.key}
            onPress={() => jumpTo(route.key)}
            style={[styles.tab, { width: tabWidth }]}
          >
            <View style={styles.iconContainer}>
              <UIIcon
                name={route.icon}
                color={theme.colors.onBackground}
                size={ICON_SIZE}
              />
            </View>
          </Pressable>
        ))}
        {/* Pill Background */}
        <Animated.View
          pointerEvents="none"
          style={[
            styles.pill,
            {
              backgroundColor: theme.colors.primaryContainer,
              top: (TAB_HEIGHT - insets.bottom) / 2 - PILL_SIZE / 2,
            },
            indicatorStyle,
          ]}
        />
        {/* Pill Mask */}
        <Animated.View
          pointerEvents="none"
          style={[
            styles.pill,
            styles.pillMask,
            { top: (TAB_HEIGHT - insets.bottom) / 2 - PILL_SIZE / 2 },
            indicatorStyle,
          ]}
        >
          <Animated.View style={[styles.pillMaskInner, maskInnerStyle]}>
            {navigationState.routes.map((route) => (
              <View
                key={route.key}
                style={[styles.tabMask, { width: tabWidth }]}
              >
                <UIIcon
                  name={route.icon}
                  color={theme.colors.primary}
                  size={ICON_SIZE}
                />
              </View>
            ))}
          </Animated.View>
        </Animated.View>
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
  pill: {
    position: "absolute",
    top: 0,
    left: -PILL_SIZE / 2,
    width: PILL_SIZE * 2,
    height: PILL_SIZE,
    borderRadius: PILL_SIZE / 2,
  },
  pillMask: {
    overflow: "hidden",
    backgroundColor: "transparent",
  },
  pillMaskInner: {
    position: "absolute",
    flexDirection: "row",
    width: windowWidth,
    height: PILL_SIZE,
  },
  tabMask: {
    height: PILL_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
});
