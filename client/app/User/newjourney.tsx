import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
  Linking,
} from "react-native";
import MapView, { Marker, Polyline, UrlTile, LatLng } from "react-native-maps";
import * as Location from "expo-location";
import { createJourney } from "../../lib/api";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type RootStackParamList = {
  NewJourney: undefined;
  JourneyTracking: { journey: any };
};

type Props = NativeStackScreenProps<RootStackParamList, "NewJourney">;

export default function NewJourney({ navigation }: Props) {
  const [startLocation, setStartLocation] = useState<LatLng | null>(null);
  const [endLocation, setEndLocation] = useState<LatLng | null>(null);
  const [routeCoords, setRouteCoords] = useState<LatLng[]>([]);
  const [purpose, setPurpose] = useState("");
  const [notes, setNotes] = useState("");
  const [region, setRegion] = useState<any>(null);
  const [journeyStartedAt, setJourneyStartedAt] = useState<number | null>(null);

  const mapRef = useRef<MapView>(null);

  const OPENROUTE_API_KEY =
    "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjBlYzA3MmE5N2RkYjQ2OWQ4YzZjYjE5ZDdjMjY2OWM1IiwiaCI6Im11cm11cjY0In0=";

  // Get user location
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permission Denied",
            "Allow location access to pick journey locations"
          );
          return;
        }
        const loc = await Location.getCurrentPositionAsync({});
        const coords = {
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        };
        setStartLocation(coords);
        setRegion({ ...coords, latitudeDelta: 0.05, longitudeDelta: 0.05 });
      } catch {
        Alert.alert("Error", "Failed to get current location");
      }
    })();
  }, []);

  // Fetch route from OpenRouteService
  const fetchRoute = async (start: LatLng, end: LatLng) => {
    try {
      const res = await fetch(
        "https://api.openrouteservice.org/v2/directions/driving-car/geojson",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${OPENROUTE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            coordinates: [
              [start.longitude, start.latitude],
              [end.longitude, end.latitude],
            ],
          }),
        }
      );

      const data = await res.json();
      if (!data.features || !data.features[0]) {
        Alert.alert("Route Error", "Could not get route");
        return;
      }

      const line: LatLng[] = data.features[0].geometry.coordinates.map(
        (c: number[]) => ({ longitude: c[0], latitude: c[1] })
      );
      setRouteCoords(line);

      if (mapRef.current) {
        mapRef.current.fitToCoordinates(line, {
          edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
          animated: true,
        });
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to fetch route");
    }
  };

  useEffect(() => {
    if (startLocation && endLocation) fetchRoute(startLocation, endLocation);
  }, [startLocation, endLocation]);

  // Calculate distance between two points
  const getDistanceFromLatLonInMeters = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const R = 6371e3; // meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  // Journey completion handler
  const handleEndJourney = useCallback(
    (distance: number) => {
      const endTime = Date.now();
      const timeTaken = journeyStartedAt
        ? ((endTime - journeyStartedAt) / 60000).toFixed(2)
        : "N/A";

      Alert.alert(
        "Journey Completed!",
        `Distance: ${(distance / 1000).toFixed(2)} km\nTime Taken: ${timeTaken} mins`
      );
    },
    [journeyStartedAt]
  );

  // Watch user location to detect arrival
  useEffect(() => {
    let watcher: Location.LocationSubscription | null = null;
    if (endLocation) {
      const startWatcher = async () => {
        watcher = await Location.watchPositionAsync(
          { accuracy: Location.Accuracy.Highest, distanceInterval: 5 },
          (loc) => {
            const distance = getDistanceFromLatLonInMeters(
              loc.coords.latitude,
              loc.coords.longitude,
              endLocation.latitude,
              endLocation.longitude
            );
            if (distance < 20) {
              if (watcher) watcher.remove();
              handleEndJourney(distance);
            }
          }
        );
      };
      startWatcher();
    }
    return () => {
      if (watcher) watcher.remove();
    };
  }, [endLocation, handleEndJourney]);

  const handleStartJourney = async () => {
    if (!startLocation || !endLocation || !purpose) {
      return Alert.alert("Please select end location and add purpose");
    }

    setJourneyStartedAt(Date.now());

    try {
      const res = await createJourney({
        title: `Journey: ${startLocation.latitude},${startLocation.longitude} → ${endLocation.latitude},${endLocation.longitude}`,
        description: notes,
        status: "ongoing",
        startLocation,
        endLocation,
        routeCoords,
        purpose,
      });

      if (res.error) return Alert.alert(res.error);

      const url = `https://www.google.com/maps/dir/?api=1&origin=${startLocation.latitude},${startLocation.longitude}&destination=${endLocation.latitude},${endLocation.longitude}&travelmode=driving`;
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        Linking.openURL(url);
      } else {
        Alert.alert("Error", "Cannot open Google Maps");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to start journey");
    }
  };

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={{ padding: 10 }}>
        <Text style={styles.heading}>New Journey</Text>

        <View style={{ height: 400, marginVertical: 10 }}>
          {region ? (
            <MapView
              ref={mapRef}
              style={{ flex: 1 }}
              initialRegion={region}
              showsUserLocation
              showsMyLocationButton
              onPress={(e) => {
                setEndLocation(e.nativeEvent.coordinate);
                Alert.alert("End Location Set");
              }}
            >
              <UrlTile
                urlTemplate={`https://api.openrouteservice.org/mapsurfer/{z}/{x}/{y}.png?api_key=${OPENROUTE_API_KEY}`}
                maximumZ={19}
                flipY={false}
              />
              {startLocation && (
                <Marker coordinate={startLocation} title="Start" pinColor="green" />
              )}
              {endLocation && (
                <Marker coordinate={endLocation} title="End" pinColor="red" />
              )}
              {routeCoords.length > 0 && (
                <Polyline coordinates={routeCoords} strokeColor="blue" strokeWidth={4} />
              )}
            </MapView>
          ) : (
            <Text>Loading map...</Text>
          )}
        </View>

        <Text>
          Start:{" "}
          {startLocation
            ? `${startLocation.latitude}, ${startLocation.longitude}`
            : "Loading"}
        </Text>
        <Text>
          End:{" "}
          {endLocation
            ? `${endLocation.latitude}, ${endLocation.longitude}`
            : "Tap map"}
        </Text>

        <TextInput
          placeholder="Purpose"
          value={purpose}
          onChangeText={setPurpose}
          style={styles.input}
        />
        <TextInput
          placeholder="Notes"
          value={notes}
          onChangeText={setNotes}
          style={styles.input}
        />

        <TouchableOpacity onPress={handleStartJourney} style={styles.buttonBlack}>
          <Text style={styles.buttonText}>Start Journey</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.buttonGray}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  heading: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  input: { borderWidth: 1, padding: 10, marginVertical: 5, borderRadius: 5 },
  buttonBlack: { backgroundColor: "black", padding: 14, borderRadius: 6, marginVertical: 5 },
  buttonGray: { backgroundColor: "gray", padding: 14, borderRadius: 6, marginVertical: 5 },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "bold" },
});
