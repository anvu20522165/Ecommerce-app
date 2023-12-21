
import React, { useState, useEffect, useContext } from "react";
import { MaterialIcons, AntDesign, Ionicons } from "@expo/vector-icons";
import axios from 'axios';
import { useNavigation } from "@react-navigation/native";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  KeyboardAvoidingView,
  TextInput,
  Pressable, Alert
} from "react-native";
import { UserType } from "../../UserContext";
import jwt_decode from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";

const UpdatePassword = () => {
  const { userId, setUserId } = useContext(UserType);
  const [password, setPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [confirmPW, setConfirmPW] = useState("");
  
  const navigation = useNavigation();
  
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
    fetchUser();
  }, []);
  const handleUpdatePassword = () => {
    const updatedUser = {
      password: password,
      name: "",
      avatar: "",
      phone: "",
    };
    if(password != confirmPW){
        Alert.alert("Change password failed","The password confirmation does not match");
        return;
    }
    if(currentPassword != user.password )
    {
        Alert.alert("Change password failed","Wrong current password");
        return;
    }
    else{
    axios.put("http://10.0.2.2:8000/updateUser",{userId,updatedUser}).then((response) => {
      //console.log(response.data)
      Alert.alert("Success","User updated successfully");
      navigation.navigate("PersonalDetails", {
        _id: user._id,
        name: user?.name,
        avatar: user?.avatar,
        email: user?.email,
        phone: user?.phone,
        user: user,
      });
  }).catch((error) => {
      Alert.alert("Error","Failed to update user")
      console.log("error",error)
  })
}
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "white", alignItems: "center",}}
    >

      <KeyboardAvoidingView>
        <View style={{ alignItems: "center" }}>
          <Text
            style={{
              fontSize: 24,
              fontWeight: "bold",
              marginTop: 25,
              color: "#041E42",
            }}
          >
            Change your password
          </Text>
        </View>

        <View style={{ marginTop: 10 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              backgroundColor: "#D0D0D0",
              paddingVertical: 5,
              borderRadius: 5,
              marginTop: 30,
            }}
          >
            <AntDesign
              name="lock1"
              size={24}
              color="gray"
              style={{ marginLeft: 8 }}
            />

            <TextInput
              value={currentPassword}
              
              onChangeText={(text) => setCurrentPassword(text)}
              style={{
                color: "gray",
                marginVertical: 10,
                width: 300,
                fontSize: 16,
              }}
              placeholder="Enter your current password"
            />
          </View>
        </View>

        <View style={{ marginTop: 10 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              backgroundColor: "#D0D0D0",
              paddingVertical: 5,
              borderRadius: 5,
              marginTop: 30,
            }}
          >
            <AntDesign
              name="lock1"
              size={24}
              color="gray"
              style={{ marginLeft: 8 }}
            />

            <TextInput
              value={password}
              secureTextEntry={true}
              onChangeText={(text) => setPassword(text)}
              style={{
                color: "gray",
                marginVertical: 10,
                width: 300,
                fontSize: 16,
              }}
              placeholder="Enter your new password"
            />
          </View>
        </View>

        <View style={{ marginTop: 10 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              backgroundColor: "#D0D0D0",
              paddingVertical: 5,
              borderRadius: 5,
              marginTop: 30,
            }}
          >
            <AntDesign
              name="lock1"
              size={24}
              color="gray"
              style={{ marginLeft: 8 }}
            />

            <TextInput
              value={confirmPW}
              onChangeText={(text) => setConfirmPW(text)}
              secureTextEntry={true}
              style={{
                color: "gray",
                marginVertical: 10,
                width: 300,
                fontSize: 16,
              }}
              placeholder="Confirm your password"
            />
          </View>
        </View>

        
        <View style={{ marginTop: 50 }} />

        <Pressable
          onPress={handleUpdatePassword}
          style={{
            width: 200,
            backgroundColor: "#FEBE10",
            borderRadius: 6,
            marginLeft: "auto",
            marginRight: "auto",
            padding: 15,
          }}
        >
          <Text
            style={{
              textAlign: "center",
              color: "white",
              fontSize: 16,
              fontWeight: "bold",
            }}
          >
            Change Password
          </Text>
        </Pressable>

      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default UpdatePassword
const style = StyleSheet.create({})