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
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { FontAwesome5, Ionicons, FontAwesome } from "@expo/vector-icons";

import React, { useEffect, useContext, useState, useCallback } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { UserType } from '../UserContext';
import axios from "axios";
const ProfileScreen = () => {
  //const [appUserConfig, setAppUserConfig] = useContext(UserType);
  const navigation = useNavigation();
  const logOut = async () => {
    //setAppUserConfig({ accessToken: null, accessTokenName: null });
    AsyncStorage.removeItem("authToken")
      .then(() => {
        navigation.replace("Login");
      })
      .catch(error => console.log(error))

  }

  const { userId, setUserId } = useContext(UserType);
  const [user, setUser] = useState([]);

  const fetchUser = async () => {
    try {
      const response = await axios.get(
        `http://10.0.2.2:8000/user/${userId}`
      );
      //const { userData } = response.data;
      console.log(response.data)
      setUser(response.data);
    } catch (error) {
      console.log("error", error);
    }
  };
  useEffect(() => {
    if (userId) {
      console.log("user id:", userId)
      fetchUser();

    }
  }, [userId]);

  useFocusEffect(
    useCallback(() => {
      fetchUser();
    }, [])
  );
  return (
    <SafeAreaView>
      <ScrollView>
      <View style={{ marginHorizontal: 20 }}>
        <Pressable>

          <Pressable
            style={{
              borderWidth: 1,
              borderColor: "#D0D0D0",
              padding: 10,
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              paddingBottom: 17,
              marginVertical: 7,
              borderRadius: 6,
            }}
          >


            <View style={{ marginLeft: 6, marginVertical: 5 }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 3,
                  marginVertical: 10
                }}
              >


                <Image
                  style={{ width: 60, height: 60, resizeMode: "contain", borderRadius: 15 }}
                  source={{ uri: user?.avatar }}
                />
                <View style={{ marginLeft: 15 }}>
                  <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                    {user?.name}
                  </Text>
                  <Text style={{ fontSize: 14 }}>
                    {user?.email}
                  </Text>
                </View>
              </View>



            </View>
          </Pressable>

        </Pressable>
        <Pressable>

          <Pressable
            style={{
              borderWidth: 1,
              borderColor: "#D0D0D0",
              padding: 10,
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              paddingBottom: 17,
              marginVertical: 7,
              borderRadius: 6,
            }}
          >


            <View style={{ marginLeft: 6, marginVertical: 10 }}>
              <Pressable
                onPress={() =>
                  navigation.navigate("PersonalDetails", {
                    _id: user._id,
                    name: user?.name,
                    avatar: user?.avatar,
                    email: user?.email,
                    phone: user?.phone,
                    user: user,
                  })
                }
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 3,
                    marginVertical: 10
                  }}
                >

                  <FontAwesome5 name="user-alt" size={24} style={{ marginHorizontal: 10 }} />
                  <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                    Personal Details
                  </Text>

                </View>
              </Pressable>
              <Pressable
                onPress={() => navigation.navigate("MyOrders")}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 3,
                    marginVertical: 10
                  }}
                >

                  <FontAwesome5 name="shopping-bag" size={24} style={{ marginHorizontal: 10 }} />
                  <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                    My Orders
                  </Text>

                </View>
              </Pressable>
              <Pressable
                onPress={()=>navigation.navigate("Wishlist")}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 3,
                  marginVertical: 10
                }}
              >

                <FontAwesome5 name="heart" size={24} style={{ marginHorizontal: 10 }} />
                <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                  My Wishlist
                </Text>

              </Pressable>
              <Pressable
                onPress={() => navigation.navigate("Address")}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 3,
                    marginVertical: 10
                  }}
                >

                  <FontAwesome name="truck" size={24} style={{ marginHorizontal: 10 }} />
                  <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                    Shipping Addresses
                  </Text>

                </View>
              </Pressable>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 3,
                  marginVertical: 10
                }}
              >

                <Ionicons name="stats-chart" size={24} style={{ marginHorizontal: 10 }} />
                <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                  My Stats
                </Text>

              </View>

              <Pressable
                onPress={() => navigation.navigate("FlatlistTemp")}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 3,
                    marginVertical: 10
                  }}
                >

                  <Ionicons name="settings" size={24} style={{ marginHorizontal: 10 }} />
                  <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                    Settings
                  </Text>

                </View>
              </Pressable>
              <Pressable
                onPress={() => navigation.navigate("AdminDashboard")}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 3,
                    marginVertical: 10
                  }}
                >

                  <MaterialIcons name="verified-user" size={24} style={{ marginHorizontal: 10 }} />
                  <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                    Manager
                  </Text>

                </View>
              </Pressable>
            </View>
          </Pressable>

        </Pressable>
        <Pressable>

          <Pressable
            style={{
              borderWidth: 1,
              borderColor: "#D0D0D0",
              padding: 10,
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              paddingBottom: 17,
              marginVertical: 7,
              borderRadius: 6,
            }}
          >


            <View style={{ marginLeft: 6, marginVertical: 5 }}>
              <Pressable
                onPress={() => logOut()}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 3,
                    marginVertical: 5
                  }}
                >


                  <FontAwesome5 name="sign-out-alt" size={24} style={{ marginHorizontal: 10 }} />
                  <Text style={{ fontSize: 15, fontWeight: "bold" }}>Log out</Text>


                </View>
              </Pressable>


            </View>


          </Pressable>

        </Pressable>
        
      </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default ProfileScreen