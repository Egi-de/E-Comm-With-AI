import React from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { ThemeProvider } from "./context/ThemeContext";
import StackNavigation from "./routes/StackNavigation";

export default function App() {
  return (
    <ThemeProvider>
      <NavigationContainer>
        <StackNavigation />
        <StatusBar style="auto" />
      </NavigationContainer>
    </ThemeProvider>
  );
}
