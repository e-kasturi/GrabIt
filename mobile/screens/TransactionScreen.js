import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import { RadioButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import { baseUrl } from "../configs/baseUrl";

export default function TransactionScreen() {
  const [transactions, setTransactions] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState({});
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const fetchTransactions = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/customers/transactions`);
      if (!response.ok) throw new Error("Failed to fetch transactions");
      const data = await response.json();
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
      Alert.alert("Success", "Order completed successfully");
      await fetchTransactions();
    } catch (error) {
      console.error(error);
      Alert.alert("Error", error.message || "Failed to complete order");
    }
  };

  const handleDelete = async (transactionId) => {
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
      Alert.alert("Success", "Transaction deleted successfully");
    } catch (error) {
      console.log(error);
      Alert.alert("Error", error.message || "Failed to delete Transaction");
    }
  };

  const toggleProductSelection = (productId) => {
    setSelectedProducts((prevState) => {
      const newSelection = { ...prevState, [productId]: !prevState[productId] };
      return newSelection;
    });
  };

  const toggleSelectAll = () => {
    const allSelected = !selectAllChecked;
    setSelectAllChecked(allSelected);
    setSelectedProducts(
      transactions.reduce((acc, transaction) => {
        transaction.products.forEach((product) => {
          acc[product._id] = allSelected;
        });
        return acc;
      }, {})
    );
  };

  const checkout = () => {
    const selectedTransactionIds = Object.keys(selectedProducts).filter(
      (productId) => selectedProducts[productId]
    );
    if (selectedTransactionIds.length === 0) {
      Alert.alert("No products selected", "Please select at least one product to proceed.");
      return;
    }
    // Implement checkout logic here
    Alert.alert("Checkout", "Proceeding with the checkout.");
  };

  useFocusEffect(
    useCallback(() => {
      fetchTransactions();
    }, [])
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Transaction Details</Text>

      {transactions.map((transaction) => (
        <View key={transaction._id} style={styles.productItem}>
          <Text style={styles.outletName}>Outlet: {transaction.outletName || "Unknown"}</Text>
          {transaction.products.map((product) => (
            <View key={product._id} style={styles.productRow}>
              <RadioButton
                value={product._id}
                status={selectedProducts[product._id] ? 'checked' : 'unchecked'}
                onPress={() => toggleProductSelection(product._id)}
                color="#3498db"
              />
              <Text style={styles.productName}>{product.name}</Text>
              <TouchableOpacity
                style={styles.trashIcon}
                onPress={() => handleDelete(transaction._id)}
              >
                <Icon name="trash" size={20} color="#e74c3c" />
              </TouchableOpacity>
            </View>
          ))}
          <Text style={styles.productPrice}>
            Rp. {transaction.totalAmount.toLocaleString('id-ID')}
          </Text>
        </View>
      ))}

      <Text style={styles.totalAmount}>Total: Rp. {transactions.reduce((total, transaction) => total + transaction.totalAmount, 0).toLocaleString('id-ID')}</Text>

      <View style={styles.checkoutRow}>
        <View style={styles.selectAllRow}>
          <RadioButton
            value="selectAll"
            status={selectAllChecked ? 'checked' : 'unchecked'}
            onPress={toggleSelectAll}
            color="#3498db"
          />
          <Text style={styles.selectAllText}>Select All</Text>
        </View>

        <TouchableOpacity style={styles.completeButton} onPress={checkout}>
          <Text style={styles.buttonText}>Checkout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f8f8f8',
  },
  outletName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#2980b9",
    marginBottom: 6,
    marginLeft: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginVertical: 20,
    textAlign: "center",
    color: "#2c3e50",
  },
  selectAllRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    marginLeft: 10,
  },
  selectAllText: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 10,
    color: "#34495e",
  },
  productItem: {
    backgroundColor: "#fff",
    padding: 18,
    marginBottom: 12,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
    marginHorizontal: 10,
  },
  productRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    justifyContent: 'space-between',
  },
  productName: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 12,
    color: "#34495e",
    flex: 1,
  },
  trashIcon: {
    padding: 6,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "500",
    color: "#e74c3c",
    marginLeft: 38,
  },
  totalAmount: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 20,
    textAlign: "center",
    color: "#2ecc71",
  },
  completeButton: {
    backgroundColor: "#2ecc71",
    paddingVertical: 15,
    marginTop: 30,
    marginBottom: 20,
    borderRadius: 12,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  buttonText: {
    marginLeft: 12,
    color: "#fff",
    fontSize: 18,
    fontWeight: "500",
  },
  checkoutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 30,
  },
});

