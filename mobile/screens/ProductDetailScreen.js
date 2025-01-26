import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { baseUrl } from "../configs/baseUrl";
import { Ionicons } from "@expo/vector-icons"; 
import { useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store'; 

const ProductDetailScreen = ({ route }) => {
  const { product } = route.params || {}; 
  const slug = product?.slug;
  const navigation = useNavigation();

  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isInWishlist, setIsInWishlist] = useState(false);
  
  const [selectProducts, setSelectedProducts] = useState([]);

  useEffect(() => {
    if (!slug) {
      console.error('Slug is missing');
      return;
    }

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

  const handleWishlistToggle = async () => {
    try {
      const method = isInWishlist ? 'DELETE' : 'POST'; 
      const response = await fetch(`${baseUrl}/api/customers/wishlist`, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId: product._id }), 
      });

      const responseBody = await response.json();

      if (response.ok) {
        setIsInWishlist(!isInWishlist); 
        console.log(`Product ${isInWishlist ? 'removed from' : 'added to'} wishlist`);
      } else {
        console.error('Failed to update wishlist', responseBody);
        alert('Produk sudah ada di wishlist');
      }
    } catch (error) {
      console.error('Error in wishlist toggle:', error);
      alert('An error occurred while updating the wishlist');
    }
  };

  const handleAddTransaction = async () => {
    try {
      const token = await SecureStore.getItemAsync("access_token");
      console.log(token, "token");
  
      if (!token) {
        Alert.alert("Unauthorized", "Please log in to continue.");
        return navigation.navigate("Login");
      }
  
      const { outletId, userId } = route.params || {};
  
      if (!outletId || !userId) {
        Alert.alert("Missing Information", "Outlet ID or User ID is missing.");
        return;
      }
  
      const response = await fetch(`${baseUrl}/api/customers/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,  
        },
        body: JSON.stringify({
          outletId,
          customerId: userId,
          product: selectProducts.map((item) => ({ productId: item._id })), 
          transactionDate,
          totalAmount: 0,
          status: "pending",
        }),
      });
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error("Failed to add transaction");
      }
      console.log(data, "data");
  
      Alert.alert("Success", `Transaction has been added!`);
      setSelectedProducts([]);
      navigation.navigate("Transaction");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Unable to add transaction. Please try again.");
    }
  };
  
  if (!product) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Product information is missing</Text>
      </View>
    );
  }

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
        <Text>Product not found</Text>
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
          <TouchableOpacity onPress={handleWishlistToggle}>
            <Ionicons
              name={isInWishlist ? "heart" : "heart-outline"}
              size={30}
              color={isInWishlist ? "#e74c3c" : "#bdc3c7"}  
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={handleAddTransaction}>
            <Ionicons name="cart" size={30} color="#27ae60" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
    padding: 20,
  },
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 25,
    elevation: 5,  
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    marginBottom: 20,
  },
  productImage: {
    width: '100%',
    height: 350,
    resizeMode: 'contain',
    marginBottom: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  productName: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#34495e',
  },
  productDescription: {
    fontSize: 18,
    color: '#7f8c8d',
    marginBottom: 15,
    lineHeight: 24,
  },
  productPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#e74c3c',
    marginBottom: 20,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
