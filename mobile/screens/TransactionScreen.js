import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import { baseUrl } from "../configs/baseUrl";

const ProductDetailScreen = ({ route }) => {
  const { product, outletId } = route.params || {};  // Mendapatkan product dan outletId
  const navigation = useNavigation();
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectProducts, setSelectedProducts] = useState([]);
  const [isInWishlist, setIsInWishlist] = useState(false);

  // Cek apakah outletId ada
  useEffect(() => {
    if (!outletId) {
      Alert.alert("Missing Information", "Outlet ID is missing.");
      return;
    }

    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/customers/product/${product?.slug}`);
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
  }, [product?.slug, outletId]);  // Menambahkan outletId sebagai dependency

  const handleWishlistToggle = async () => {
    try {
      const method = isInWishlist ? 'DELETE' : 'POST';
      const response = await fetch(`${baseUrl}/api/customers/wishlist`, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId: product._id }),
      });

      if (response.ok) {
        setIsInWishlist(!isInWishlist);
        console.log(`Product ${isInWishlist ? 'removed from' : 'added to'} wishlist`);
      } else {
        const errorData = await response.json();
        console.error('Failed to update wishlist', errorData);
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
      const userId = await SecureStore.getItemAsync("user_id");

      if (!token || !userId) {
        Alert.alert("Unauthorized", "Please log in to continue.");
        return navigation.navigate("Login");
      }

      if (!outletId) {
        Alert.alert("Missing Information", "Outlet ID is missing.");
        return;
      }

      // Menambahkan produk ke dalam list selectProducts jika belum ada
      setSelectedProducts((prev) => {
        if (!prev.some((item) => item._id === productData._id)) {
          return [...prev, productData]; // Menambahkan produk yang sedang ditampilkan
        }
        return prev;
      });

      const response = await fetch(`${baseUrl}/api/customers/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'x-user-id': userId, // Kirim userId di header
        },
        body: JSON.stringify({
          outletId,
          customerId: userId, // Kirim customerId di body
          product: selectProducts.map((item) => ({ productId: item._id, quantity: 1 })), // Menambahkan quantity
          transactionDate: new Date().toISOString(),
          totalAmount: selectProducts.reduce((total, item) => total + item.price, 0), // Total amount produk
          status: "pending",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error("Failed to add transaction");
      }

      Alert.alert("Success", "Transaction has been added!");
      setSelectedProducts([]); // Reset produk yang dipilih
      navigation.navigate("Transaction");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Unable to add transaction. Please try again.");
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#3498db" />;
  }

  if (!productData) {
    return (
      <View>
        <Text>Product not found</Text>
      </View>
    );
  }

  const formattedPrice = productData.price
    ? `Rp. ${Number(productData.price).toLocaleString("id-ID")}`
    : 'Price not available';

  return (
    <View style={{ padding: 20 }}>
      <Text>{productData.name}</Text>
      <Text>{formattedPrice}</Text>
      <TouchableOpacity onPress={handleWishlistToggle}>
        <Text>{isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleAddTransaction}>
        <Text>Add to Cart</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProductDetailScreen;
