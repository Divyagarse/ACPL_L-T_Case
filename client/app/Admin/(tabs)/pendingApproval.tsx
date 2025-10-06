import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  getAllExpenses,
  updateExpenseStatus,
  bulkUpdateExpenses,
} from "../../../lib/api";

type Expense = {
  _id: string;
  member: {
    _id: string;
    name: string;
    email: string;
  };
  type: "fuel" | "food" | "accommodation" | "parking" | "miscellaneous";
  amount: number;
  description?: string;
  receiptUrl?: string;
  status: "pendinggggg" | "approved" | "rejected";
};

const PendingApprovals: React.FC = () => {
  const router = useRouter();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);

  // Fetch pending expenses
  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("adminToken");
      if (!token) throw new Error("Unauthorized");

      const data = await getAllExpenses(token, "pending");
      setExpenses(Array.isArray(data.expenses) ? data.expenses : []);
      setSelectedIds([]);
      setSelectAll(false);
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to fetch expenses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      // unselect all
      setSelectedIds([]);
      setSelectAll(false);
    } else {
      // start selection mode (show checkboxes)
      setSelectedIds([]);
      setSelectAll(true);
    }
  };

  const handleUpdate = async (id: string, status: "approved" | "rejected") => {
    try {
      const token = await AsyncStorage.getItem("adminToken");
      if (!token) throw new Error("Unauthorized");

      await updateExpenseStatus(id, status, token);
      fetchExpenses();
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to update status");
    }
  };

  const handleBulkUpdate = async (status: "approved" | "rejected") => {
    if (selectedIds.length === 0)
      return Alert.alert("Please select at least one expense");

    try {
      const token = await AsyncStorage.getItem("adminToken");
      if (!token) throw new Error("Unauthorized");

      await bulkUpdateExpenses(selectedIds, status, token);
      fetchExpenses();
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to update status");
    }
  };

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color="#FFD700"
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      />
    );
  }

  return (
    <ScrollView >
      {/* Select All Toggle */}
        <View className="bg-yellow-400 p-5 flex-row items-center shadow-md">
          <TouchableOpacity
              style={{ marginLeft: 10 }}
              onPress={() => router.push("/Admin/(tabs)/home")}
            >
              <Ionicons name="arrow-back" size={20} color="black" />
            </TouchableOpacity>
        <Text className="ml-3 text-2xl font-bold pt-16  text-black">Pending Approval</Text>
      </View>

      {expenses.length > 0 && (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <View className="p-3">
          <TouchableOpacity
            onPress={toggleSelectAll}
            style={{
              backgroundColor: selectAll ? "black" : "#444",
              padding: 8,
              borderRadius: 4,
            }}
          >
            
            <Text style={{ color: "white", fontWeight: "bold" }}>
              {selectAll ? "Exit" : "Select All"}
            </Text>
          </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Bulk actions */}
      {selectAll && selectedIds.length > 0 && (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginBottom: 16,
          }}
        >
          <TouchableOpacity
            onPress={() => handleBulkUpdate("approved")}
            style={{
              backgroundColor: "black",
              padding: 8,
              borderRadius: 4,
              marginRight: 8,
            }}
          >
            <Text style={{ color: "white", fontWeight: "bold" }}>
              Approve Selected
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => handleBulkUpdate("rejected")}
            style={{ backgroundColor: "grey", padding: 8, borderRadius: 4 }}
          >
            <Text style={{ color: "white", fontWeight: "bold" }}>
              Reject Selected
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Expenses list */}
      {expenses.map((exp) => {
        const isSelected = selectedIds.includes(exp._id);
        return (
          <View
            key={exp._id}
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "white",
              padding: 12,
              marginBottom: 8,
              borderRadius: 6,
              borderWidth: isSelected ? 2 : 0,
              borderColor: isSelected ? "blue" : "transparent",
            }}
          >
            {/* Show checkbox only in selectAll mode */}
            {selectAll && (
              <TouchableOpacity
                onPress={() => toggleSelect(exp._id)}
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 4,
                  borderWidth: 2,
                  borderColor: "gray",
                  marginRight: 12,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: isSelected ? "blue" : "white",
                }}
              >
                {isSelected && (
                  <Text style={{ color: "white", fontWeight: "bold" }}>✓</Text>
                )}
              </TouchableOpacity>
            )}

            {/* Expense Info */}
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                {exp.type}
              </Text>
              <Text>Amount: ₹{exp.amount}</Text>
              <Text>Description: {exp.description || "-"}</Text>
              <Text>
                Submitted by: {exp.member.name} ({exp.member.email})
              </Text>
              <Text>Status: {exp.status}</Text>

              {!selectAll && (
                <View style={{ flexDirection: "row", marginTop: 8, gap: 8 }}>
                  <TouchableOpacity
                    onPress={() => handleUpdate(exp._id, "approved")}
                    style={{
                      backgroundColor: "black",
                      padding: 4,
                      borderRadius: 4,
                    }}
                  >
                    <Text style={{ color: "white" }}>Approve</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleUpdate(exp._id, "rejected")}
                    style={{
                      backgroundColor: "grey",
                      padding: 4,
                      borderRadius: 4,
                    }}
                  >
                    <Text style={{ color: "white" }}>Reject</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        );
      })}

      {expenses.length === 0 && (
        <Text style={{ textAlign: "center", marginTop: 32, color: "#666" }}>
          No pending expenses
        </Text>
      )}
    </ScrollView>
  );
};

export default PendingApprovals;
