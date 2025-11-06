import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "../context/ThemeContext";

const ProductCard = ({ product, onPress }) => {
  const { colors, spacing, typography, globalStyles } = useTheme();

  return (
    <TouchableOpacity
      style={[globalStyles.card, styles.card]}
      onPress={onPress}
    >
      <Image
        source={{
          uri:
            product.image ||
            "https://via.placeholder.com/200x200?text=No+Image",
        }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.content}>
        <Text style={[globalStyles.text, styles.title]} numberOfLines={2}>
          {product.name || "Product Name"}
        </Text>
        <Text style={[styles.price, { color: colors.accent }]}>
          ${product.price || "0.00"}
        </Text>
        <Text
          style={[styles.description, { color: colors.textLight }]}
          numberOfLines={3}
        >
          {product.description || "No description available."}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 8,
    padding: 0,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 150,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  price: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default ProductCard;
