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
  const [imgUrl, setImgUrl] = useState("");
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

        setName(data.name || '');
        setEmail(data.email || '');
        setAddress(data.address || '');
        setPhone(data.phone || '');
        setImgUrl(data.imgUrl || '');
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
          imgUrl,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to update profile");
      }
      Alert.alert("Success", "Profile updated successfully");
      Keyboard.dismiss();
      navigation.navigate("TabHome", { screen: "Profile" }); 
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
        placeholder="Image"
        value={imgUrl}
        onChangeText={setImgUrl}
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
    backgroundColor: "#FCE4EC", 
    alignItems: "center",
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: "#AB47BC", 
    marginBottom: 50,
  },
  input: {
    backgroundColor: "#FFFFFF",
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
    width: "80%",
    borderWidth: 1,
    borderColor: "#CE93D8", 
    color: "#7B1FA2", 
  },
  update: {
    backgroundColor: "#CE93D8", 
    padding: 10,
    borderRadius: 15,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    width: "50%",
    color: "#FFFFFF", 
    justifyContent: "center",
    alignContent: "center",
    shadowColor: "#000", 
    shadowOpacity: 0.2,
    shadowOffset: { width: 2, height: 2 },
    shadowRadius: 5,
  },
});
