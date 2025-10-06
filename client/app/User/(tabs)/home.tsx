// userdashboard.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, useRouter } from "expo-router";


const UserDashboard = () => {
  const router = useRouter();
  const [userName, setUserName] = useState("User");

  // Check auth on mount
  // useEffect(() => {
  //   const checkAuth = async () => {
  //     const token = await AsyncStorage.getItem("token");
  //     const name = await AsyncStorage.getItem("name");
  //     if (!token) {
  //       router.replace("/login"); // redirect to login if no token
  //     }
  //     if (name) setUserName(name);
  //   };
  //   checkAuth();
  // }, []);

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.removeItem("token");
          await AsyncStorage.removeItem("name");
          router.replace("/login");
        },
      },
    ]);
  };

  return (
    <ScrollView className="flex-1 bg-white">
      {/* Header */}
    <View className="bg-yellow-400 p-5 rounded-b-xl h-52">
      {/* Top Row */}
      <View className="flex-row justify-between items-center pt-16">
        <Text className="text-2xl font-bold text-black">Welcome User!</Text>
      </View>
    
      {/* Bottom Button */}
      <View className="flex-1 justify-end items-end">
        <TouchableOpacity className="bg-gray-800 px-3 py-3 rounded-md">
          <Text className="text-white text-xs">This Month ▼</Text>
        </TouchableOpacity>
      </View>
    </View>
    

      {/* Stats Section */}
      <View className="p-4">
        <View className="flex-row flex-wrap justify-between">
          {/* Card 1 */}
          <View className="w-[48%] bg-white rounded-2xl p-6 mb-4 shadow-md">
            <Text className="text-2xl font-bold text-gray-900">2500</Text>
            <View className="flex-row items-center mt-1">
              <Ionicons name="arrow-up-outline" size={16} color="green" />
              <Text className="text-xs text-gray-500 ml-1">Expected Amount</Text>
            </View>
          </View>

          {/* Card 2 */}
          <View className="w-[48%] bg-white rounded-2xl p-6 mb-4 shadow-md">
            <Text className="text-2xl font-bold text-gray-900">1226</Text>
            <View className="flex-row items-center mt-1">
              <Ionicons name="arrow-up-outline" size={16} color="green" />
              <Text className="text-xs text-gray-500 ml-1">Distance</Text>
            </View>
          </View>

          {/* Card 3 */}
          <View className="w-[48%] bg-white rounded-2xl p-6 mb-4 shadow-md">
            <Text className="text-2xl font-bold text-gray-900">09</Text>
            <View className="flex-row items-center mt-1">
              <Ionicons name="arrow-up-outline" size={16} color="green" />
              <Text className="text-xs text-gray-500 ml-1">Hours Spent</Text>
            </View>
          </View>

          {/* Card 4 */}
          <View className="w-[48%] bg-white rounded-2xl p-6 mb-4 shadow-md">
            <Text className="text-2xl font-bold text-gray-900">11</Text>
            <View className="flex-row items-center mt-1">
              <Ionicons name="arrow-down-outline" size={16} color="red" />
              <Text className="text-xs text-gray-500 ml-1">Journeys</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View className="px-4">
        <Text className="font-bold text-base mb-3">Quick Actions</Text>
        <View className="flex-row justify-between">
          <TouchableOpacity
  className="w-[48%] bg-yellow-300 py-4 rounded-2xl shadow-md items-center"
  onPress={() => router.push("/User/newjourney")}
>
  <TouchableOpacity onPress={() => router.push("/User/newjourney")}>
    <Ionicons name="car-outline" size={24} color="black" />
  </TouchableOpacity>
  <Link href="/User/newjourney">
  <Text className="mt-1 font-medium">New Journey</Text>
  </Link>
</TouchableOpacity>

         <TouchableOpacity
      className="w-[48%] bg-yellow-300 py-4 rounded-2xl shadow-md items-center"
      onPress={() => router.push("/User/ExpenseForm")} // <-- navigate to ExpenseForm
    >
      <Ionicons name="cash-outline" size={22} color="black" />
      <Text className="mt-1 font-medium">Add Expense</Text>
    </TouchableOpacity>
        </View>
      </View>

      {/* Recent Activity */}
      <View className="px-4 mt-6">
        <Text className="font-bold text-base mb-3">Recent Activity</Text>

        <View className="flex-row justify-between items-center bg-white p-4 rounded-xl shadow mb-2">
          <View>
            <Text className="text-sm">Expense For Rs. 300</Text>
            <Text className="text-xs text-gray-500">1 hour ago</Text>
          </View>
          <Text className="text-green-600 font-semibold">Approved</Text>
        </View>

        <View className="flex-row justify-between items-center bg-white p-4 rounded-xl shadow mb-2">
          <View>
            <Text className="text-sm">Expense For Rs. 500</Text>
            <Text className="text-xs text-gray-500">2 hours ago</Text>
          </View>
          <Text className="text-red-600 font-semibold">Rejected</Text>
        </View>
      </View>

      {/* Logout Button */}
      {/* <View className="px-4 mt-6">
        <TouchableOpacity
          onPress={handleLogout}
          className="bg-red-500 py-3 rounded-2xl items-center"
        >
          <Text className="text-white font-semibold text-lg">Logout</Text>
        </TouchableOpacity>
      </View> */}

      
    </ScrollView>
  );
};

export default UserDashboard;
