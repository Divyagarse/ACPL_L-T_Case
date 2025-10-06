// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   ScrollView,
//   Image,
//   Alert,
//   Modal,
// } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { Ionicons } from "@expo/vector-icons";
// import { Picker } from "@react-native-picker/picker";
// import { getUserProfile, updateUserProfile } from "../../../lib/api";

// const AVATAR_STYLES = ["identicon", "adventurer", "bottts", "pixel-art", "thumbs"];

// const UserProfile: React.FC = () => {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [avatar, setAvatar] = useState("");
//   const [selectedStyle, setSelectedStyle] = useState<string>("identicon");
//   const [seed, setSeed] = useState<string>("user123");
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [showModal, setShowModal] = useState(false);

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

//   // Update avatar dynamically
//   useEffect(() => {
//     setAvatar(`https://api.dicebear.com/7.x/${selectedStyle}/png?seed=${encodeURIComponent(seed)}`);
//   }, [selectedStyle, seed]);

//   // Save profile changes
//   const handleSave = async () => {
//     try {
//       setSaving(true);
//       const token = await AsyncStorage.getItem("token");
//       if (!token) throw new Error("Unauthorized");

//       await updateUserProfile({ name, avatar, style: selectedStyle, seed }, token);
//       Alert.alert("Success", "Profile updated successfully!");
//       setShowModal(false);
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
//         <Text>Loading...</Text>
//       </View>
//     );
//   }

//   return (
//     <ScrollView className="flex-1 bg-gray-100 p-4">
//       {/* Profile Info */}
//       <View className="items-center mb-6">
//         <Image
//           source={{ uri: avatar }}
//           className="w-32 h-32 rounded-full bg-gray-300 border-2 border-gray-400"
//         />
//         <View className="flex-row items-center mt-2">
//           <Text className="text-lg font-bold mr-2">{name}</Text>
//           <TouchableOpacity onPress={() => setShowModal(true)}>
//             <Ionicons name="create-outline" size={20} color="black" />
//           </TouchableOpacity>
//         </View>
//         <Text className="text-sm text-gray-600">{email}</Text>
//       </View>

//       {/* Edit Modal */}
//       <Modal visible={showModal} animationType="slide" transparent>
//         <View className="flex-1 justify-center items-center bg-black/50">
//           <View className="bg-white w-11/12 rounded-lg p-5">
//             <Text className="font-bold text-lg mb-4">Edit Profile</Text>

//             <Text className="font-semibold mb-1">Name</Text>
//             <TextInput
//               value={name}
//               onChangeText={setName}
//               className="border border-gray-300 rounded px-3 py-2 mb-3"
//             />

//             <Text className="font-semibold mb-1">Avatar Style</Text>
//             <View className="mb-3">
//               <Picker
//                 selectedValue={selectedStyle}
//                 onValueChange={(value) => setSelectedStyle(value as string)}
//               >
//                 {AVATAR_STYLES.map((style) => (
//                   <Picker.Item key={style} label={style} value={style} />
//                 ))}
//               </Picker>
//             </View>

//             <Text className="font-semibold mb-1">Avatar Seed</Text>
//             <TextInput
//               value={seed}
//               onChangeText={setSeed}
//               className="border border-gray-300 rounded px-3 py-2 mb-4"
//             />

//             <View className="flex-row justify-end">
//               <TouchableOpacity
//                 onPress={() => setShowModal(false)}
//                 className="mr-3 px-4 py-2 border rounded"
//               >
//                 <Text>Cancel</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 onPress={handleSave}
//                 disabled={saving}
//                 className={`px-4 py-2 rounded bg-black ${saving ? "opacity-50" : ""}`}
//               >
//                 <Text className="text-white">{saving ? "Saving..." : "Save"}</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </ScrollView>
//   );
// };

// export default UserProfile;



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
import { getUserProfile, updateUserProfile } from "../../../lib/api";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";

const AVATAR_STYLES = ["identicon", "adventurer", "bottts", "pixel-art", "thumbs"];

const UserProfile: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("identicon");
  const [seed, setSeed] = useState("user123");
  const [avatar, setAvatar] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch user profile
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
        const profile = (data as any).user || data || {};

        const style = profile.style || "identicon";
        const seedVal = profile.seed || "user123";

          setName(profile.name || "");
                setEmail(profile.email || "");
                setSelectedStyle(style);
                setSeed(seedVal);
        
                setAvatar(profile.avatar || `https://api.dicebear.com/7.x/${style}/png?seed=${encodeURIComponent(seedVal)}`);
              }
              //  catch (error) {
              //   console.error("Failed to load profile:", error);
              //   Alert.alert("Error", "Failed to fetch profile");
              // } 
              finally {
                setLoading(false);
              }
            };
            loadProfile();
          }, []);

  // Update avatar dynamically when style/seed changes
  useEffect(() => {
    setAvatar(`https://api.dicebear.com/7.x/${selectedStyle}/png?seed=${seed}`);
  }, [selectedStyle, seed]);

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Error", "Please login again.");
        return;
      }

      await updateUserProfile({ name, avatar, seed, style: selectedStyle }, token);

      // re-fetch (to stay in sync with backend)
      const updatedData = await getUserProfile(token);
      const profile = (updatedData as any)?.user || updatedData || {};

      const style = profile.style || selectedStyle;
      const seedVal = profile.seed || seed;

      setName(profile.name || "");
      setEmail(profile.email || "");
      setSelectedStyle(style);
      setSeed(seedVal);
      setAvatar(profile.avatar || `https://api.dicebear.com/7.x/${style}/png?seed=${encodeURIComponent(seedVal)}`);

      Alert.alert("Success", "Profile updated successfully!");
      setShowModal(false);
    } 
    // catch (error: unknown) {
    //   console.error("Error updating profile:", error);
    //   Alert.alert("Error", "Failed to update profile");
    // } 
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
      <View className="p-4 items-center">
        {/* Avatar */}
        {avatar ? (
          <Image source={{ uri: avatar }} className="w-24 h-24 rounded-full bg-gray-400" />
        ) : (
          <View className="w-24 h-24 rounded-full bg-gray-400 justify-center items-center">
            <Text className="text-white text-2xl">👤</Text>
          </View>
        )}

        {/* Name + Edit Icon */}
        <View className="flex-row items-center mt-2">
          <Text className="text-lg font-bold mr-2">{name}</Text>
          <TouchableOpacity onPress={() => setShowModal(true)}>
            <Ionicons name="create-outline" size={20} color="black" />
          </TouchableOpacity>
        </View>

        {/* Email */}
        <Text className="text-sm text-gray-600">{email}</Text>
      </View>

      {/* Modal */}
      <Modal visible={showModal} animationType="slide" transparent>
        <View className="flex-1 bg-black/40 justify-center items-center px-4">
          <View className="bg-white w-full rounded-2xl p-6 shadow-lg">
            {/* Avatar Preview */}
            {avatar ? (
              <Image source={{ uri: avatar }} className="w-24 h-24 rounded-full self-center mb-4" />
            ) : (
              <View className="w-24 h-24 rounded-full bg-gray-400 self-center justify-center items-center mb-4">
                <Text className="text-white text-2xl">👤</Text>
              </View>
            )}

            {/* Avatar Style Picker */}
            <Text className="mt-2 font-semibold text-gray-700">Select Avatar Style</Text>
            <View className="border border-gray-300 rounded-lg mt-2 mb-4 overflow-hidden">
              <Picker selectedValue={selectedStyle} onValueChange={(value) => setSelectedStyle(value as string)}>
                {AVATAR_STYLES.map((style) => (
                  <Picker.Item key={style} label={style} value={style} />
                ))}
              </Picker>
            </View>

            {/* Seed Input */}
            <Text className="font-semibold text-gray-700">Avatar Seed</Text>
            <TextInput
              value={seed}
              onChangeText={setSeed}
              placeholder="Enter seed"
              className="border border-gray-300 rounded-lg px-3 py-2 mt-2 mb-4"
            />

            {/* Name Input */}
            <Text className="font-semibold text-gray-700">Name</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Enter name"
              className="border border-gray-300 rounded-lg px-3 py-2 mt-2 mb-6"
            />

            {/* Buttons */}
            <View className="flex-row justify-between">
              <TouchableOpacity onPress={() => setShowModal(false)} className="px-6 py-2 bg-gray-200 rounded-lg">
                <Text className="text-gray-800 font-medium">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSaveProfile} className="px-6 py-2 bg-black rounded-lg" disabled={saving}>
                <Text className="text-white font-bold">{saving ? "Saving..." : "Save"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default UserProfile;
