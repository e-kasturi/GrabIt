import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Linking, Alert } from "react-native";

export default function Card({ outlet }) {
  const navigation = useNavigation();

  const handleOpenMaps = () => {
    navigation.navigate("OutletScreen", {
      latitude: outlet.latitude,
      longitude: outlet.longitude,
      name: outlet.name,
    });
  };

  const handlePressName = () => {
    navigation.navigate("Service", { outletId: outlet._id });
  }

  return (
    <TouchableOpacity onPress={handlePressName} >
      <View style={styles.card}>
      <TouchableOpacity style={styles.header} onPress={handleOpenMaps}>
        <Text style={styles.laundryName}>{outlet.name}</Text>
      </TouchableOpacity>
      <View style={styles.body}>
        <Text style={styles.laundryDetails}>
          📍 Address: {outlet.address}
        </Text>
        <Text style={styles.laundryDetails}>
          📞 Phone: {outlet.phone}
        </Text>
        <Text style={styles.laundryDetails}>
          👤 PIC: {outlet.picName}
        </Text>
      </View>
    </View>
    </TouchableOpacity>
    
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: "#ddd",
    overflow: "hidden",
  },
  header: {
    backgroundColor: "rgba(170, 200, 200, 0.3)",
    padding: 8,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: "center",
    borderRadius: 15,
    width: "50%",
  },
  laundryName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "rgba(22, 109, 159, 0.9)",
  },
  body: {
    flexDirection: "column",
  },
  laundryDetails: {
    fontSize: 14,
    color: "#444",
    marginVertical: 5,
    lineHeight: 20,
  },
});
