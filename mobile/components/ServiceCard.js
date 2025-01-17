import { useNavigation, useRoute } from "@react-navigation/native";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import * as SecureStore from "expo-secure-store";
import { baseUrl } from "../configs/baseUrl";
import { useState } from "react";

export default function ServiceCard({
  service,
  setSelectedServices,
  selectedServices,
}) {
  const route = useRoute();
  const navigation = useNavigation();
  const outletId = service.outletId;
  const transactionDate = new Date().toDateString();
  const { userId } = route.params;

  const handleAddService = () => {
    setSelectedServices((prevServices) => [...prevServices, service]);
    Alert.alert("Success", `${service.name} has been added to the list.`);
  };

  const handleAddTransaction = async () => {
    console.log(outletId, userId, "outletId");

    try {
      const token = await SecureStore.getItemAsync("access_token");
      console.log(token, "token");

      if (!token) {
        Alert.alert("Unauthorized", "Please log in to continue.");
        return navigation.navigate("Login");
      }
      const response = await fetch(`${baseUrl}/api/customers/transactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          outletId,
          customerId: userId,
          services: [service],
          transactionDate,
          totalAmount: service.price,
          status: "pending",
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error("Failed to add transaction");
      }
      console.log(data, "data");

      Alert.alert("Success", `Transaction for ${service.name} has been added!`);
      // navigation.navigate("Transactions");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Unable to add transaction. Please try again.");
    }
  };
  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{service.name}</Text>
        <Text style={styles.price}>Price: Rp. {service.price}</Text>
        <Text style={styles.duration}>Duration: {service.duration} Day</Text>
        <Text style={styles.description}>Desc: {service.description}</Text>
      </View>
      <View style={{ width: 70 }}>
        <TouchableOpacity
          disabled={
            selectedServices?.filter((el) => el._id === service._id).length > 0
          }
          onPress={handleAddService}
          style={styles.buttonAdd}
        >
          <Text> + Add</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = {
  container: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: "#ddd",
    overflow: "hidden",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  price: {
    fontSize: 16,
    marginBottom: 5,
  },
  duration: {
    fontSize: 16,
    marginBottom: 5,
  },
  description: {
    fontSize: 16,
    marginBottom: 5,
  },
  buttonAdd: {
    backgroundColor: "rgb(170, 200, 210)",
    padding: 10,
    borderRadius: 10,
  },
};
