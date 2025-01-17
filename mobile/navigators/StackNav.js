import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ServiceScreen from "../screens/ServiceScreen";
import OutletDetailScreen from "../screens/StatusScreen";
import StatusScreen from "../screens/StatusScreen";
import UserScreen from "../screens/UserScreen";
import TabNav from "./TabNav";
import UpdateProfileScreen from "../screens/UpdateProfileScreen";
import { useContext} from "react";
import {StyleSheet} from "react-native";
import OutletScreen from "../screens/OutletScreen";
import { AuthContext } from "../contexts/AuthContext";
import WebViewScreen from "../screens/WebViewScreen";
import TransactionScreen from "../screens/TransactionScreen";

const Stack = createNativeStackNavigator();

export default function StackNav() {
  const { isSignedIn } = useContext(AuthContext);
  // console.log(isSignedIn, "isSignedIn");
  
  return (
    <Stack.Navigator >
      {/* <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          /> */}
      {isSignedIn ? (
        <>
          <Stack.Screen
            name="Home"
            component={TabNav}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="Status" component={StatusScreen} />
          <Stack.Screen name="OutletDetail" component={OutletDetailScreen} />
          <Stack.Screen name="Service" component={ServiceScreen} />
          <Stack.Screen
            name="Profile"
            component={UserScreen}
            // options={{ headerShown: false }}
          />
          <Stack.Screen
            name="UpdateProfile"
            component={UpdateProfileScreen}
            // options={{ headerShown: false }}
          />
          <Stack.Screen
          name="OutletScreen"
          component={OutletScreen}
          // options={{ headerShown: false }}
          />
          <Stack.Screen
          name="WebView"
          component={WebViewScreen}
          // options={{ headerShown: false }}
          />
          <Stack.Screen
          name="Transaction"
          component={TransactionScreen}
          // options={{ headerShown: false }}
          />
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
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
