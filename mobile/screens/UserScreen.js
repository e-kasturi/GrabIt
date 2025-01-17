import React, { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Alert,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from "react-native";
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

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = await SecureStore.getItemAsync("access_token");
        console.log(token, "token");
      if (!token) {
        Alert.alert("Error", "You are not logged in");
        setIsSignedIn(false);
        return;
      }

      try {
        const response = await fetch(`${baseUrl}/api/customers/profile`, {
          method: 'GET',
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
        console.log(data, "data");

        setUser(data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
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
        <ActivityIndicator size="large" color="#0000ff" />
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
    <View style={styles.container}>
      <Text style={styles.title}>User Profile</Text>
      <View style={styles.profile}>
        <View>
          <Image
            source={{
              uri: `https://avatar.iran.liara.run/public/?username=${user[0].name}`,
            }}
            style={styles.profileImage}
          />
          <Text style={styles.name}>{user[0].name || 'N/A'}</Text>
          <View style={styles.text}>
            <Text>📍 Email: {user[0].email ||"N/A"}</Text>
            <Text>📞 Phone: {user[0].phone}</Text>
            <Text>🏠 Address: {user[0].address}</Text>
          </View>
        </View>
        <View>
          <TouchableOpacity
            onPress={() => navigation.navigate("UpdateProfile")}
          >
            <Text style={styles.detail}>Update</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity onPress={handleOnLogOut}>
        <Text style={styles.logout}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgb(170, 200, 210)",
    paddingTop: 80,
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: "rgba(22, 109, 159, 0.9)",
    textShadowColor: "white",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  profile: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    padding: 10,
    width: "80%",
    borderRadius: 15,
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
    marginTop: 10,
    width: "100%",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  detail: {
    marginTop: 20,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "rgb(170, 200, 210)",
  },
  logout: {
    marginTop: 20,
    borderRadius: 10,
    padding: 10,
    color: "white",
    backgroundColor: "#ff6666",
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 50,
    marginBottom: 10,
    marginTop: 10,
    alignSelf: 'center'
  },
});
