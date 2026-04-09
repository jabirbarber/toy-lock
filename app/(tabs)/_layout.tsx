import TabBar, { TabRoute } from "@/components/TabBar";
import { windowWidth } from "@/constants/device";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "react-native-paper";
import { SceneMap, TabView } from "react-native-tab-view";
import AppHeader from "../../components/AppHeader";
import AnimalsScreen from "./animals";
import CameraScreen from "./camera";
import PhoneScreen from "./index";

const routes: TabRoute[] = [
  { key: "index", title: "Phone", icon: "dialpad" },
  { key: "animals", title: "Zoo", icon: "pets" },
  { key: "camera", title: "Camera", icon: "camera-alt" },
];

const renderScene = SceneMap({
  index: PhoneScreen,
  animals: AnimalsScreen,
  camera: CameraScreen,
});

export default function TabLayout() {
  const theme = useTheme();
  const [index, setIndex] = useState(0);

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <AppHeader />
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: windowWidth }}
        tabBarPosition="bottom"
        renderTabBar={(props) => <TabBar {...props} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
