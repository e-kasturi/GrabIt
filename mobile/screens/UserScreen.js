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
import { FontAwesome, MaterialIcons, Ionicons } from "@expo/vector-icons";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigation } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import { baseUrl } from "../configs/baseUrl";

export default function UserScreen() {
  const navigation = useNavigation();
  const { setIsSignedIn } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleOnLogOut = async () => {
    await SecureStore.deleteItemAsync("access_token");
    setIsSignedIn(false);
  };

  const goToOrderHistory = () => {
    navigation.navigate("OrderHistory");
  };

  useEffect(() => {
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
            return;
          }
          throw new Error("Failed to fetch profile");
        }
        const data = await response.json();
        setUser(data);
      } catch (error) {
        Alert.alert("Error", "Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Error: No user data available</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.scrollContainer}>
      {/* Header Section */}
      <View style={styles.header}>
        {/* Profile Info */}
        <View style={styles.profileInfo}>
          <Image
            source={{
              uri: user?.imgUrl || "https://your-image-url.com/default-image.jpg",
            }}
            style={styles.profileImage}
          />
          <View style={styles.profileTextContainer}>
            <Text style={styles.userName}>{user[0]?.name || "User Name"}</Text>
            <Text style={styles.userEmail}>
              {user[0]?.email || "user@example.com"}
            </Text>
          </View>
        </View>
        {/* Chat and Heart Icons */}
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="chatbubble-ellipses-outline" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="heart-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Pesanan Saya Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Pesanan Saya</Text>
        <View style={styles.row}>
          <TouchableOpacity style={styles.item}>
            <FontAwesome name="credit-card" size={24} color="#e74c3c" />
            <Text style={styles.itemText}>Belum Bayar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.item}>
            <FontAwesome name="cube" size={24} color="#f39c12" />
            <Text style={styles.itemText}>Dikemas</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.item}>
            <FontAwesome name="truck" size={24} color="#2ecc71" />
            <Text style={styles.itemText}>Dikirim</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Riwayat Pesanan Button */}
      <TouchableOpacity
        style={styles.historyButton}
        onPress={goToOrderHistory}
      >
        <Text style={styles.historyButtonText}>Riwayat Pesanan</Text>
      </TouchableOpacity>

      {/* Dompet Saya Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Dompet Saya</Text>
        <View style={styles.row}>
          <TouchableOpacity style={styles.item}>
            <MaterialIcons name="account-balance-wallet" size={24} color="#3498db" />
            <Text style={styles.itemText}>PayPay</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleOnLogOut}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: "#f4f4f4",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f39c12",
    padding: 20,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
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
  profileTextContainer: {
    marginLeft: 15, 
  },
  userName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
  },
  userEmail: {
    fontSize: 16,
    color: "#fff",
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    marginLeft: 15,
    backgroundColor: "rgba(255,255,255,0.3)",
    padding: 10,
    borderRadius: 50,
  },
  sectionContainer: {
    backgroundColor: "#fff",
    marginHorizontal: 15,
    marginVertical: 10,
    padding: 15,
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
    marginBottom: 15,
    color: "#2c3e50",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  item: {
    alignItems: "center",
  },
  itemText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "500",
    color: "#34495e",
  },
  historyButton: {
    alignSelf: "center",
    marginTop: 10,
    justifyContent: "center",
  },
  historyButtonText: {
    fontSize: 14,
    color: "#3498db", 
    fontWeight: "bold",
  },
  logoutButton: {
    backgroundColor: "#e74c3c",
    margin: 20,
    marginHorizontal: 15,
    marginVertical: 20,
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
