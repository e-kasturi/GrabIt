import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { baseUrl } from "../configs/baseUrl";

const WishlistScreen = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/customers/wishlist`);
        const text = await response.text(); // Get the raw response text

        if (response.ok) {
          // Try to parse the text as JSON
          try {
            const data = JSON.parse(text);
            if (data && data.wishlist) {
              setWishlist(data.wishlist);
            } else {
              throw new Error('Invalid wishlist data structure');
            }
          } catch (err) {
            throw new Error('Failed to parse response as JSON');
          }
        } else {
          throw new Error('Failed to fetch wishlist');
        }
      } catch (error) {
        setError(error.message); // Store the error message
      } finally {
        setLoading(false); // Set loading to false after API call completes
      }
    };

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
        renderItem={({ item }) => (
          <View style={styles.productContainer}>
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.productPrice}>{`Rp. ${item.price}`}</Text>
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
  },
  productContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  productPrice: {
    fontSize: 16,
    color: '#e74c3c',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default WishlistScreen;
