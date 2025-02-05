import React, { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Alert,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigation } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import { baseUrl } from "../configs/baseUrl";

export default function UserScreen() {
  const navigation = useNavigation();
  const { setIsSignedIn } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [orderStatus, setOrderStatus] = useState({
    pending: 0,
    dikemas: 0,
    dikirim: 0,
    selesai: 0,
    dibatalkan: 0,
    pengembalian: 0,
  });

  const handleOnLogOut = async () => {
    await SecureStore.deleteItemAsync("access_token");
    setIsSignedIn(false);
  };

  const fetchUserProfile = async () => {
    const token = await SecureStore.getItemAsync("access_token");
    if (!token) {
      Alert.alert("Error", "You are not logged in");
      setIsSignedIn(false);
      return;
    }
    try {
      const response = await fetch(`${baseUrl}/api/customers/profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        if (response.status === 401) {
          Alert.alert("Session expired", "Please log in again.");
          setIsSignedIn(false);
        }
        throw new Error("Failed to fetch profile");
      }
      const data = await response.json();
      console.log("Data profil yang diterima:", data);
      setUser(data);

      const transactionResponse = await fetch(`${baseUrl}/api/customers/transactions`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!transactionResponse.ok) {
        throw new Error("Failed to fetch transactions");
      }
      const transactionData = await transactionResponse.json();
      console.log("Transaksi yang diterima:", transactionData);

      const orderStatusCount = {
        pending: 0,
        selesai: 0,
        dibatalkan: 0,
        pengembalian: 0,
        dikemas: 0,
        dikirim: 0,
      };

      // Count status of transactions
      transactionData.forEach((transaction) => {
        if (transaction.status === "pending") {
          orderStatusCount.pending++;
        } else if (transaction.status === "dikemas") {
          orderStatusCount.dikemas++;
        } else if (transaction.status === "dikirim") {
          orderStatusCount.dikirim++;
        }
      });

      setOrderStatus(orderStatusCount);

    } catch (error) {
      Alert.alert("Error", "Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/customers/product`);
      const data = await response.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      Alert.alert("Error", "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const handleProductClick = (product) => {
    navigation.navigate("ProductDetail", { product });
  };

  useEffect(() => {
    fetchUserProfile();
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#8E44AD" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.centeredContainer}>
        <Text>Error: No user data available</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.header}>
        <View style={styles.profileInfo}>
          <Image
            source={{ uri: user.imgUrl || "https://your-image-url.com/default-image.jpg" }}
            style={styles.profileImage}
          />
          <View style={styles.profileDetails}>
            <Text style={styles.userName}>{user.name}</Text>
            <TouchableOpacity onPress={() => navigation.navigate("UpdateProfile")}>
              <Text style={styles.editProfile}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate("WishlistScreen")}>
          <Ionicons name="heart-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Container untuk Riwayat Pesanan dan Pesanan Saya */}
      <View style={styles.sectionContainer}>
        <View style={styles.rowTitle}>
          <Text style={styles.sectionTitle}>Pesanan Saya</Text>
          <TouchableOpacity onPress={() => navigation.navigate("TransactionScreen")}>
            <Text style={styles.riwayatTitle}>Riwayat Pesanan</Text>
          </TouchableOpacity>
        </View>

        {/* Pesanan Saya */}
        <View style={styles.row}>
          {[ 
            { icon: "credit-card", label: `Belum Bayar (${orderStatus.pending})`, color: "#F1948A" },
            { icon: "cube", label: `Dikemas (${orderStatus.dikemas})`, color: "#F7DC6F" },
            { icon: "truck", label: `Dikirim (${orderStatus.dikirim})`, color: "#82E0AA" },
          
          ].map((item, index) => (
            <TouchableOpacity key={index} style={styles.item}>
              <FontAwesome name={item.icon} size={24} color={item.color} />
              <Text style={styles.itemText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

  {/* Container Keuangan */}
  <View style={styles.sectionContainer}>
  <Text style={styles.sectionTitle}>Dompet Saya</Text>
  <View style={styles.rowBetween}>
    {[
      { icon: "money", label: "PayLater", color: "red" },
      { icon: "bank", label: "Bank", color: "red" },
    ].map((item, index) => (
      <TouchableOpacity key={index} style={styles.walletItem}>
        <FontAwesome name={item.icon} size={24} color={item.color} />
        <Text style={styles.itemText}>{item.label}</Text>
      </TouchableOpacity>
    ))}
  </View>
</View>


      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Rekomendasi Produk</Text>
        {products.length > 0 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {products.map((product) => (
              <View key={product._id} style={styles.horizontalCard}>
                <TouchableOpacity onPress={() => handleProductClick(product)}>
                  <Image source={{ uri: product.imgUrl }} style={styles.productImageHorizontal} />
                </TouchableOpacity>
                <View style={styles.cardContent}>
                  <Text style={styles.productName}>{product.name}</Text>
                  <Text style={styles.productPrice}>Rp {product.price.toLocaleString("id-ID")}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        ) : (
          <Text style={styles.noProductsText}>Produk tidak tersedia.</Text>
        )}
      </View>

    <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Bantuan</Text>
            <TouchableOpacity style={styles.helpButton} onPress={() => navigation.navigate("GeminiScreen")}>
              <Ionicons name="chatbubble-ellipses-outline" size={24} color="#fff" />
              <Text style={styles.helpText}>Tanya Gemini AI</Text>
            </TouchableOpacity>
          </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleOnLogOut}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: "#FAF3F3",
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#D7BDE2",
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  profileInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#fff",
  },
  profileDetails: {
    marginLeft: 15,
  },
  userName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#4A235A",
  },
  helpButton: {
    backgroundColor: "#D1C4E9",
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 10,
    justifyContent: "center",
  },
  editProfile: {
    color: "#6C3483",
    fontSize: 14,
    marginTop: 5,
  },
  iconButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 10,
    borderRadius: 50,
  },
  sectionContainer: {
    backgroundColor: "#fff",
    margin: 15,
    padding: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  rowTitle: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  riwayatTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#5B2C6F",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#5B2C6F",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  item: {
    alignItems: "center",
  },
  itemText: {
    marginTop: 8,
    fontSize: 14,
    color: "#7D3C98",
  },
  horizontalCard: {
    width: 140,
    marginRight: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    padding: 10,
  },
  productImageHorizontal: {
    width: "100%",
    height: 100,
    borderRadius: 10,
  },
  cardContent: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#5B2C6F",
  },
  productPrice: {
    fontSize: 14,
    color: "#7D3C98",
    marginTop: 5,
  },
  noProductsText: {
    textAlign: "center",
    color: "#999",
  },
  logoutButton: {
    backgroundColor: "#F5B7B1",
    margin: 20,
    padding: 15,
    borderRadius: 20,
    alignItems: "center",
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  walletItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
  },
  
});
