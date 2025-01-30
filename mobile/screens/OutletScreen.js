import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { baseUrl } from "../configs/baseUrl";

const OutletScreen = ({ route }) => {
  const navigation = useNavigation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { product, userId, outletId } = route.params || {};
  const [isInWishlist, setIsInWishlist] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/customers/product`);
        const data = await response.json();

        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          console.error("Unexpected response format:", data);
          setProducts([]);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
        Alert.alert("Error", "Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleWishlistToggle = async (productId) => {
    if (!productId) {
      console.error("Product ID is undefined");
      Alert.alert("Error", "Product ID is missing");
      return;
    }

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
        setIsInWishlist(true);
        Alert.alert(
          "Success",
          `Product has been added to your wishlist.`,
          [{ text: "OK" }]
        );
        console.log(`Product added to wishlist`);
      } else {
        console.error("Failed to update wishlist", responseBody);
        Alert.alert("Error", "Product might already be in the wishlist.");
      }
    } catch (error) {
      console.error("Error in wishlist toggle:", error);
      Alert.alert("Error", "An error occurred while updating the wishlist");
    }
  };

  const handleProductClick = (product) => {
    console.log("outletId:", outletId);  
  console.log("userId:", userId); 
  navigation.navigate("ProductDetail", { product, outletId, userId });

  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Search Section */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={() => navigation.navigate("WishlistScreen")}
        >
          <Icon name="heart" size={20} color="#555" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconContainer}>
          <Icon name="comment" size={20} color="#555" />
        </TouchableOpacity>
      </View>

      {/* Horizontal Advertisement Section */}
      <View style={styles.adContainer}>
        <Text style={styles.adText}>
          Special Offer: Get 20% off on all products!
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.adScrollView}>
          <View style={styles.adItem}>
            <Image
              source={{
                uri: "https://im.uniqlo.com/global-cms/spa/res92b2c6c4c1a81517317dc888979411dbfr.jpg",
              }}
              style={styles.adImage}
            />
          </View>
          <View style={styles.adItem}>
            <Image
              source={{
                uri: "https://im.uniqlo.com/global-cms/spa/resaec93c74de01c9d8b3fdb02034fd2d31fr.jpg",
              }}
              style={styles.adImage}
            />
          </View>
          <View style={styles.adItem}>
            <Image
              source={{
                uri: "https://im.uniqlo.com/global-cms/spa/res3f2b5592a5b29eb399cfbcbb38777bb9fr.jpg",
              }}
              style={styles.adImage}
            />
          </View>
        </ScrollView>
      </View>

      {/* Product Listing */}
      <View style={styles.cardContainer}>
        {filteredProducts.length === 0 ? (
          <View style={styles.noProductsContainer}>
            <Text style={styles.noProductsText}>Produk tidak tersedia.</Text>
          </View>
        ) : (
          filteredProducts.map((product) => (
            <View key={product.slug} style={styles.card}>
              <TouchableOpacity onPress={() => handleProductClick(product)}>
                <Image
                  source={{ uri: product.imgUrl }}
                  style={styles.productImage}
                />
              </TouchableOpacity>
              <View style={styles.cardContent}>
                <View style={styles.productHeader}>
                  <Text style={styles.productName}>{product.name}</Text>
                  <TouchableOpacity
                    onPress={() => handleWishlistToggle(product._id)}
                    style={styles.heartIconContainer}
                  >
                    <Icon
                      name="heart-o"
                      size={18}
                      color="gray"
                    />
                  </TouchableOpacity>
                </View>
                <Text style={styles.productDescription}>
                  {product.description}
                </Text>
                <Text style={styles.productPrice}>
                  Rp. {product.price.toLocaleString("id-ID")}
                </Text>
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  adContainer: {
    marginBottom: 20,
  },
  adText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 10,
  },
  adScrollView: {
    flexDirection: "row",
  },
  adItem: {
    width: 300,
    marginRight: 15,
    borderRadius: 8,
    overflow: "hidden",
  },
  adImage: {
    width: "100%",
    height: 150,
    borderRadius: 8,
    resizeMode: "cover",
  },
  iconContainer: {
    marginLeft: 10,
    padding: 8,
  },
  cardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "48%",
    marginBottom: 15,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    elevation: 4,
  },
  productImage: {
    width: "100%",
    height: 150,
  },
  cardContent: {
    padding: 10,
  },
  productHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  productDescription: {
    fontSize: 14,
    color: "#7f8c8d",
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#e74c3c",
    marginTop: 5,
  },
  heartIconContainer: {
    marginLeft: 10,
    padding: 5,
    borderRadius: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noProductsContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  noProductsText: {
    fontSize: 16,
    color: "#7f8c8d",
  },
});

export default OutletScreen;
