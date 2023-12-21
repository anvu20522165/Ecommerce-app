import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Platform,
  ScrollView,
  Pressable,
  TextInput,
  Image,
  Alert,
} from "react-native";
import { FontAwesome5, Ionicons, FontAwesome } from "@expo/vector-icons";
import React, { useEffect, useContext, useState, useCallback } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import axios from "axios";
import { AntDesign } from "@expo/vector-icons";

export default function ViewUsersScreen() {
  const navigation = useNavigation();
  const [users, setUsers] = useState([]);
  const fetchUsers = async () => {
    try {
      const usersResponse = await axios.get("http://10.0.2.2:8000/users");
      setUsers(usersResponse.data);
      console.log("all data", usersResponse.data);
    } catch (error) {
      console.log("error message", error);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);
  const handelEditUser = (userId, Locked) => {    
    const updatedUser = {
      password: "",
      name: "",
      avatar: "",
      phone: "",
      isLocked: !Locked,
  }
  axios.put("http://10.0.2.2:8000/updateUser",{userId,updatedUser}).then((response) => {
      console.log("isLocked: ", response.data);
      Alert.alert("Success","User updated successfully");
      fetchUsers();
  }).catch((error) => {
      Alert.alert("Error","Failed to update user")
      console.log("error",error)
  })
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.textTitle}>Users</Text>
        <Text style={styles.description}>View all users</Text>
        <Pressable
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            backgroundColor: "white",
            borderRadius: 5,
            height: 38,
            marginHorizontal: 15,
            shadowColor: "#000",
            shadowOffset: { width: 1, height: 1 },
            shadowOpacity: 0.5,
            shadowRadius: 1,
            elevation: 2,
            marginBottom: 20,
          }}
        >
          <AntDesign
            style={{ paddingLeft: 10 }}
            name="search1"
            size={18}
            color="black"
          />
          <TextInput placeholder="Find User" />
        </Pressable>
        {users.length > 0 ? (
        users.map((item, index) => (
          <View style={styles.productListView} key={index}>
           <View style={{flexDirection: "row", alignItems: "center"}}>
              <Image
                style={{
                  width: 60,
                  height: 60,
                  resizeMode: "contain",
                  marginRight: 15,
                }}
                source={{ uri: item?.avatar }}
              />
              <View
                style={{ flexDirection: "column"}}
              >
                <Text
                  style={{ fontSize: 16, fontWeight: "bold", marginBottom: 5 }}
                >
                  {item.name.length > 18
                    ? item.title.slice(0, 18) + "..."
                    : item.name}
                </Text>
                <Text style={{ fontSize: 14, marginBottom: 3 }}>
                  {item.email}
                </Text>
              </View>
              </View>
              <Pressable
                onPress={()=>handelEditUser(item._id,item.isLocked)}
              >
              <FontAwesome5
                name= {item.isLocked?"lock":"lock-open"}
                size={16}
                color="white"
                style={{
                  backgroundColor: "blue",
                  padding: 8,
                  borderRadius: 5,
                  marginRight: 3,
                }}
              />
              </Pressable>

          
          </View>
        ))):
        (
          <Text style={styles.description}>No users found.</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafa",
  },
  textTitle: {
    fontSize: 25,
    fontWeight: "bold",
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 10,
  },
  description: {
    fontSize: 18,
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  productListView: {
    //marginTop:5,
    backgroundColor: "#fff",
    marginHorizontal: 15,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 1,
    elevation: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
