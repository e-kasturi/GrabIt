import { StyleSheet, View } from "react-native";
import OutletScreen from "./OutletScreen";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <OutletScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgb(170, 200, 210)",
  }
});