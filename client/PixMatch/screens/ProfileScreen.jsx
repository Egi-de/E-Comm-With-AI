import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { useTheme } from "../context/ThemeContext";
import Button from "../components/Button";

const ProfileScreen = () => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [avatar, setAvatar] = useState(null);

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

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "Camera roll permissions are required to select an image."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };

  const handleSettings = () => {
    navigation.navigate("Settings");
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Profile</Text>

      <TouchableOpacity style={styles.avatarContainer} onPress={pickImage}>
        {avatar ? (
          <Image source={{ uri: avatar }} style={styles.avatar} />
        ) : (
          <View
            style={[
              styles.avatarPlaceholder,
              { backgroundColor: colors.primary },
            ]}
          >
            <Text style={[styles.avatarText, { color: colors.white }]}>
              {user?.username?.charAt(0)?.toUpperCase() || "?"}
            </Text>
          </View>
        )}
        <Text style={[styles.changeAvatarText, { color: colors.primary }]}>
          Change Avatar
        </Text>
      </TouchableOpacity>

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
  avatarContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: "bold",
  },
  changeAvatarText: {
    fontSize: 16,
    textDecorationLine: "underline",
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
