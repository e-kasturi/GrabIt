import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

const WishlistScreen = ({ route }) => {
  const { wishlist: initialWishlist } = route?.params || [];
  const [wishlist, setWishlist] = useState(initialWishlist);
  const [cart, setCart] = useState([]);

  const handleRemoveFromWishlist = (product) => {
    setWishlist(wishlist.filter((item) => item.slug !== product.slug));
  };

  const handleAddToCart = (product) => {
    if (!cart.some((item) => item.slug === product.slug)) {
      setCart([...cart, product]);
    }
    alert(`${product.name} has been added to the cart!`);
  };

  if (wishlist.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Your wishlist is empty.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Wishlist</Text>
      <FlatList
        data={wishlist}
        keyExtractor={(item) => item.slug}
        renderItem={({ item }) => (
          <View style={styles.productCard}>
            <Image source={{ uri: item.imgUrl }} style={styles.productImage} />
            <View style={styles.productDetails}>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productDescription}>{item.description}</Text>
              <Text style={styles.productPrice}>
                Rp. {item.price.toLocaleString("id-ID")}
              </Text>
            </View>
            <View style={styles.iconContainer}>
              {/* Trash Icon */}
              <TouchableOpacity
                onPress={() => handleRemoveFromWishlist(item)}
                style={styles.iconButton}
              >
                <Icon name="trash" size={20} color="#e74c3c" />
              </TouchableOpacity>
              {/* Add to Cart Icon */}
              <TouchableOpacity
                onPress={() => handleAddToCart(item)}
                style={styles.iconButton}
              >
                <Icon name="shopping-cart" size={20} color="#2ecc71" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f8f8",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  productCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginBottom: 15,
    padding: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    elevation: 2,
    alignItems: "center",
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 10,
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  productDescription: {
    fontSize: 14,
    color: "#7f8c8d",
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#e74c3c",
  },
  iconContainer: {
    flexDirection: "row",
  },
  iconButton: {
    marginLeft: 10,
    padding: 5,
  },
  errorText: {
    fontSize: 18,
    color: "#e74c3c",
    textAlign: "center",
    marginTop: 20,
  },
});

export default WishlistScreen;
