import React, { useState } from "react";
import {
  View,
  Text,
  Alert,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { useTheme } from "../context/ThemeContext";
import Button from "../components/Button";
import { getRecommendedProducts } from "../service/api";

const HomeScreen = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const { colors, spacing, typography, globalStyles, toggleTheme, isDarkMode } =
    useTheme();

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "Please grant permission to access your photos"
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0]);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "Please grant permission to access your camera"
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0]);
    }
  };

  const handleGetRecommendations = async () => {
    if (!selectedImage) {
      Alert.alert("No image selected", "Please select or take a photo first");
      return;
    }

    setLoading(true);
    try {
      const recommendations = await getRecommendedProducts(selectedImage.uri);
      navigation.navigate("RecommendedProductsScreen", {
        products: recommendations,
      });
    } catch (error) {
      console.error("Recommendation error:", error);
      Alert.alert("Error", "Failed to get recommendations. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[globalStyles.container, styles.container]}>
      <TouchableOpacity
        style={[styles.themeToggle, { backgroundColor: colors.primary }]}
        onPress={toggleTheme}
      >
        <Text style={[styles.themeToggleText, { color: colors.white }]}>
          {isDarkMode ? "Light" : "Dark"}
        </Text>
      </TouchableOpacity>

      <Text
        style={[
          globalStyles.title,
          { color: colors.primary, textAlign: "center" },
        ]}
      >
        PixMatch
      </Text>
      <Text
        style={[
          styles.subtitle,
          { color: colors.textLight, textAlign: "center" },
        ]}
      >
        Find products that match your style
      </Text>

      <View style={styles.imageContainer}>
        {selectedImage ? (
          <Image source={{ uri: selectedImage.uri }} style={styles.image} />
        ) : (
          <View style={[styles.placeholder, { borderColor: colors.primary }]}>
            <Text style={[styles.placeholderText, { color: colors.textLight }]}>
              No image selected
            </Text>
          </View>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Choose from Gallery"
          onPress={pickImage}
          variant="secondary"
          style={styles.button}
        />
        <Button
          title="Take Photo"
          onPress={takePhoto}
          variant="accent"
          style={styles.button}
        />
      </View>

      {selectedImage && (
        <Button
          title="Get Recommendations"
          onPress={handleGetRecommendations}
          loading={loading}
          style={styles.recommendButton}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    justifyContent: "center",
  },
  themeToggle: {
    position: "absolute",
    top: 50,
    right: 20,
    padding: 10,
    borderRadius: 20,
    zIndex: 1,
  },
  themeToggleText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 32,
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  image: {
    width: 250,
    height: 250,
    borderRadius: 12,
  },
  placeholder: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderStyle: "dashed",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
  },
  recommendButton: {
    marginTop: 16,
  },
});

export default HomeScreen;
