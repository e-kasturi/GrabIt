import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  Keyboard,
} from "react-native";
import { baseUrl } from "../configs/baseUrl";
import * as Location from "expo-location";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");
  const [phone, setPhone] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const navigation = useNavigation();

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Error", "Location permission is required to register!");
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      setLatitude(location.coords.latitude);
      setLongitude(location.coords.longitude);
    } catch (error) {
      console.error("Failed to get current location:", error);
      Alert.alert("Error", "Unable to fetch location. Please try again.");
    }
  };

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert("Error", "All fields are required!");
      return;
    }

    try {
      await getCurrentLocation();

      if (!latitude || !longitude) {
        Alert.alert("Success", "Location is required to complete registration!");
        return;
      }
      const response = await fetch(`${baseUrl}/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
          imgUrl,
          phone,
          address,
          latitude,
          longitude,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setName("");
        setEmail("");
        setPassword("");
        setRole("customer");
        setPhone("");
        setImgUrl("");
        setAddress("");
        setLatitude(null);
        setLongitude(null);
        Keyboard.dismiss();
        navigation.navigate("Login");
        Alert.alert("Success", "You have registered successfully!");
      } else {
        navigation.navigate("Register");
        Alert.alert("Error", data.message || "Something went wrong");
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require("../assets/logo.jpg")} style={styles.image} />
      <View>
        <Text style={styles.title}>GrabIt</Text>
      </View>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          value={phone}
          onChangeText={setPhone}
        />
        <TextInput
          style={styles.input}
          placeholder="Address"
          value={address}
          onChangeText={setAddress}
        />
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
        <Text style={styles.navigation}>Already have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.navigationLink}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 100,
  },
  form: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    width: "80%",
    padding: 10,
    borderRadius: 15,
    backgroundColor: "rgb(255, 240, 255)", // Pink Muda
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: "purple",
    textShadowColor: "pink",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  input: {
    width: "100%",
    backgroundColor: "rgb(255, 255, 255)", // Putih
    padding: 10,
    marginBottom: 10,
    borderRadius: 15,
    elevation: 2,
    borderColor: "rgb(255, 182, 193)", // Pink Border
    borderWidth: 1,
  },
  button: {
    width: "30%",
    backgroundColor: "purple", // Ungu
    padding: 6,
    alignItems: "center",
    borderRadius: 15,
    marginTop: 10,
    marginBottom: 10,
    borderColor: "rgba(249, 251, 253, 0.9)",
    elevation: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  navigation: {
    color: "pink", // Pink
    marginTop: 10,
  },
  navigationLink: {
    color: "purple", // Ungu
    marginTop: 5,
    textDecorationLine: "underline",
  },
});
