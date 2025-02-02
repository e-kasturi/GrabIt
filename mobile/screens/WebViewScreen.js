import { useNavigation, useRoute } from "@react-navigation/native";
import { WebView } from "react-native-webview";
import { StyleSheet, Text, View } from "react-native";
import Constants from 'expo-constants';

export default function WebViewScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const paymentLink = route.params?.paymentLink; 
  console.log(paymentLink, "paymentLink"); 
  if (!paymentLink) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Invalid Payment Link</Text>
      </View>
    );
  }

  const handlePaymentStatus = (newNavState) => {
    const { url } = newNavState;
    console.log(url, "url");

    if (!url) return;

    if (url.includes("message=success") || url.includes("409")) {
      navigation.navigate("Transaction");
    }
  };

  return (
    <WebView
      style={styles.container}
      source={{ uri: paymentLink }}
      onNavigationStateChange={handlePaymentStatus}
      onError={(err) => console.log("WebView error: ", err)}  
      onHttpError={(e) => console.log("HTTP error: ", e)}  
      javaScriptEnabled={true}
      domStorageEnabled={true}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 18,
  },
});
