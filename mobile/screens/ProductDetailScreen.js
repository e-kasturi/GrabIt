import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { baseUrl } from "../configs/baseUrl";
import Icon from 'react-native-vector-icons/FontAwesome';  // Import FontAwesome icon

const ProductDetailScreen = ({ route, navigation }) => {
  const { product } = route.params;
  const slug = product?.slug;

  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isInWishlist, setIsInWishlist] = useState(false); // Track if the product is in wishlist

  useEffect(() => {
    if (!slug) {
      console.error('Slug is missing');
      return;
    }

    console.log('Slug:', slug);

    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/customers/product/${slug}`);
        const data = await response.json();
        console.log('Product data:', data);

        if (data.error) {
          setProductData(null);
        } else {
          setProductData(data);
          setIsInWishlist(data.isInWishlist);  // Assuming the API returns whether the product is in wishlist
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

  // Function to toggle wishlist
  const handleWishlistToggle = async () => {
    try {
      const method = isInWishlist ? 'DELETE' : 'POST';  // If in wishlist, DELETE, else POST
      const response = await fetch(`${baseUrl}/api/customers/wishlist`, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          // Add any other required headers (like authorization)
        },
        body: JSON.stringify({ productId: product._id }),  // Pass the product ID
      });

      const responseBody = await response.json();

      if (response.ok) {
        setIsInWishlist(!isInWishlist);  // Toggle the wishlist state
        console.log(`Product ${isInWishlist ? 'removed from' : 'added to'} wishlist`);
        navigation.navigate('WishlistScreen');  // Navigate to WishlistScreen
      } else {
        console.error('Failed to update wishlist', responseBody);
        alert('Failed to update wishlist');
      }
    } catch (error) {
      console.error('Error in wishlist toggle:', error);
      alert('An error occurred while updating the wishlist');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
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
      <Image source={{ uri: productData.imgUrl }} style={styles.productImage} />
      <Text style={styles.productName}>{productData.name}</Text>
      <Text style={styles.productDescription}>{productData.description}</Text>
      <Text style={styles.productPrice}>{formattedPrice}</Text>

      {/* Heart Icon to toggle wishlist */}
      <TouchableOpacity onPress={handleWishlistToggle}>
        <Icon
          name={isInWishlist ? 'heart' : 'heart-o'}  // Filled heart if in wishlist, outlined heart otherwise
          size={30}
          color={isInWishlist ? 'red' : 'gray'}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  productImage: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  productDescription: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 10,
  },
  productPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#e74c3c',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProductDetailScreen;
