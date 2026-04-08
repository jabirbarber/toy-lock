import { windowWidth } from "@/constants/device";
import { spacing } from "@/constants/theme";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import React, { useEffect, useRef } from "react";
import { Animated, Pressable, StyleSheet, View } from "react-native";
import { useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TAB_HEIGHT = 120;
const ICON_SIZE = 24;
const PILL_PADDING = spacing.sm;
const PILL_SIZE = ICON_SIZE + PILL_PADDING * 2;

export default function TabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const tabCount = state.routes.length;
  const tabWidth = windowWidth / tabCount;

  const getX = (index: number) =>
    index * tabWidth + tabWidth / 2 - PILL_SIZE / 2;

  const translateX = useRef(new Animated.Value(getX(state.index))).current;
  useEffect(() => {
    Animated.spring(translateX, {
      toValue: state.index * tabWidth + tabWidth / 2 - PILL_SIZE / 2,
      useNativeDriver: true,
      damping: 18,
      stiffness: 200,
      mass: 0.8,
    }).start();
  }, [state.index, tabWidth, translateX]);

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
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            style={[styles.tab, { width: tabWidth }]}
          >
            <View style={styles.iconContainer}>
              {options.tabBarIcon?.({
                focused: isFocused,
                color: isFocused
                  ? theme.colors.primary
                  : theme.colors.onBackground,
                size: ICON_SIZE,
              })}
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
