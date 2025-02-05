import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import { useNavigation } from "@react-navigation/native";
import { baseUrl } from "../configs/baseUrl";
import { MaterialCommunityIcons } from "@expo/vector-icons";

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
      const response = await fetch(`${baseUrl}/api/customers/wishlist`);
      const text = await response.text();
      if (response.ok) {
        const data = JSON.parse(text);
        setWishlist(data.wishlist || []);
      } else {
        setError("Failed to fetch wishlist");
      }
    } catch (error) {
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
    navigation.navigate("ProductDetail", {
      product: wishlistItem,
      outletId: wishlistItem.outletId,
    });
  };

  const handleAddTransaction = async (wishlistItem) => {
    try {
      const userId = await SecureStore.getItemAsync("userId");
      if (!userId) return;

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
      if (!response.ok)
        throw new Error(data.message || "Failed to add transaction");

      Alert.alert("Success", "Transaction has been added!");
      navigation.navigate("TransactionScreen");
    } catch (error) {
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

      const response = await fetch(
        `${baseUrl}/api/customers/wishlist/${productId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to remove from wishlist");

      setWishlist((prev) => prev.filter((item) => item._id !== productId));
      Alert.alert("Success", "Item removed from wishlist.");
    } catch (error) {
      Alert.alert("Error", "Unable to remove item. Please try again.");
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6A0DAD" />
      </View>
    );
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Wishlist</Text>
      <FlatList
        data={wishlist}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => {
          if (!item || !item._id) return null;

          return (
            <View style={styles.productContainer}>
              <TouchableOpacity
                onPress={() => handleNavigateToProductDetail(item)}
              >
                <Image
                  source={{ uri: item.imgUrl }}
                  style={styles.productImage}
                />
              </TouchableOpacity>
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productPrice}>{`Rp. ${Number(
                  item.price
                ).toLocaleString("id-ID")}`}</Text>
              </View>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => handleRemoveFromWishlist(item._id)}
                >
                  <MaterialCommunityIcons
                    name="trash-can-outline"
                    size={24}
                    color="red"
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleAddTransaction(item)}
                  style={styles.iconButton}
                >
                  <Ionicons name="cart" size={24} color="#6A0DAD" />
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F8F1FF",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    color: "#6A0DAD",
    marginBottom: 20,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
  productContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#FFF",
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  productPrice: {
    fontSize: 16,
    color: "#e74c3c",
    fontWeight: "600",
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    marginHorizontal: 10,
    padding: 4,
  },
};

export default WishlistScreen;
