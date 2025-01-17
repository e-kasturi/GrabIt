import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  Alert,
  StyleSheet,
  Dimensions,
  TextInput,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import Card from "../components/Card";
import { baseUrl } from "../configs/baseUrl";
import { useNavigation } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import { AuthContext } from "../contexts/AuthContext";

export default function OutletScreen({ route }) {
  const { setIsSignedIn } = useContext(AuthContext);
  const { latitude, longitude } = route.params || {};
  const [outlets, setOutlets] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredOutlets, setFilteredOutlets] = useState([]);
  const [userLocation, setUserLocation] = useState({
    latitude: -6.2, //jakarta
    longitude: 106.816666,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  });

  useEffect(() => {
    const getLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission denied",
          "Location permission is required to use this feature."
        );
        // return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      });
    };

    if (!latitude && !longitude) {
      getLocation();
    } else {
      setUserLocation({
        latitude,
        longitude,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      });
    }

    const fetchOutlets = async () => {
      const token = await SecureStore.getItemAsync("access_token");
      try {
        const response = await fetch(`${baseUrl}/api/outlets`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            Alert.alert("Session expired", "Please log in again.");
            setIsSignedIn(false);
            return;
          }
        }

        const data = await response.json();
        const sortedOutlets = data.sort(
          (a, b) =>
            haversineDistance(userLocation, a) -
            haversineDistance(userLocation, b)
        );

        setOutlets(sortedOutlets);
        setFilteredOutlets(sortedOutlets);
      } catch (error) {
        console.error(error);
        Alert.alert("Error", "Failed to load Outlets");
      }
    };

    fetchOutlets();
  }, [latitude, longitude]);

  const haversineDistance = (coords1, coords2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371; // Radius of Earth in km

    const dLat = toRad(coords2.latitude - coords1.latitude);
    const dLon = toRad(coords2.longitude - coords1.longitude);
    const lat1 = toRad(coords1.latitude);
    const lat2 = toRad(coords2.latitude);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  };

  const handleSearch = (query) => {
    setSearchQuery(query);

    const filtered = outlets
      .filter((outlet) =>
        outlet.name.toLowerCase().includes(query.toLowerCase())
      )
      // .sort(
      //   (a, b) =>
      //     haversineDistance(userLocation, a) -
      //     haversineDistance(userLocation, b)
      // );

    setFilteredOutlets(filtered);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Outlet List</Text>
      <MapView style={styles.map} region={userLocation}>
        <Marker
          coordinate={{
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
          }}
          title="You are here"
          pinColor="red"
        />
        {Array.isArray(filteredOutlets) &&
          filteredOutlets.map((outlet, index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: outlet.latitude,
                longitude: outlet.longitude,
              }}
              title={outlet.name}
              description={outlet.address}
            />
          ))}
      </MapView>
      <TextInput
        style={styles.searchInput}
        placeholder="Search by outlet name..."
        value={searchQuery}
        onChangeText={handleSearch}
      />
      <FlatList
        data={filteredOutlets}
        renderItem={({ item }) => <Card outlet={item} />}
        keyExtractor={(item, i) => i}
        onEndReached={() => {
          <View>
            <Text>Next Page</Text>
          </View>;
          console.log("next page please");
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
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
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
  },
  map: {
    height: 200,
    width: "100%",
    marginBottom: 10,
    borderRadius: 15,
    borderColor: "rgba(255, 254, 254)",
    borderWidth: 5,
  },
  searchInput: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: "white",
  },
});
