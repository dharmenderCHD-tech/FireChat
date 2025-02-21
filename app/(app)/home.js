import { View, Text, Pressable, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/authContext";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { StatusBar } from "expo-status-bar";
import ChatList from "../../components/ChatList";
import { getDocs, query } from "firebase/firestore";
import { usersRef } from "@/firebaseConfig";

export default function Home() {
  const { logout, user } = useAuth();
  const [users, setUsers] = useState([]);
  useEffect(() => {
    console.log("Auth User:", user);
    console.log("user id: ", user?.uid);
    if (user?.uid) {
      getUsers();
    }
  }, []);

  const getUsers = async () => {
    // const q = query(usersRef, where("userId", "!=", user?.userId));
    const querySnapshot = await getDocs(usersRef);
    let data = [];
    querySnapshot.forEach((doc) => {
      const userData = doc.data();
      if (userData.userId !== user?.uid) {
        data.push({ ...doc.data() });
      }
    });
    console.log("get Users: ", data);
    setUsers(data);
  };
  return (
    <View className="flex-1 bg-white">
      <StatusBar style="light" />
      {users.length > 0 ? (
        <ChatList currentUser={user} users={users} />
      ) : (
        <View className="flex items-center" style={{ top: hp(30) }}>
          <ActivityIndicator size="large" />
        </View>
      )}
    </View>
  );
}
