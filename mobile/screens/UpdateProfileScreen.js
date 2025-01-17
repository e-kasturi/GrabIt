import { useNavigation } from "@react-navigation/native";
import { useContext, useEffect, useState } from "react";
import {
  Alert,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { AuthContext } from "../contexts/AuthContext";
import * as SecureStore from "expo-secure-store";
import { baseUrl } from "../configs/baseUrl";

export default function UpdateProfileScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const { setIsSignedIn } = useContext(AuthContext);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await SecureStore.getItemAsync("access_token");
        if (!token) {
          Alert.alert("Error", "You are not logged in");
          navigation.navigate("Login");
          return;
        }

        const response = await fetch(`${baseUrl}/api/customers/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }

        const data = await response.json();
        console.log(data, "data 1");
        
        setName(data[0].name || '');
        setEmail(data[0].email || "");
        setAddress(data[0].address || "");
        setPhone(data[0].phone || "");
      } catch (error) {
        console.error("Error fetching profile:", error);
        Alert.alert("Error", "Failed to fetch profile");
      }
    };

    fetchProfile();
  }, [navigation]);

  const handleUpdate = async () => {
    if (!name || !email || !address || !phone) {
      Alert.alert("Error", "All fields are required!");
      return;
    }
    try {
      const token = await SecureStore.getItemAsync("access_token");
      const response = await fetch(`${baseUrl}/api/customers/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          address,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to update profile");
      }
      Alert.alert("Success", "Profile updated successfully");
      Keyboard.dismiss()
      navigation.navigate("Profile");
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "Failed to update profile");
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Update Profile</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone"
        value={phone}
        onChangeText={setPhone}
      />
      <TextInput
        style={styles.input}
        placeholder="Address"
        value={address}
        onChangeText={setAddress}
      />
      <TouchableOpacity onPress={handleUpdate}>
        <Text style={styles.update}>Update</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "rgb(170, 200, 210)",
    alignItems: "center",
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    marginBottom: 50,
  },
  input: {
    backgroundColor: "white",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    width: "80%",
  },
  update: {
    backgroundColor: "rgba(247, 249, 249, 0.69)",
    padding: 5,
    borderRadius: 5,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    width: "30%",
    justifyContent: "center",
    alignContent: "center",
  },
});
