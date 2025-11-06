import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useTheme } from "../context/ThemeContext";

// Import screens
import HomeScreen from "../screens/HomeScreen";
import RecommendedProductsScreen from "../screens/RecommendedProductsScreen";

const Tab = createMaterialTopTabNavigator();

const TopNavigation = () => {
  const { colors, toggleTheme, isDarkMode } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textLight,
        tabBarIndicatorStyle: {
          backgroundColor: colors.primary,
        },
        tabBarStyle: {
          backgroundColor: colors.white,
        },
        tabBarLabelStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: "Home",
        }}
      />
      <Tab.Screen
        name="Recommendations"
        component={RecommendedProductsScreen}
        options={{
          title: "Recommendations",
        }}
      />
    </Tab.Navigator>
  );
};

export default TopNavigation;
