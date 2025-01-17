import React, { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import StatusScreen from "../screens/StatusScreen";

import UserScreen from "../screens/UserScreen";
import UpdateProfileScreen from "../screens/UpdateProfileScreen";
import WebViewScreen from "../screens/WebViewScreen";
import TransactionScreen from "../screens/TransactionScreen";
import TabNav from "./TabNav";
import { AuthContext } from "../contexts/AuthContext";
import { StyleSheet } from "react-native";
import ProductDetailScreen from "../screens/ProductDetailScreen";
import WishlistScreen from "../screens/WishlistScreen";

const Stack = createNativeStackNavigator();

export default function StackNav() {
  const { isSignedIn } = useContext(AuthContext);
  // console.log(isSignedIn, "isSignedIn");

  return (
    <Stack.Navigator>
      {isSignedIn ? (
        <>
          <Stack.Screen
            name="TabHome"
            component={TabNav}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="Status" component={StatusScreen} />
         
          <Stack.Screen name="Profile" component={UserScreen} />
          <Stack.Screen name="UpdateProfile" component={UpdateProfileScreen} />
          <Stack.Screen name="WebView" component={WebViewScreen} />
          <Stack.Screen name="TransactionScreen" component={TransactionScreen} />
          <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
          <Stack.Screen name="WishlistScreen" component={WishlistScreen} />
          
        </>
      ) : (
        <>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{ headerShown: false }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
