import React from "react";
import { View, Text, StyleSheet } from "react-native";

const WishlistScreen = ({ route }) => {
  const { product } = route?.params || {}; // Menggunakan optional chaining dan default value

  if (!product) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Product is not available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Wishlist</Text>
      <Text style={styles.productName}>{product.name}</Text>
      <Text style={styles.productDescription}>{product.description}</Text>
      <Text style={styles.productPrice}>
        Rp. {product.price.toLocaleString('id-ID')}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  productName: {
    fontSize: 20,
    color: '#333',
    marginBottom: 10,
  },
  productDescription: {
    fontSize: 16,
    color: "#7f8c8d",
    marginBottom: 10,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#e74c3c",
  },
  errorText: {
    fontSize: 18,
    color: "#e74c3c",
    textAlign: "center",
    marginTop: 20,
  },
});

export default WishlistScreen;
