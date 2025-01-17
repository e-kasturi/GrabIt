import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, TextInput, ScrollView } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome'; 
import { useNavigation } from '@react-navigation/native';

import { baseUrl } from "../configs/baseUrl";

const categories = [
  { name: "All", icon: "square"},
  { name: "Men", icon: "male" },
  { name: "Women", icon: "female" },
  { name: "Makeup", icon: "paint-brush" },
  { name: "Electronics", icon: "tv" }
];

const OutletScreen = () => {
  const navigation = useNavigation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/customers/product`);
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const handleProductClick = (product) => {
    navigation.navigate("ProductDetail", { product });
  };

  return (
    <ScrollView style={styles.container}>
      {/* Search and Chat Section */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity style={styles.chatIconContainer}>
          <Icon name="comment" size={20} color="#555" />
        </TouchableOpacity>
      </View>

      {/* Horizontal Advertisement Section */}
      <View style={styles.adContainer}>
        <Text style={styles.adText}>Special Offer: Get 20% off on all products!</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.adScrollView}>
          {/* Ad 1 */}
          <View style={styles.adItem}>
            <Image
              source={{ uri: 'https://im.uniqlo.com/global-cms/spa/res92b2c6c4c1a81517317dc888979411dbfr.jpg' }} 
              style={styles.adImage}
            />
          </View>
          {/* Ad 2 */}
          <View style={styles.adItem}>
            <Image
              source={{ uri: 'https://im.uniqlo.com/global-cms/spa/resaec93c74de01c9d8b3fdb02034fd2d31fr.jpg' }} 
              style={styles.adImage}
            />
          </View>
          {/* Ad 3 */}
          <View style={styles.adItem}>
            <Image
              source={{ uri: 'https://im.uniqlo.com/global-cms/spa/res3f2b5592a5b29eb399cfbcbb38777bb9fr.jpg' }} 
              style={styles.adImage}
            />
          </View>
        </ScrollView>
      </View>

      {/* Product Listing */}
      <View style={styles.cardContainer}>
        {filteredProducts.map((product) => (
          <TouchableOpacity key={product.slug} style={styles.card} onPress={() => handleProductClick(product)}>
            <Image
              source={{ uri: product.imgUrl }}
              style={styles.productImage}
            />
            <View style={styles.cardContent}>
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.productDescription}>{product.description}</Text>
              <Text style={styles.productPrice}>
                Rp. {product.price.toLocaleString('id-ID')}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
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
    borderColor: "#ccc",
    borderBottomWidth: 1,
    paddingBottom: 5,
  },
  searchInput: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    flex: 1,
  },
  chatIconContainer: {
    marginLeft: 10,
    padding: 8,
    backgroundColor: "#f1f1f1",
    borderRadius: 5,
  },
  adContainer: {
    marginBottom: 20,
    paddingBottom: 10,
  },
  adText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  adScrollView: {
    flexDirection: "row",
    paddingHorizontal: 5,
  },
  adItem: {
    marginRight: 10,
    borderRadius: 8,
    overflow: "hidden",
    width: 300,  
    height: 160,
  },
  adImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    borderRadius: 8,
  },
  cardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 20,
  },
  card: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  productImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  cardContent: {
    padding: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  productDescription: {
    fontSize: 14,
    color: "#7f8c8d",
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#e74c3c",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default OutletScreen;
