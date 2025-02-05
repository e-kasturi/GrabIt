import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import { useNavigation } from "@react-navigation/native";

import { baseUrl } from "../configs/baseUrl";

const WishlistScreen = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      console.log("Fetching wishlist...");
      const response = await fetch(`${baseUrl}/api/customers/wishlist`);
      const text = await response.text();
      console.log("Response Text:", text);

      if (response.ok) {
        const data = JSON.parse(text);
        console.log("Parsed Response Data:", data);

        if (data.wishlist && Array.isArray(data.wishlist)) {
          setWishlist(data.wishlist);
        } else {
          console.warn("Wishlist is not an array or undefined:", data);
          setWishlist([]);
        }
      } else {
        console.error("Failed to fetch wishlist:", response.status);
        setError("Failed to fetch wishlist");
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      setError("Failed to fetch wishlist");
    } finally {
      setLoading(false);
    }
  };

  const handleNavigateToProductDetail = (wishlistItem) => {
    if (!wishlistItem || !wishlistItem._id) {
      Alert.alert("Error", "Product data is missing or malformed.");
      return;
    }

    console.log("Navigating with:", wishlistItem);
    navigation.navigate("ProductDetail", {
      product: wishlistItem,
      outletId: wishlistItem.outletId,
    });
  };

  const handleAddTransaction = async (wishlistItem) => {
    try {
      const userId = await SecureStore.getItemAsync("userId");
      if (!userId) {
        console.error("User not authenticated");
        return;
      }
  
      if (!wishlistItem || !wishlistItem.productId) { 
        Alert.alert("Error", "Product data is missing or malformed.");
        return;
      }
  
      const transactionBody = {
        transactionDate: new Date().toISOString().split("T")[0],
        products: [{ productId: wishlistItem.productId, quantity: 1 }], 
        outletId: wishlistItem.outletId,
        totalAmount: wishlistItem.price || 0,
        status: "pending",
      };
  
      console.log("Sending transaction request:", JSON.stringify(transactionBody, null, 2));
  
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
        body: JSON.stringify(transactionBody),
      });
  
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to add transaction");
      }
  
      Alert.alert("Success", "Transaction has been added!");
      navigation.navigate("TransactionScreen");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Unable to add transaction. Please try again.");
    }
  };
  

  const handleRemoveFromWishlist = async (productId) => {
    try {
      const token = await SecureStore.getItemAsync("access_token");
      if (!token) {
        Alert.alert("Unauthorized", "Please log in to continue.");
        return navigation.navigate("Login");
      }

      const response = await fetch(`${baseUrl}/api/customers/wishlist/${productId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to remove from wishlist");
      }

      setWishlist((prev) => prev.filter((item) => item._id !== productId));
      Alert.alert("Success", "Item removed from wishlist.");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Unable to remove item. Please try again.");
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text style={{ color: "red", textAlign: "center" }}>{error}</Text>;
  }

  return (
      <View style={styles.container}>
        <Text style={styles.title}>Wishlist</Text>
      <FlatList
        data={wishlist}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => {
          if (!item || !item._id) {
            return null;
          }

          return (
            <View style={styles.productContainer}>
              <TouchableOpacity onPress={() => handleNavigateToProductDetail(item)}>
                <Image source={{ uri: item.imgUrl }} style={styles.productImage} />
              </TouchableOpacity>
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productPrice}>{`Rp. ${Number(item.price).toLocaleString("id-ID")}`}</Text>
              </View>
              <TouchableOpacity style={styles.iconButton} onPress={() => handleRemoveFromWishlist(item._id)}>
                <Ionicons name="trash" size={22} color="ashgrey" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleAddTransaction(item)}>
                <Ionicons name="cart" size={24} color="ashgrey" />
              </TouchableOpacity>
            </View>
          );
        }}
      />
    </View>
  );
};

const styles = {
  title: {
    fontSize: 32,
    fontWeight: "800",
    marginBottom: 20,
    textAlign: "center",
    color: "#BA68C8",
    textShadowColor: "white",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
    container: { 
      flex: 1, 
      padding: 20, 
      backgroundColor: "#FFF0F5" 
    },
    productContainer: {
      flexDirection: "row",
      alignItems: "center",
      padding: 10,
      backgroundColor: "#D7BDE2", 
      marginBottom: 10,
      borderRadius: 8,
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 4,
      elevation: 2,
    },
    productImage: {
      width: 80,
      height: 80,
      borderRadius: 8,
      marginRight: 10,
    },
    productInfo: {
      flex: 1,
    },
    productName: {
      fontSize: 16,
      fontWeight: "bold",
    },
    productPrice: {
      fontSize: 14,
      color: "#e74c3c",
    },
    iconButton: {
      padding: 8,
    },
  };
  
export default WishlistScreen;
