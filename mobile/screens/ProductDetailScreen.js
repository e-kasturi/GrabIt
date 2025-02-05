import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { baseUrl } from "../configs/baseUrl";
import { Ionicons } from "@expo/vector-icons"; 
import { useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store'; 

const ProductDetailScreen = ({ route }) => {
  const { product } = route.params || {};
  const outletId = product?.outletId; 
  const [userId, setUserId] = useState(null); 
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const slug = product?.slug;
  const navigation = useNavigation();

  const fetchUserId = async () => {
    try {
      const storedUserId = await SecureStore.getItemAsync("userId");
      if (storedUserId) {
        setUserId(storedUserId); 
      }
    } catch (error) {
      console.error("Error fetching userId from SecureStore:", error);
    }
  };

  useEffect(() => {
    if (!slug) return;
    fetchUserId(); 

    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/customers/product/${slug}`);
        const data = await response.json();
        if (data.error) {
          setProductData(null);
        } else {
          setProductData(data);
          setIsInWishlist(data.isInWishlist); 
        }
      } catch (error) {
        console.error('Failed to fetch product details:', error);
        setProductData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails(); 
  }, [slug]);

  const handleWishlistToggle = async (productId) => {
    if (!productId) return;

    try {
      const response = await fetch(`${baseUrl}/api/customers/wishlist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId }),
      });

      const responseBody = await response.json();

      if (response.ok) {
        setIsInWishlist(!isInWishlist);
        Alert.alert("Success", "Product added to wishlist.");
      } else {
        Alert.alert("Error", "Product already in wishlist.");
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred while updating the wishlist");
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

      Alert.alert("Success", "Transaction added!");
      navigation.navigate("TransactionScreen");
    } catch (error) {
      Alert.alert("Error", "Unable to add transaction. Please try again.");
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  if (!productData) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Product not found</Text>
      </View>
    );
  }

  const formattedPrice = productData.price && !isNaN(Number(productData.price))
    ? `Rp. ${Number(productData.price).toLocaleString("id-ID")}`
    : 'Price not available';

  return (
    <View style={styles.container}>
      <View style={styles.productCard}>
        <Image source={{ uri: productData.imgUrl }} style={styles.productImage} />
        <Text style={styles.productName}>{productData.name}</Text>
        <Text style={styles.productDescription}>{productData.description}</Text>
        <Text style={styles.productPrice}>{formattedPrice}</Text>

        <View style={styles.actionContainer}>
          <TouchableOpacity onPress={() => handleWishlistToggle(productData._id)}>
            <Ionicons
              name={isInWishlist ? "heart" : "heart-outline"}
              size={34}
              color={isInWishlist ? "#e74c3c" : "#bdc3c7"}
              style={styles.icon}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.addToCartBtn} onPress={handleAddTransaction}>
            <Text style={styles.addToCartText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF0F5',
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 25,
    padding: 20,
    elevation: 12,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    marginBottom: 25,
    overflow: 'hidden', 
  },
  productImage: {
    width: '100%',
    height: 350,
    resizeMode: 'cover',
    borderRadius: 20,
    marginBottom: 15,
  },
  productName: {
    fontSize: 28,
    fontWeight: '600',
    color: '#34495e',
    marginBottom: 8,
  },
  productDescription: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 20,
    lineHeight: 22,
  },
  productPrice: {
    fontSize: 22,
    fontWeight: '700',
    color: '#e74c3c',
    marginBottom: 20,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  icon: {
    transition: 'all 0.3s ease-in-out',
  },
  addToCartBtn: {
    backgroundColor: '#6A0DAD',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 40,
    elevation: 5,
    transform: [{ scale: 1 }],
    transition: 'all 0.2s ease',
  },
  addToCartText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default ProductDetailScreen;
