import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Image, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons"; 
import { baseUrl } from "../configs/baseUrl";
import * as SecureStore from 'expo-secure-store'; 
import { useNavigation } from '@react-navigation/native';

const WishlistScreen = ({ route }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
   const [userId, setUserId] = useState(null); 
  const [error, setError] = useState(null);
  const { product } = route.params || {};
  const outletId = product?.outletId; 
  const slug = product?.slug;
    const navigation = useNavigation();
  
    console.log("Product:", product);
    console.log("outletId:", outletId);
    console.log("userId:", userId);

    
  const fetchWishlist = async () => {
    try {
      console.log("Fetching wishlist...");
      const response = await fetch(`${baseUrl}/api/customers/wishlist`);
      const text = await response.text();

      console.log("Response Text:", text);

      if (response.ok) {
        const data = JSON.parse(text);
        console.log("Parsed Response Data:", data);

        if (data.wishlist && Array.isArray(data.wishlist) && data.wishlist.length > 0) {
          const wishlistWithDetails = await Promise.all(
            data.wishlist.map(async (item) => {
              const productResponse = await fetch(`${baseUrl}/api/customers/${item.productId}`);
              const productText = await productResponse.text();

              console.log(`Fetching product with ID (slug): ${item.productId}`);
              console.log("Product Response Text:", productText);

              if (productResponse.ok) {
                try {
                  const productData = JSON.parse(productText);
                  console.log("Fetched Product Data:", productData);
                  return { ...item, product: productData };
                } catch (err) {
                  console.error("Failed to parse product data:", err);
                  return { ...item, product: null };
                }
              } else {
                console.error(`Failed to fetch product: ${item.productId}`);
                return { ...item, product: null };
              }
            })
          );
          setWishlist(wishlistWithDetails);
        } else {
          console.log("Wishlist is empty.");
          setWishlist([]); 
        }
      } else if (response.status === 404) {
        const data = JSON.parse(text);
        console.log("Wishlist not found:", data.message);
        setWishlist([]); 
      } else {
        console.error("Failed to fetch wishlist:", response.status);
        const data = JSON.parse(text);
        setError(data.message || "Failed to fetch wishlist");
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      setError("Failed to fetch wishlist");
    } finally {
      setLoading(false);
    }
  };
  const handleRemoveFromWishlist = async (productId) => {
    try {
      const response = await fetch(`${baseUrl}/api/customers/wishlist/${productId}`, {
        method: "DELETE",
      });
  
      if (response.ok) {
        console.log(`Removed product with ID: ${productId} from wishlist.`);
        fetchWishlist(); 
      } else {
        console.error("Failed to remove product from wishlist.");
        const errorData = await response.text();
        console.error("Error Response:", errorData);
        setError("Failed to remove product from wishlist.");
      }
    } catch (error) {
      console.error("Error removing product from wishlist:", error);
      setError("Error removing product from wishlist.");
    }
  };
  

 const handleAddTransaction = async () => {
     try {
       const token = await SecureStore.getItemAsync("access_token");
       if (!token) {
         Alert.alert("Unauthorized", "Please log in to continue.");
         return navigation.navigate("Login");
       }
   
       const transactionBody = {
         transactionDate: new Date().toISOString().split("T")[0], 
         products: [{ productId: product._id, quantity: 1 }], 
         outletId,
         totalAmount: productData?.price || 0,
         status: "pending", 
       };
   
       console.log("Sending transaction request:", JSON.stringify(transactionBody, null, 2));
   
       const response = await fetch(`${baseUrl}/api/customers/transactions`, {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
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
   
  

  useEffect(() => {
    fetchWishlist();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  if (wishlist.length === 0) {
    return (
      <View style={styles.container}>
        <Text>Your wishlist is empty</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={wishlist}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => {
          const formattedPrice =
            item.product?.price && !isNaN(Number(item.product.price))
              ? `Rp. ${Number(item.product.price).toLocaleString("id-ID")}`
              : "Price not available";

          return (
            <View style={styles.productContainer}>
              <Image source={{ uri: item.product?.imgUrl }} style={styles.productImage} />
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{item.product?.name || "Product not available"}</Text>
                <Text style={styles.productPrice}>{formattedPrice}</Text>
              </View>
              <View style={styles.actionsContainer}>
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => handleRemoveFromWishlist(item.productId)}
                >
                  <Ionicons name="trash" size={24} color="red" />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleAddTransaction}>
                           <Ionicons name="cart" size={30} color="#27ae60" />
                         </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  productContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  productPrice: {
    fontSize: 16,
    color: "#e74c3c",
  },
  actionsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    marginHorizontal: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default WishlistScreen;