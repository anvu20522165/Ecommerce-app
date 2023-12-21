import {
  FlatList,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  Pressable,
  Alert,
} from "react-native";
import React, { useEffect, useState, useContext } from "react";
import { useNavigation, useRoute} from "@react-navigation/native";
import jwt_decode from "jwt-decode"
import { UserType } from "../UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const EditAddressScreen = (item) => {
  const route = useRoute();
  const navigation = useNavigation();
  const [name, setName] = useState(route.params.name);
  const [mobileNo, setMobileNo] = useState(route.params.mobileNo);
  const [houseNo, setHouseNo] = useState(route.params.houseNo);
  const [street, setStreet] = useState(route.params.street);
  const [landmark, setLandmark] = useState(route.params.landmark);
  const [postalCode, setPostalCode] = useState(route.params.postalCode);
  //const [addresses, setAddresses] = useState([]);
  const { userId, setUserId } = useContext(UserType);
  const [addressId, setAddressId] = useState(route.params._id);
  const handleRemoveInUpdating = async () => {
    try {
      console.log(addressId)
      const response = await axios.delete(
        `http://10.0.2.2:8000/addresses/${userId}/${addressId}`, 
      );
      
    } catch (error) {
      console.log("error", error);
    }
  }
  const handleAddAddressInUpdating = () => {
    const address = {
        name,
        mobileNo,
        houseNo,
        street,
        landmark,
        postalCode
    }

    axios.post("http://10.0.2.2:8000/addresses",{userId,address}).then((response) => {
        console.log(response.data)
        Alert.alert("Success","Addresses updated successfully");
    }).catch((error) => {
        Alert.alert("Error","Failed to add address")
        console.log("error",error)
    })
}
const handleUpdating = async () => {
  handleRemoveInUpdating();
  
  setTimeout(() => {
    handleAddAddressInUpdating();
  },500)

  setTimeout(() => {
    navigation.goBack();
  },1000)
  
}
  return (
    <ScrollView style={{ marginTop: 0}}>
      <View style={{ height: 50, backgroundColor: "#00CED1", justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: "white", fontSize: 20, fontWeight: 'bold' }}>Edit current address</Text>
      </View>
      <View style={{ padding: 10 }}>
        <Text style={{ fontSize: 15, fontWeight: "bold" }}>
          Your locations
        </Text>
        <TextInput
          placeholderTextColor={"black"}
          placeholder="Vietnam"
          style={{
            padding: 10,
            borderColor: "#D0D0D0",
            borderWidth: 1,
            marginTop: 10,
            borderRadius: 5,
          }}
          
        />
        <View style={{ marginVertical: 10 }}>
          <Text style={{ fontSize: 15, fontWeight: "bold" }}>
            Full name (First and last name)
          </Text>

          <TextInput
            value={name}
            onChangeText={(text) => setName(text)}
            placeholderTextColor={"black"}
            style={{
              padding: 10,
              borderColor: "#D0D0D0",
              borderWidth: 1,
              marginTop: 10,
              borderRadius: 5,
            }}
            
          />
            
          <View>
            <Text style={{ fontSize: 15, fontWeight: "bold" }}>
              Mobile numeber
            </Text>

            <TextInput
              value={mobileNo}
              onChangeText={(text) => setMobileNo(text)}
              placeholderTextColor={"black"}
              style={{
                padding: 10,
                borderColor: "#D0D0D0",
                borderWidth: 1,
                marginTop: 10,
                borderRadius: 5,
              }}
              placeholder="Mobile No"
            />
          </View>

          <View style={{ marginVertical: 10 }}>
            <Text style={{ fontSize: 15, fontWeight: "bold" }}>
              Flat,House No,Building,Company
            </Text>

            <TextInput
              value={houseNo}
              onChangeText={(text) => setHouseNo(text)}
              placeholderTextColor={"black"}
              style={{
                padding: 10,
                borderColor: "#D0D0D0",
                borderWidth: 1,
                marginTop: 10,
                borderRadius: 5,
              }}
              placeholder=""
            />
          </View>

          <View>
            <Text style={{ fontSize: 15, fontWeight: "bold" }}>
              Area,Street,sector,village
            </Text>
            <TextInput
              value={street}
              onChangeText={(text) => setStreet(text)}
              placeholderTextColor={"black"}
              style={{
                padding: 10,
                borderColor: "#D0D0D0",
                borderWidth: 1,
                marginTop: 10,
                borderRadius: 5,
              }}
              placeholder=""
            />
          </View>

          <View style={{ marginVertical: 10 }}>
            <Text style={{ fontSize: 15, fontWeight: "bold" }}>Landmark</Text>
            <TextInput
              value={landmark}
              onChangeText={(text) => setLandmark(text)}
              placeholderTextColor={"black"}
              style={{
                padding: 10,
                borderColor: "#D0D0D0",
                borderWidth: 1,
                marginTop: 10,
                borderRadius: 5,
              }}
              placeholder="Optional"
            />
          </View>

          <View>
            <Text style={{ fontSize: 15, fontWeight: "bold" }}>Pincode</Text>

            <TextInput
              value={postalCode}
              onChangeText={(text) => setPostalCode(text)}
              placeholderTextColor={"black"}
              style={{
                padding: 10,
                borderColor: "#D0D0D0",
                borderWidth: 1,
                marginTop: 10,
                borderRadius: 5,
              }}
              placeholder="Enter Pincode"
            />
          </View>

          <Pressable
            onPress={handleUpdating}
            style={{
              backgroundColor: "#FFC72C",
              padding: 19,
              borderRadius: 6,
              justifyContent: "center",
              alignItems: "center",
              marginTop: 20,
            }}
          >
            <Text style={{ fontWeight: "bold" }}>Update</Text>
          </Pressable>
        </View>
      </View>

    </ScrollView>
  )
}

export default EditAddressScreen

const styles = StyleSheet.create({})