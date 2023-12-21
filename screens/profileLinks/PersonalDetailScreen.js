import {

  Text,
  View,
  SafeAreaView,

  Pressable,
  TextInput,
  Image,
  Alert,
} from "react-native";
import { Entypo } from "@expo/vector-icons";
import { FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";

import React, { useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute } from "@react-navigation/native"; 
import { UserType } from '../../UserContext';
import axios from "axios";

const PersonalDetailScreen = () => {
  const { userId, setUserId } = useContext(UserType);
  const route = useRoute();
  const [name, setName] = useState(route.params.name);
  const [avatar, setAvatar] = useState(route.params.avatar);
  const [email, setEmail] = useState(route.params.email);
  const [phone, setPhone] = useState(route.params.phone);
  const navigation = useNavigation();
  // const logOut = async () => {
  //   //setAppUserConfig({ accessToken: null, accessTokenName: null });
  //   navigation.replace("Login");
  // }
  const handelEditUser = () => {    
    const updatedUser = {
      name,
      avatar,
      phone,
      password: "",
  }
  axios.put("http://10.0.2.2:8000/updateUser",{userId,updatedUser}).then((response) => {
      //console.log(response.data)
      Alert.alert("Success","User updated successfully");
  }).catch((error) => {
      Alert.alert("Error","Failed to update user")
      console.log("error",error)
  })
  }
  return (
    <SafeAreaView style={{ marginTop: 30 }}>

      <View style={{ marginHorizontal: 20 }}>
        <Pressable>

          <Pressable
            style={{
              borderWidth: 1,
              borderColor: "#D0D0D0",
              padding: 10,
              flexDirection: "column",
              alignItems: "center",
              gap: 5,
              paddingBottom: 17,
              marginVertical: 7,
              borderRadius: 10,
            }}
          >

            <Image
              style={{ width: 100, height: 100, resizeMode: "contain", borderRadius: 20 }}
              source={{ uri: avatar }}
            />
            <View style={{ marginVertical: 10, flexDirection: "row", }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 3,
                  marginVertical: 2
                }}
              >


                <View>
                  <View style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 3,
                    marginVertical: 2
                  }}>
                    <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                      Name
                    </Text>

                    <TextInput
                      value={name}
                      onChangeText={(text) => setName(text)}
                      placeholderTextColor={"black"}
                      style={{
                        //padding: 10,
                        borderColor: "#D0D0D0",
                        borderWidth: 1,
                        marginLeft: 30,
                        textAlign: "center",
                        //marginTop: 10,

                        width: 250,
                        borderRadius: 5,
                      }}
                      placeholder="Name"
                    />
                  </View>
                  <View style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 3,
                    marginVertical: 2
                  }}>
                    <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                      Avatar
                    </Text>

                    <TextInput
                      value={avatar}
                      onChangeText={(text) => setAvatar(text)}
                      placeholderTextColor={"black"}
                      style={{
                        //padding: 10,
                        borderColor: "#D0D0D0",
                        borderWidth: 1,
                        marginLeft: 30,
                        textAlign: "center",
                        //marginTop: 10,

                        width: 250,
                        borderRadius: 5,
                      }}
                      placeholder="Avatar"
                    />
                  </View>

                  <View style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 3,
                    marginVertical: 2
                  }}>
                    <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                      Phone
                    </Text>

                    <TextInput
                      value={phone}
                      onChangeText={(text) => setPhone(text)}
                      placeholderTextColor={"black"}
                      style={{
                        //padding: 10,
                        borderColor: "#D0D0D0",
                        borderWidth: 1,
                        marginLeft: 30,
                        textAlign: "center",
                        //marginTop: 10,

                        width: 250,
                        borderRadius: 5,
                      }}
                      placeholder="Number"
                    />
                  </View>



                  <View style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 3,
                    marginTop: 15,
                    marginVertical: 2
                  }}>
                    <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                      Email
                    </Text>

                    <Text

                      style={{
                        //padding: 10,
                        borderColor: "#D0D0D0",
                        marginLeft: 30,
                        textAlign: "center",
                        width: 250,
                        //marginTop: 10,

                      }}
                    //placeholder="Mobile No"
                    >
                      {email}
                    </Text>
                  </View>
                </View>
              </View>



            </View>
            <Pressable
              onPress={handelEditUser}
              style={{
                backgroundColor: "#FFC72C",
                //padding: 19,
                borderRadius: 6,
                justifyContent: "center",
                alignItems: "center",
                marginTop: 0,
                height: 26,
                width: 75
              }}
            >
              <Text style={{ fontWeight: "bold" }}>Update</Text>
            </Pressable>
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


            <View style={{ marginLeft: 6, marginVertical: 3 }}>

              <Pressable
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 3,
                  marginVertical: 10
                }}
                onPress={()=>navigation.navigate("UpdatePassword")}
              >

                <MaterialIcons name="security" size={24} style={{ marginHorizontal: 10 }} />
                <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                  Change Password
                </Text>

              </Pressable>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 3,
                  marginVertical: 10
                }}
              >

                <Ionicons name="notifications" size={24} style={{ marginHorizontal: 10 }} />
                <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                  Notifications
                </Text>

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
                onPress={() => logOut()}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 3,
                    marginVertical: 10
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

    </SafeAreaView>
  )
}

export default PersonalDetailScreen

