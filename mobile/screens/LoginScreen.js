import { useNavigation } from "@react-navigation/native";
import { useContext, useState } from "react";
import {
  Alert,
  Image,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as Location from "expo-location";
import { baseUrl } from "../configs/baseUrl";
import { AuthContext } from "../contexts/AuthContext";
import * as SecureStore from "expo-secure-store";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");
  const { setIsSignedIn } = useContext(AuthContext);
  const navigation = useNavigation();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "All fields are required!");
      return;
    }
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Error", "Permission to access location was denied");
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      const latitude = location.coords.latitude;
      const longitude = location.coords.longitude;

      await submitLogin(latitude, longitude);
    } catch (error) {
      console.error("Error getting location:", error);
      Alert.alert("Error", "Failed to get location. Please try again.");
    }
  };
  
  const submitLogin = async (lat, long) => {
    try {
      const response = await fetch(
        `${baseUrl}/api/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "string",
          },
          body: JSON.stringify({
            email,
            password,
            role,
            latitude: lat,
            longitude: long,
          }),
        }
      );

      const data = await response.json();
      
      if (response.ok) {
        Alert.alert("Success", "You have logged in successfully!");
        Keyboard.dismiss();
        setIsSignedIn(true);
        await SecureStore.setItemAsync("access_token", data.access_token, data);
      } else {
        Alert.alert("Error", data.message || "Invalid login credentials!");
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error", error.message);
      return;
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
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <Text style={styles.navigation}>Don't have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={styles.navigationLink}>Register</Text>
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
    backgroundColor: "rgb(255, 240, 255)", 
    padding: 10,
    marginBottom: 10,
    borderRadius: 15,
    elevation: 2,
  },
  button: {
    width: "30%",
    backgroundColor: "purple", 
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
    color: "pink", 
    marginTop: 10,
  },
  navigationLink: {
    color: "purple",
    marginTop: 5,
    textDecorationLine: "underline",
  },
});
