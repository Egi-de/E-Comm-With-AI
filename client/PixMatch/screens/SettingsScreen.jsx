import React from "react";
import { View, Text, StyleSheet, Switch, Alert } from "react-native";
import { useTheme } from "../context/ThemeContext";
import Button from "../components/Button";

const SettingsScreen = () => {
  const { colors, isDarkMode, toggleTheme } = useTheme();

  const handleThemeToggle = () => {
    toggleTheme();
  };

  const handleClearData = () => {
    Alert.alert("Clear Data", "Are you sure you want to clear all app data?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Clear",
        style: "destructive",
        onPress: () => {
          // Implement clear data logic here
          Alert.alert("Data Cleared", "All app data has been cleared.");
        },
      },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Settings</Text>

      <View style={styles.settingItem}>
        <Text style={[styles.settingLabel, { color: colors.text }]}>
          Dark Mode
        </Text>
        <Switch
          value={isDarkMode}
          onValueChange={handleThemeToggle}
          trackColor={{ false: colors.textLight, true: colors.primary }}
          thumbColor={isDarkMode ? colors.white : colors.primary}
        />
      </View>

      <View style={styles.settingItem}>
        <Button
          title="Clear App Data"
          onPress={handleClearData}
          style={{ backgroundColor: colors.error }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
  },
  settingItem: {
    marginBottom: 20,
  },
  settingLabel: {
    fontSize: 18,
    marginBottom: 10,
  },
});

export default SettingsScreen;
