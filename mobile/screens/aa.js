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
  });

  const handleOnLogOut = async () => {
    await SecureStore.deleteItemAsync("access_token");
    setIsSignedIn(false);
  };

  const fetchUserProfile = async () => {
    try {
      const token = await SecureStore.getItemAsync("access_token");
      if (!token) {
        Alert.alert("Error", "You are not logged in");
        setIsSignedIn(false);
        return;
      }
      const response = await fetch(`${baseUrl}/api/customers/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setUser(data);

      const transactionResponse = await fetch(`${baseUrl}/api/customers/transactions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const transactionData = await transactionResponse.json();

      const orderCount = {
        pending: transactionData.filter((t) => t.status === "pending").length,
        dikemas: transactionData.filter((t) => t.status === "dikemas").length,
        dikirim: transactionData.filter((t) => t.status === "dikirim").length,
      };
      setOrderStatus(orderCount);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#8E44AD" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.header}>
        <View style={styles.profileSection}>
          <Image
            source={{ uri: user?.imgUrl || "https://your-image-url.com/default-image.jpg" }}
            style={styles.profileImage}
          />
          <View>
            <Text style={styles.userName}>{user?.name}</Text>
            <TouchableOpacity onPress={() => navigation.navigate("UpdateProfile")}>
              <Text style={styles.editProfile}>Edit Profil</Text>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate("WishlistScreen")}>
          <Ionicons name="heart-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Pesanan Saya</Text>
        <View style={styles.row}>
          {[
            { icon: "credit-card", label: `Belum Bayar (${orderStatus.pending})`, color: "#FF6B6B" },
            { icon: "cube", label: `Dikemas (${orderStatus.dikemas})`, color: "#FFD93D" },
            { icon: "truck", label: `Dikirim (${orderStatus.dikirim})`, color: "#6BCB77" },
          ].map((item, index) => (
            <TouchableOpacity key={index} style={styles.orderItem}>
              <FontAwesome name={item.icon} size={24} color={item.color} />
              <Text style={styles.orderText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
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
    backgroundColor: "#F8F9FA",
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
    backgroundColor: "#5B2C6F",
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: "#fff",
    marginRight: 15,
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  editProfile: {
    color: "#D7BDE2",
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#5B2C6F",
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  orderItem: {
    alignItems: "center",
    flex: 1,
    paddingVertical: 10,
  },
  orderText: {
    marginTop: 8,
    fontSize: 14,
    color: "#5B2C6F",
    fontWeight: "bold",
  },
  helpButton: {
    backgroundColor: "#5B2C6F",
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 10,
    justifyContent: "center",
  },
  helpText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 10,
    fontWeight: "bold",
  },
  logoutButton: {
    backgroundColor: "#E74C3C",
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
});
