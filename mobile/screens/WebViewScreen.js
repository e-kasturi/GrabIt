import { useNavigation, useRoute } from "@react-navigation/native";
import { WebView } from "react-native-webview";
import { StyleSheet } from "react-native";
import Constants from 'expo-constants';

export default function WebViewScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  // console.log(route);
  const paymentLink = route.params.paymentLink;
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
      onNavigationStateChange={handlePaymentStatus}
      source={{ uri: paymentLink }}
    />
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
      marginTop: Constants.statusBarHeight,
  },
});
