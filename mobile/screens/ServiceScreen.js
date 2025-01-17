import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ServiceCard from "../components/ServiceCard";
import { baseUrl } from "../configs/baseUrl";
import * as SecureStore from "expo-secure-store";
import AntDesign from '@expo/vector-icons/AntDesign';

export default function ServiceScreen() {
  const route = useRoute();
  const { outletId, userId } = route.params;
  const [services, setServices] = useState([]);
  const navigation = useNavigation();
  const [selectedServices, setSelectedServices] = useState([]);
  const transactionDate = new Date().toDateString();
  console.log(outletId, 'outletId');
  

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(
          `${baseUrl}/api/outlets/${outletId}/services`
        );
        if (!response.ok) {
          Alert.alert("Services empty");
        }
        const data = await response.json();
        console.log(data, "data");

        setServices(data);
      } catch (error) {
        console.error(error);
        Alert.alert("Error", "services Empty");
      }
    };

    fetchServices();
  }, [outletId]);

  const handleAddTransaction = async () => {
    // console.log("outletId");

    try {
      const token = await SecureStore.getItemAsync("access_token");
      console.log(token, "token");

      if (!token) {
        Alert.alert("Unauthorized", "Please log in to continue.");
        return navigation.navigate("Login");
      }
      console.log(selectedServices);
      // return
      const response = await fetch(`${baseUrl}/api/customers/transactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          outletId,
          customerId: userId,
          services: selectedServices.map((item) => ({ serviceId: item._id })),
          transactionDate,
          totalAmount: 0,
          status: "pending",
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error("Failed to add transaction");
      }
      console.log(data, "data");

      Alert.alert("Success", `Transaction has been added!`);
      setSelectedServices([])
      navigation.navigate("Transaction");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Unable to add transaction. Please try again.");
    }
  };

  const handleCancelSelection = () => {
    setSelectedServices([]);
  };
  console.log(services, 'services');
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Service List</Text>
      <FlatList
        data={services}
        renderItem={({ item }) => (
          <ServiceCard
            service={item}
            setSelectedServices={setSelectedServices}
            selectedServices={selectedServices}
          />
        )}
        keyExtractor={(item, i) => i}
      />
      <View style={styles.confirm}>
        {selectedServices.map((item, i) => {
          return (
            <View style={styles.service} key={i}>
              <Text style={styles.serviceText}>{item.name}</Text>
              <TouchableOpacity
                onPress={handleCancelSelection}
                style={styles.buttonCancel}
              >
                <Text>
                <AntDesign name="delete" size={24} color="red"/>
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}
        <TouchableOpacity
          onPress={handleAddTransaction}
          style={[
            styles.buttonConfirm,
            {
              backgroundColor:
                selectedServices.length === 0 ? "gray" : "rgb(170, 200, 210)",
            },
          ]}
          disabled={selectedServices.length === 0}
        >
          <Text
            style={{
              color: selectedServices.length === 0 ? "white" : "black",
              fontSize: 15,
              textAlign: "center",
            }}
          >
            {selectedServices.length === 0
              ? "No service selected"
              : "Confirm Order"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "rgb(170, 200, 210)",
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: "rgba(22, 109, 159, 0.9)",
    textShadowColor: "white",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  confirm: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 5,
  },
  buttonConfirm: {
    backgroundColor: "tomato",
    padding: 10,
    borderRadius: 10,
    width: "50%",
    alignSelf: "center",
  },
  buttonCancel: {
    padding: 5,
    borderRadius: 10,
    width: '17%',
  },
  service: {
    backgroundColor: "white",
    padding:5,
    marginBottom: 3,
    borderRadius: 8,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: "#ddd",
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  serviceText: {
    color: "black",
    fontSize: 20,
  },
});
