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

export default function TransactionScreen() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const fetchTransactions = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/customers/transactions`);
      if (!response.ok) throw new Error("Failed to fetch transactions");
      const data = await response.json();
      console.log(data, "All transactions fetched");
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
            status: "selesai",
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

  const handlePayment = async (item) => {
    if (item.paymentLink) {
      navigation.navigate("WebView", {
        paymentLink: item.paymentLink,
      });
    } else {

      try {
        const response = await fetch(`${baseUrl}/api/midtrans`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            totalAmount: item.totalAmount,
            transactionId: item._id,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to generate payment link");
        }

        const data = await response.json();
        if (data.paymentLink) {
          navigation.navigate("WebView", {
            paymentLink: data.paymentLink,
          });
        } else {
          Alert.alert("Error", "Failed to generate payment link from Midtrans");
        }
      } catch (error) {
        console.error(error);
        Alert.alert("Error", error.message || "Failed to generate payment link");
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Transaction</Text>
      {loading ? (
        <Text style={styles.loadingText}>Loading transactions...</Text>
      ) : (
        <FlatList
          onRefresh={fetchTransactions}
          refreshing={loading}
          data={transactions}
          keyExtractor={(item) => item._id?.toString() || item._id}
          renderItem={({ item }) => (
            <View style={styles.transactionCard}>
              <Text style={styles.transactionName}>
                {item.outletDetail?.[0]?.nameOutlet || "No Outlet"}
              </Text>
              <Text style={styles.transactionAddress}>
                {item.outletDetail?.[0]?.address || "No Address"}
              </Text>

              <View style={styles.nameContainer}>
                <View style={styles.productsContainer}>
                  <Text style={styles.products}>Products:</Text>
                  {item.productDetail && item.productDetail.length > 0 ? (
                    <View style={styles.productList}>
                      {item.productDetail.map((el, i) => (
                        <View key={i} style={styles.productItem}>
                          <Image
                            source={{
                              uri: el.imgUrl || item.productDetail?.imgUrl,
                            }}
                            style={styles.image}
                          />
                          <View style={styles.productInfo}>
                            <Text style={styles.productName}>{el.name}</Text>
                            <Text style={styles.productPrice}>Rp.{el.price}</Text>
                          </View>
                          <View style={styles.quantityContainer}>
                            <Text style={styles.productQuantity}>
                              {item.products?.[i]?.quantity || 0} pcs
                            </Text>
                          </View>
                        </View>
                      ))}
                    </View>
                  ) : (
                    <Text style={styles.noProducts}>No products available</Text>
                  )}
                </View>

                <Text style={styles.transactionPrice}>
                  Total Price: Rp. {item.totalAmount}
                </Text>

                <TouchableOpacity
                  style={[
                    styles.buttonConfirm,
                    (item.status === "dikemas" ||
                      item.status === "dikirim" ||
                      item.status === "selesai" ||
                      item.status === "pengembalian" ||
                      item.status === "dibatalkan") &&
                      styles.buttonDisabled,
                  ]}
                  disabled={
                    item.status === "dikemas" ||
                    item.status === "dikirim" ||
                    item.status === "selesai" ||
                    item.status === "pengembalian" ||
                    item.status === "dibatalkan"
                  }
                  onPress={() => handlePayment(item)}
                >
                  <Text style={styles.buttonText}>
                    {item.status === "pending" || item.status === "paid"
                      ? "Bayar"
                      : item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </Text>
                </TouchableOpacity>

                {item.status === "selesai" && (
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
          ListEmptyComponent={
            <Text style={styles.noTransactions}>No transactions available.</Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF0F5",
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    marginBottom: 20,
    textAlign: "center",
    color: "#BA68C8",
    textShadowColor: "white",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  loadingText: {
    fontSize: 18,
    textAlign: "center",
    color: "rgb(128, 0, 128)",
  },
  transactionCard: {
    backgroundColor: "#fff",
    padding: 20,
    marginBottom: 12,
    borderRadius: 16,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  transactionName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#BA68C8",
  },
  transactionAddress: {
    fontSize: 16,
    color: "#555",
    marginBottom: 12,
  },
  nameContainer: {
    flex: 1,
    marginTop: 10,
  },
  productsContainer: {
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
  },
  products: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    color: "#333",
  },
  productList: {
    marginTop: 10,
  },
  productItem: {
    flexDirection: "row",
    gap: 15,
    marginBottom: 15,
    alignItems: "center",
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 10,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  productPrice: {
    fontSize: 14,
    color: "#666",
  },
  quantityContainer: {
    alignItems: "flex-end",
  },
  productQuantity: {
    fontSize: 14,
    color: "#333",
  },
  noProducts: {
    fontSize: 16,
    color: "#999",
  },
  noTransactions: {
    fontSize: 18,
    color: "#999",
    textAlign: "center",
    marginTop: 20,
  },
  buttonConfirm: {
    backgroundColor:"#D1C4E9",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: "#ddd",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
