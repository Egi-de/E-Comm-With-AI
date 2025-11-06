import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { useTheme } from "../context/ThemeContext";
import ProductCard from "../components/ProductCard";

const RecommendedProductsScreen = () => {
  const route = useRoute();
  const { products } = route.params || { products: [] };
  const { colors, spacing, typography, globalStyles } = useTheme();

  const handleProductPress = (product) => {
    // Handle product selection - could navigate to product details
    console.log("Product selected:", product);
  };

  const renderProduct = ({ item }) => (
    <ProductCard product={item} onPress={() => handleProductPress(item)} />
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={[styles.emptyText, { color: colors.textLight }]}>
        No recommendations found
      </Text>
      <Text style={[styles.emptySubtext, { color: colors.textLight }]}>
        Try uploading a different image
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={[globalStyles.container]}>
      <View style={styles.header}>
        <Text style={[globalStyles.title, { color: colors.primary }]}>
          Recommended Products
        </Text>
        <Text style={[styles.subtitle, { color: colors.textLight }]}>
          Products that match your style
        </Text>
      </View>

      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmpty}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 24,
    paddingBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    marginTop: 8,
  },
  listContainer: {
    padding: 16,
    paddingTop: 0,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
  },
});

export default RecommendedProductsScreen;
