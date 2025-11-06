import React, { useState, useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { ActivityIndicator, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Import screens
import LoginScreen from "../screens/LoginScreen";
import SignUpScreen from "../screens/SignUpScreen";
import RecommendedProductsScreen from "../screens/RecommendedProductsScreen";
import BottomNavigation from "./BottomNavigation";

const Stack = createStackNavigator();

const StackNavigation = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem("access_token");
      setIsAuthenticated(!!token);
    } catch (error) {
      console.error("Error checking auth status:", error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    // You can return a loading screen here
    return null;
  }

  return (
    <Stack.Navigator
      initialRouteName={isAuthenticated ? "Main" : "Login"}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="Main" component={BottomNavigation} />

      {/* Add RecommendedProductsScreen as a stack screen */}
      <Stack.Screen
        name="RecommendedProductsScreen"
        component={RecommendedProductsScreen}
        options={{
          headerShown: true,
          title: "Recommended Products",
          headerBackTitle: "Back",
        }}
      />
    </Stack.Navigator>
  );
};

export default StackNavigation;
