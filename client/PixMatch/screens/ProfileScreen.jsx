import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../context/ThemeContext";
import Button from "../components/Button";

const ProfileScreen = () => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    getUserData();
  }, []);

  const getUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem("user");
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        onPress: async () => {
          try {
            await AsyncStorage.removeItem("access_token");
            await AsyncStorage.removeItem("user");
            navigation.reset({
              index: 0,
              routes: [{ name: "Login" }],
            });
          } catch (error) {
            console.error("Error logging out:", error);
          }
        },
      },
    ]);
  };

  const handleSettings = () => {
    Alert.alert("Settings", "Settings functionality coming soon!");
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Profile</Text>
      {user ? (
        <View style={styles.userInfo}>
          <Text style={[styles.label, { color: colors.text }]}>
            Username: {user.username || "N/A"}
          </Text>
          <Text style={[styles.label, { color: colors.text }]}>
            Email: {user.email || "N/A"}
          </Text>
        </View>
      ) : (
        <Text style={[styles.label, { color: colors.text }]}>
          No user data available
        </Text>
      )}
      <Button title="Settings" onPress={handleSettings} />
      <Button title="Logout" onPress={handleLogout} style={{ marginTop: 20 }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
  },
  userInfo: {
    marginBottom: 30,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
});

export default ProfileScreen;
