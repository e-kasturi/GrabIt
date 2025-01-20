import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { baseUrl } from "../configs/baseUrl";

const ProductDetailScreen = ({ route, navigation }) => {
  const { product } = route.params;
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);
  const [outletId, setOutletId] = useState(''); 
  const [userId, setUserId] = useState(''); 
  const [selectedServices, setSelectedServices] = useState([]); 
  const [transactionDate, setTransactionDate] = useState(new Date().toISOString()); 

  useEffect(() => {
    loadWishlistFromStorage();
    loadCartFromStorage();
  }, []);

  const saveWishlistToStorage = async (wishlist) => {
    try {
      await AsyncStorage.setItem("wishlist", JSON.stringify(wishlist));
    } catch (error) {
      console.error("Failed to save wishlist to storage:", error);
    }
  };

  const loadWishlistFromStorage = async () => {
    try {
      const savedWishlist = await AsyncStorage.getItem("wishlist");
      if (savedWishlist) {
        setWishlist(JSON.parse(savedWishlist));
      }
    } catch (error) {
      console.error("Failed to load wishlist from storage:", error);
    }
  };

  const saveCartToStorage = async (cart) => {
    try {
      await AsyncStorage.setItem("cart", JSON.stringify(cart));
    } catch (error) {
      console.error("Failed to save cart to storage:", error);
    }
  };

  const loadCartFromStorage = async () => {
    try {
      const savedCart = await AsyncStorage.getItem("cart");
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error("Failed to load cart from storage:", error);
    }
  };

  const toggleWishlist = async (product) => {
    let updatedWishlist;

    if (wishlist.some((item) => item.slug === product.slug)) {
      updatedWishlist = wishlist.filter((item) => item.slug !== product.slug);
      Alert.alert("Wishlist", "Produk telah dihapus dari wishlist.");
    } else {
      updatedWishlist = [...wishlist, product];
      Alert.alert("Wishlist", "Produk berhasil ditambahkan ke wishlist!");
    }

    setWishlist(updatedWishlist);
    await saveWishlistToStorage(updatedWishlist);
  };

  const isInWishlist = (product) => {
    return wishlist.some((item) => item.slug === product.slug);
  };

  const handleAddTransaction = async () => {
    try {
      const token = await SecureStore.getItemAsync("access_token");

      if (!token) {
        Alert.alert("Unauthorized", "Please log in to continue.");
        return navigation.navigate("Login");
      }


      const response = await fetch(`${baseUrl}/api/customers/transactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          outletId,
          customerId: userId,
          products: selectedServices.map((item) => ({ productId: item._id })),
          transactionDate,
          totalAmount: 0, 
          status: "pending",
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error("Failed to add transaction");
      }

      Alert.alert("Success", "Transaction has been added!");
      setSelectedServices([]); 
      navigation.navigate("Transaction");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Unable to add transaction. Please try again.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: product.imgUrl }} style={styles.productImage} />
      <View style={styles.contentContainer}>
        <Text style={styles.productName}>{product.name}</Text>
        <Text style={styles.productDescription}>{product.description}</Text>
        <Text style={styles.productPrice}>
          Rp. {product.price.toLocaleString('id-ID')}
        </Text>

        {/* Rating Section with Star Icon */}
        <View style={styles.ratingContainer}>
          <Icon name="star" size={20} color="#f1c40f" />
          <Icon name="star" size={20} color="#f1c40f" />
          <Icon name="star" size={20} color="#f1c40f" />
          <Icon name="star" size={20} color="#f1c40f" />
          <Icon name="star-o" size={20} color="#f1c40f" />
        </View>

        {/* Heart and Add to Cart Buttons */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.iconButton} onPress={() => toggleWishlist(product)}>
            <Icon 
              name="heart" 
              size={24} 
              color={isInWishlist(product) ? "red" : "#000"} 
            />
            <Text style={styles.iconText}>Add to Wishlist</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={handleAddTransaction}>
            <Icon name="shopping-cart" size={24} color="#000" />
            <Text style={styles.iconText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  productImage: {
    width: "100%",
    height: 300,
    resizeMode: "cover",
    borderRadius: 10,
    marginBottom: 20,
  },
  contentContainer: {
    marginTop: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  productName: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  productDescription: {
    fontSize: 16,
    color: "#7f8c8d",
    marginBottom: 15,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#e74c3c",
    marginBottom: 20,
  },
  ratingContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
  },
  iconButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#f1f1f1",
    borderRadius: 10,
    width: "48%",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  iconText: {
    marginLeft: 10,
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
});

export default ProductDetailScreen;
