// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   ScrollView,
//   Image,
//   Alert,
//   ActivityIndicator,
// } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { Ionicons } from "@expo/vector-icons";
// import { useRouter } from "expo-router";
// import { Picker } from "@react-native-picker/picker";
// import { getUserProfile, updateUserProfile } from "../../lib/api";

// const AVATAR_STYLES = ["identicon", "adventurer", "bottts", "pixel-art", "thumbs"];

// const EditProfileUser: React.FC = () => {
//   const router = useRouter();
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [avatar, setAvatar] = useState("");
//   const [selectedStyle, setSelectedStyle] = useState<string>("identicon");
//   const [seed, setSeed] = useState<string>("user123");
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);

//   // Fetch user profile
//   useEffect(() => {
//     const loadProfile = async () => {
//       try {
//         const token = await AsyncStorage.getItem("token");
//         if (!token) throw new Error("Unauthorized");
//         const data = await getUserProfile(token);

//         const style = (data && data.style) || "identicon";
//         const seedVal = (data && data.seed) || "user123";

//         setName(data?.name || "");
//         setEmail(data?.email || "");
//         setSelectedStyle(style);
//         setSeed(seedVal);

//         // Use PNG so RN Image can render without svg libs
//         setAvatar(data?.avatar || `https://api.dicebear.com/7.x/${style}/png?seed=${encodeURIComponent(seedVal)}`);
//       } catch (err: unknown) {
//         console.error(err);
//         Alert.alert("Error", err instanceof Error ? err.message : "Failed to fetch profile");
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadProfile();
//   }, []);

//   // Update avatar dynamically when style or seed changes
//   useEffect(() => {
//     setAvatar(`https://api.dicebear.com/7.x/${selectedStyle}/png?seed=${encodeURIComponent(seed)}`);
//   }, [selectedStyle, seed]);

//   const handleSave = async () => {
//     try {
//       setSaving(true);
//       const token = await AsyncStorage.getItem("token");
//       if (!token) throw new Error("Unauthorized");

//       await updateUserProfile({ name, avatar, style: selectedStyle, seed }, token);
//       Alert.alert("Success", "Profile updated successfully!");
//       router.back();
//     } catch (err: unknown) {
//       console.error(err);
//       Alert.alert("Error", err instanceof Error ? err.message : "Failed to update profile");
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (loading) {
//     return (
//       <View className="flex-1 justify-center items-center bg-gray-100">
//         <ActivityIndicator size="large" color="#000" />
//       </View>
//     );
//   }

//   return (
//     <ScrollView className="flex-1 bg-yellow-200" contentContainerStyle={{ paddingBottom: 30 }}>
//       <View className="bg-yellow-300 px-4 py-5 flex-row items-center justify-between shadow-md rounded-b-3xl mb-6">
//         <TouchableOpacity onPress={() => router.back()}>
//           <Ionicons name="arrow-back-outline" size={28} color="black" />
//         </TouchableOpacity>
//         <Text className="text-lg font-bold text-gray-800">Edit Profile</Text>
//         <View style={{ width: 28 }} />
//       </View>

//       <View className="items-center mb-6">
//         <Image
//           source={{ uri: avatar }}
//           className="w-32 h-32 rounded-full bg-gray-300 border-2 border-gray-400"
//         />
//       </View>

//       <Text className="font-semibold text-gray-700 mb-1">Name</Text>
//       <TextInput
//         value={name}
//         onChangeText={setName}
//         placeholder="Enter name"
//         className="border border-gray-300 rounded-lg px-3 py-2 mb-4 bg-white text-gray-800"
//       />

//       <Text className="font-semibold text-gray-700 mb-1">Email</Text>
//       <TextInput
//         value={email}
//         editable={false}
//         className="border border-gray-300 rounded-lg px-3 py-2 mb-4 bg-gray-200 text-gray-600"
//       />

//       <Text className="font-semibold text-gray-700 mb-1">Avatar Style</Text>
//       <View className="border border-gray-300 rounded-lg mb-4 overflow-hidden bg-white">
//         <Picker
//           selectedValue={selectedStyle}
//           onValueChange={(value) => setSelectedStyle(value as string)}
//         >
//           {AVATAR_STYLES.map((style) => (
//             <Picker.Item key={style} label={style} value={style} />
//           ))}
//         </Picker>
//       </View>

//       <Text className="font-semibold text-gray-700 mb-1">Avatar Seed</Text>
//       <TextInput
//         value={seed}
//         onChangeText={setSeed}
//         placeholder="Enter seed"
//         className="border border-gray-300 rounded-lg px-3 py-2 mb-6 bg-white text-gray-800"
//       />

//       <TouchableOpacity
//         onPress={handleSave}
//         disabled={saving}
//         className={`bg-black py-3 rounded-lg items-center ${saving ? "opacity-50" : ""}`}
//       >
//         <Text className="text-white font-bold">{saving ? "Saving..." : "Save"}</Text>
//       </TouchableOpacity>
//     </ScrollView>
//   );
// };

// export default EditProfileUser;

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  Modal,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { getUserProfile, updateUserProfile } from "../../lib/api";

const AVATAR_STYLES = ["identicon", "adventurer", "bottts", "pixel-art", "thumbs"];
const UserProfileWithRouter: React.FC = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedStyle, setSelectedStyle] = useState<string>("identicon");
  const [seed, setSeed] = useState<string>("admin123");
  const [avatar, setAvatar] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch profile
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          Alert.alert("Unauthorized", "Please login again.");
          setLoading(false);
          return;
        }

        const data = await getUserProfile(token);
        const profile = data?.user || data || {};

setName(profile.name || "");
setEmail(profile.email || "");
setSeed(profile.seed || "user123");
setSelectedStyle(profile.style || "identicon");
setAvatar(
  profile.avatar ||
    `https://api.dicebear.com/7.x/${profile.style || "identicon"}/png?seed=${
      profile.seed || "user123"
    }`
);

      } 
      //catch (err: any) {
      //   console.error("Failed to load profile:", err);
      //   Alert.alert("Error", err.message || "Failed to fetch profile");
      //} 
      finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  // Update avatar when style or seed changes
  useEffect(() => {
    setAvatar(`https://api.dicebear.com/7.x/${selectedStyle}/png?seed=${seed}`);
  }, [selectedStyle, seed]);

  // Save profile
  const handleSaveProfile = async () => {
  try {
    setSaving(true);
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      Alert.alert("Unauthorized", "Please login again.");
      return;
    }

    // Remove id from payload
await updateUserProfile({ name, avatar, seed, style: selectedStyle }, token);

    // Refresh profile
    const updatedData = await getUserProfile(token);
    const profile = (updatedData as any)?.user || updatedData || {};

    const style = profile.style || selectedStyle;
    const seedVal = profile.seed || seed;

      setName(profile.name || "");
      setEmail(profile.email || "");
      setSelectedStyle(style);
      setSeed(seedVal);
      setAvatar(profile.avatar || `https://api.dicebear.com/7.x/${style}/png?seed=${encodeURIComponent(seedVal)}`);

    Alert.alert("Success", "Profile updated successfully!"); // ✅ same as Admin
    setShowModal(false);
  } 
  catch (error: unknown) {
    console.error("Error updating profile:", error);
    let message = "Failed to update profile";
    if (error instanceof Error) message = error.message;
    Alert.alert("Error", message);
  } 
  finally {
    setSaving(false);
  }
};


if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="black" />
      </View>
    );
  }

  return (
      <ScrollView className="flex-1 bg-yellow-200">
        {/* Header */}
        <View className="flex-row items-center p-4">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back-outline" size={28} color="black" />
          </TouchableOpacity>
          <Text className="text-xl font-bold ml-4">User Profile</Text>
        </View>
  
        <View className="p-4 items-center">
          {avatar ? (
            <Image source={{ uri: avatar }} className="w-24 h-24 rounded-full bg-gray-400" />
          ) : (
            <View className="w-24 h-24 rounded-full bg-gray-400 justify-center items-center">
              <Text className="text-white text-2xl">👤</Text>
            </View>
          )}
  
          <View className="flex-row items-center mt-2">
            <Text className="text-lg font-bold mr-2">{name}</Text>
            <TouchableOpacity onPress={() => setShowModal(true)}>
              <Ionicons name="create-outline" size={20} color="black" />
            </TouchableOpacity>
          </View>
  
          <Text className="text-sm text-gray-600">{email}</Text>
        </View>
  
        <Modal visible={showModal} animationType="slide" transparent>
          <View className="flex-1 bg-black/40 justify-center items-center px-4">
            <View className="bg-white w-full rounded-2xl p-6 shadow-lg">
              {avatar ? (
                <Image source={{ uri: avatar }} className="w-24 h-24 rounded-full self-center mb-4" />
              ) : (
                <View className="w-24 h-24 rounded-full bg-gray-400 self-center justify-center items-center mb-4">
                  <Text className="text-white text-2xl">👤</Text>
                </View>
              )}
  
              <Text className="mt-2 font-semibold text-gray-700">Select Avatar Style</Text>
              <View className="border border-gray-300 rounded-lg mt-2 mb-4 overflow-hidden">
                <Picker selectedValue={selectedStyle} onValueChange={(value) => setSelectedStyle(value as string)}>
                  {AVATAR_STYLES.map((style) => (
                    <Picker.Item key={style} label={style} value={style} />
                  ))}
                </Picker>
              </View>
  
              <Text className="font-semibold text-gray-700">Avatar Seed</Text>
              <TextInput
                value={seed}
                onChangeText={setSeed}
                placeholder="Enter seed"
                className="border border-gray-300 rounded-lg px-3 py-2 mt-2 mb-4"
              />
  
              <Text className="font-semibold text-gray-700">Name</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Enter name"
                className="border border-gray-300 rounded-lg px-3 py-2 mt-2 mb-6"
              />
  
               <View className="flex-row justify-between">
                            <TouchableOpacity onPress={() => setShowModal(false)} className="px-6 py-2 bg-gray-200 rounded-lg">
                              <Text className="text-gray-800 font-medium">Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleSaveProfile} className={`px-6 py-2 rounded-lg ${saving ? "bg-gray-400" : "bg-black"}`} disabled={saving}>
                              <Text className="text-white font-bold">{saving ? "Saving..." : "Save"}</Text>
                            </TouchableOpacity>
                          </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    );
};

export default UserProfileWithRouter;
