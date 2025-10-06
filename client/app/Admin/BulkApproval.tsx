// BulkApproval.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Checkbox from "expo-checkbox";
import { Link, useRouter } from "expo-router";

export default function BulkApproval() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [selected, setSelected] = useState<number[]>([]);

  const approvals = [
    { id: 1, purpose: "Purpose", date: "4th September 2025", submittedBy: "User", amount: "Rs. 30" },
    { id: 2, purpose: "Purpose", date: "4th September 2025", submittedBy: "User", amount: "Rs. 30" },
    { id: 3, purpose: "Purpose", date: "4th September 2025", submittedBy: "User", amount: "Rs. 30" },
  ];

  const toggleSelect = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <View className="flex-1 bg-gray-100" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="bg-[#FCD96F] px-4 py-3 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color="black" />
          </TouchableOpacity>
          <Text className="ml-3 font-bold text-lg text-black">Pending Approvals</Text>
        </View>
        <TouchableOpacity>
          <Ionicons name="filter-outline" size={22} color="black" />
        </TouchableOpacity>
      </View>

      {/* Scrollable List */}
      <ScrollView contentContainerStyle={{ paddingBottom: 140 }}>
        {approvals.map((item) => (
          <View
            key={item.id}
            className="bg-white rounded-xl shadow-sm p-4 mx-4 mt-4 flex-row"
          >
            {/* Checkbox */}
            <TouchableOpacity
              onPress={() => toggleSelect(item.id)}
              className="justify-center mr-3"
            >
              <Checkbox
                value={selected.includes(item.id)}
                onValueChange={() => toggleSelect(item.id)}
                color={selected.includes(item.id) ? "#000" : undefined}
              />
            </TouchableOpacity>

            {/* Approval Card */}
            <View className="flex-1">
              <View className="flex-row justify-between">
                <View>
                  <Text className="text-yellow-600 font-medium">Expense Type</Text>
                  {/* Navigate to details on tap */}
                  <Link href="/Admin/ExpenseDetails" asChild>
                    <TouchableOpacity>
                      <Text className="text-black font-bold underline">{item.purpose}</Text>
                    </TouchableOpacity>
                  </Link>
                  <Text className="text-gray-600 text-sm mt-1">{item.date}</Text>
                  <Text className="text-gray-600 text-sm mt-1">
                    Submitted By: {item.submittedBy}
                  </Text>
                </View>
                <Text className="font-bold text-black">{item.amount}</Text>
              </View>

              {/* Approve / Deny */}
              <View className="flex-row mt-3 space-x-3">
                <TouchableOpacity className="flex-row items-center bg-black px-4 py-2 rounded-lg flex-1 justify-center">
                  <Ionicons name="checkmark" size={16} color="white" />
                  <Text className="text-white font-semibold text-sm ml-2">Approve</Text>
                </TouchableOpacity>

                <TouchableOpacity className="flex-row items-center border border-gray-400 px-4 py-2 rounded-lg flex-1 justify-center">
                  <Ionicons name="close" size={16} color="black" />
                  <Text className="text-black font-semibold text-sm ml-2">Deny</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Approve All / Deny All */}
      <View
        className="absolute left-0 right-0 flex-row px-4 space-x-3 bg-white pt-3"
        style={{ bottom: insets.bottom + 10 }}
      >
        <TouchableOpacity className="flex-1 bg-black py-3 rounded-lg items-center">
          <Text className="text-white font-semibold">Approve All</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-1 border border-gray-400 py-3 rounded-lg items-center">
          <Text className="text-black font-semibold">Deny All</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
