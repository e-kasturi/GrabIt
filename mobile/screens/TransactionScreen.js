import React, { useState, useEffect, useCallback } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Alert,
  TouchableOpacity,
  Image,
} from "react-native";
import { baseUrl } from "../configs/baseUrl";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
// import { useRoute } from "@react-navigation/native";

export default function TransactionScreen() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const fetchTransactions = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/customers/transactions`);
      if (!response.ok) throw new Error("Failed to fetch transactions");
      const data = await response.json();
      console.log(data, "data");

      setTransactions(data);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Unable to load transactions.");
    } finally {
      setLoading(false);
    }
  };

  const completeOrder = async (transactionId) => {
    try {
      const response = await fetch(
        `${baseUrl}/api/customers/transactions/${transactionId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: "done",
          }),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to complete order");
      }
      const data = await response.json();
      Alert.alert("Success", "Order completed successfully");
      await fetchTransactions();
    } catch (error) {
      console.error(error);
      Alert.alert("Error", error.message || "Failed to complete order");
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchTransactions();
    }, [])
  );

  const handleDelete = async (transactionId) => {
    console.log(transactionId, "transactionId");

    try {
      const response = await fetch(
        `${baseUrl}/api/customers/transactions/${transactionId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete transaction");
      }

      setTransactions((prev) =>
        prev.filter((transaction) => transaction._id !== transactionId)
      );
      const data = await response.json();
      Alert.alert("Success", "Transaction deleted successfully");
    } catch (error) {
      console.log(error);
      Alert.alert("Error", error.message || "Failed to delete Transaction");
    }
  };

  // console.log(transactions, 'transactions');
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Transaction</Text>
      {loading ? (
        <Text>Loading transactions...</Text>
      ) : (
        <FlatList
          onRefresh={() => fetchTransactions()}
          refreshing={loading}
          data={transactions}
          keyExtractor={(item, i) => i}
          renderItem={({ item }) => (
            <View style={styles.transactionCard}>
              <Text style={styles.transactionName}>
                {item.outletDetail.length > 0 && item.outletDetail[0].name}
                {/* {item.outletDetail[0].name} */}
              </Text>
              <Text>
                {item.outletDetail.length > 0 && item.outletDetail[0].address}
                {/* {item.outletDetail[0].name} */}
              </Text>
              <View style={styles.nameContainer}>
                <View style={styles.serviceContainer}>
                  <Text style={styles.service}>Services:</Text>
                  <View style={styles.services}>
                    {item.serviceDetail.map((el, i) => {
                      return (
                        <View key={i} style={{ flexDirection: "row", gap: 10 }}>
                          <Image
                            source={{
                              uri: `https://image.pollinations.ai/prompt/${el.name}with%20wooden%20background%22?width=500&height=500&nologo=true`,
                            }}
                            style={styles.image}
                          />
                          <View style={{ flex: 1 }}>
                            <Text>{el.name}</Text>
                            <Text>Rp.{el.price}</Text>
                          </View>
                          <View>
                            <Text>{item.services[i].quantity || 0} kg</Text>
                            {/* <Text>Rp.{el.price}</Text> */}
                          </View>
                        </View>
                      );
                    })}
                  </View>
                </View>
                <View>
                  <TouchableOpacity
                    style={[
                      styles.buttonDelete,
                      (item.status === "packing" ||
                        item.status === "onprogress" ||
                        item.status === "pickup" ||
                        item.status === "dispatch" ||
                        item.status === "washing" ||
                        item.status === "drying" ||
                        item.status === "ironing") &&
                        styles.buttonDisabled,
                    ]}
                    disabled={
                      item.status === "packing" ||
                      item.status === "onprogress" ||
                      item.status === "pickup" ||
                      item.status === "dispatch" ||
                      item.status === "washing" ||
                      item.status === "drying" ||
                      item.status === "ironing"
                    }
                    onPress={() => handleDelete(item._id)}
                  >
                    <Text style={styles.textDelete}>
                      <FontAwesome6
                        name="trash-can"
                        size={20}
                        color="#cd7171"
                      />
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View>
                <Text style={styles.transactionPrice}>
                  Total Price: Rp. {item.totalAmount}
                </Text>
                <TouchableOpacity
                  style={[
                    styles.buttonConfirm,
                    (item.status === "pending" ||
                      item.status === "packing" ||
                      item.status === "pickup" ||
                      item.status === "dispatch" ||
                      item.status === "washing" ||
                      item.status === "drying" ||
                      item.status === "ironing" ||
                      item.status === "onprogress" ||
                      item.status === "delivered") &&
                      styles.buttonDisabled,
                  ]}
                  disabled={
                    item.status === "pending" ||
                    item.status === "packing" ||
                    item.status === "pickup" ||
                    item.status === "dispatch" ||
                    item.status === "washing" ||
                    item.status === "drying" ||
                    item.status === "ironing" ||
                    item.status === "onprogress" ||
                    item.status === "delivered"
                  }
                  onPress={() => {
                    if (item.status === "deliver") {
                      navigation.navigate("WebView", {
                        paymentLink: item.paymentLink,
                      });
                    }
                  }}
                >
                  <Text style={styles.buttonText}>
                    {item.status === "delivered"
                      ? "Done"
                      : item.status === "deliver"
                      ? "Pay Order"
                      : item.status.charAt(0).toUpperCase() +
                        item.status.slice(1)}
                  </Text>
                </TouchableOpacity>
                {item.status === "paid" && (
                  <TouchableOpacity
                    style={styles.buttonConfirm}
                    onPress={() => completeOrder(item._id)}
                  >
                    <Text style={styles.buttonText}>Complete Order</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
          ListEmptyComponent={<Text>No transactions available.</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgb(170, 200, 210)",
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    marginBottom: 20,
    textAlign: "center",
    color: "rgba(22, 109, 159, 0.9)",
    textShadowColor: "white",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  transactionCard: {
    backgroundColor: "#fff",
    padding: 20,
    marginBottom: 12,
    borderRadius: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  serviceContainer: {
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
    flex: 1,
    marginRight: 10,
  },
  service: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 8,
  },
  services: {
    // marginLeft: 25,
    gap: 10,
  },
  nameContainer: {
    flex: 1,
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  transactionName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  buttonDelete: {
    padding: 5,
    borderRadius: 10,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#cd7171",
  },
  textDelete: {
    color: "white",
  },
  transactionPrice: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2c3e50",
  },
  buttonConfirm: {
    backgroundColor: "rgba(81, 145, 167, 0.9)",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
    width: "100%",
    alignSelf: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonDisabled: {
    backgroundColor: "gray",
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 10,
  },
});
