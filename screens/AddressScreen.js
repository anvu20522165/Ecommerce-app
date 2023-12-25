import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TextInput,
    Pressable,
    Alert,
} from "react-native";
import React, { useEffect, useState, useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import jwt_decode from "jwt-decode"
import { UserType } from "../UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
const AddressScreen = () => {
    const [name, setName] = useState("");
    const [mobileNo, setMobileNo] = useState("");
    const [houseNo, setHouseNo] = useState("");
    const [street, setStreet] = useState("");
    const [landmark, setLandmark] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const {userId,setUserId} = useContext(UserType)
    const navigation = useNavigation();
    useEffect(() => {
        const fetchUser = async() => {
            const token = await AsyncStorage.getItem("authToken");
            const decodedToken = jwt_decode(token);
            const userId = decodedToken.userId;
            setUserId(userId)
        }
    
        fetchUser();
      },[]);
      console.log(userId)


      const handleAddAddress = () => {
        const address = {
            name,
            mobileNo,
            houseNo,
            street,
            landmark,
            postalCode
        }
  
        axios.post("http://10.0.2.2:8000/addresses",{userId,address}).then((response) => {
            Alert.alert("Success","Addresses added successfully");
            setName("");
            setMobileNo("");
            setHouseNo("");
            setStreet("");
            setLandmark("");
            setPostalCode("");
        
            console.log(response.data)
            setTimeout(() => {
              navigation.goBack();
            },500)
        }).catch((error) => {
            Alert.alert("Error","Failed to add address")
            console.log("error",error)
        })
    }
    return (
        <ScrollView style={{ marginTop: 0 }}>
            <View style={{ height: 50, backgroundColor: "#00CED1", justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: "white", fontSize: 20, fontWeight: 'bold' }}>Add a new address</Text>
            </View>
            <View style={{ padding: 10 }}>
            <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                        Your location
                    </Text>
                <Text

                    style={{
                        padding: 10,
                        borderColor: "#D0D0D0",
                        borderWidth: 1,
                        marginTop: 10,
                        borderRadius: 5,
                        fontSize:15
                    }}>Vietnam - as default</Text>
                
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
                        placeholder="Enter your name"
                    />
                    <View>
                        <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                            Mobile numebr
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
                            Province, District, Ward
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
                            HouseNo, Street
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
                        onPress={handleAddAddress}
                        style={{
                            backgroundColor: "#FFC72C",
                            padding: 19,
                            borderRadius: 6,
                            justifyContent: "center",
                            alignItems: "center",
                            marginTop: 20,
                        }}
                    >
                        <Text style={{ fontWeight: "bold" }}>Add Address</Text>
                    </Pressable>
                </View>
            </View>

        </ScrollView>
    )
}

export default AddressScreen

const styles = StyleSheet.create({})