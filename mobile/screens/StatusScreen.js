import { Text, View } from "react-native";

export default function StatusScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Status List</Text>
      <FlatList
        data={Status}
        renderItem={renderProductItem}
        keyExtractor={(item, i) => i()}
      />
    </View>
  );
}