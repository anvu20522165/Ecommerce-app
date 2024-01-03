import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Pressable,
    TextInput,
    Image,
    Alert,
} from "react-native";
import React, { useEffect, useContext, useState, useCallback } from "react";
import { Feather } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import DropDownPicker from "react-native-dropdown-picker";
import { UserType } from "../../../UserContext";
import axios from "axios";
import { useNavigation, useRoute } from "@react-navigation/native";
import moment from "moment";

import StepIndicator from 'react-native-step-indicator';
const labels = ["Pending", "Shipping", "Delivered", "Confirmation"];
const ViewOrderDetailScreen = () => {    
    
    const { userId, setUserId, setNotiNumber } = useContext(UserType);
    const route = useRoute();
    const [shippingAddress, setShippingAddress] = useState(route.params.shippingAddress);
    const [products, setProducts] = useState(route.params.products);
    const [paymentMethod, setPaymentMethod] = useState(route.params.paymentMethod);
    const [delivery, setDelivery] = useState(route.params.delivery);
    const [createdAt, setCreatedAt] = useState(route.params.createdAt);
    const [orderId, setOrderId] = useState(route.params._id);
    const [curStatus, setCurStatus] = useState(route.params.status);
    const [totalPrice, setTotalPrice] = useState(route.params.totalPrice);
    //   const onGenderOpen = useCallback(() => {
    //     setCompanyOpen(false);
    //   }, []);

    const [currentPosition, setCurrentPosition] = useState(0);
    useEffect(() => {
        const checkStatus = () => {
            switch (curStatus) {

                case 'Shipping':
                    setCurrentPosition(1);
                    break;

                case 'Pending':
                    setCurrentPosition(0);
                    break;

                case 'Delivered':
                    setCurrentPosition(2);
                    break;

                case 'Confirmation':
                    setCurrentPosition(3);
                    break;

                default:
                    Alert.alert("param");
            }
        }
        checkStatus()
    }, []);
    useEffect(() => {

    })

    const fetchNotiNumber = async () => {
        try {
          const response = await axios.get(
            `http://10.0.2.2:8000/notification/range/${userId}`
          );
          //const { userData } = response.data;
          //console.log(response.data)
          setNotiNumber(response.data);
          console.log("notiNum",response);
        } catch (error) {
          console.log("error", error);
        }
      }
    const handleUpdateStatus = async () => {
        try {
            if (curStatus == "Shipping") {
                const status = "Delivered";
                const response = await axios.put(
                    `http://10.0.2.2:8000/updateOrderStatus/${orderId}`, { status }
                );
                setCurrentPosition(2);
                setCurStatus("Delivered");
                Alert.alert("Order's status has been updated");
            }
            else if (curStatus == "Pending") {
                const status = "Shipping";
                const response = await axios.put(
                    `http://10.0.2.2:8000/updateOrderStatus/${orderId}`, { status }
                );
                setCurrentPosition(1);
                Alert.alert("Order's status has been updated");
                setCurStatus("Shipping");
            };
            fetchNotiNumber();


        } catch (error) {
            console.log("errror", error.response.data);
        }
    }

    const customStyles = {
        stepIndicatorSize: 25,
        currentStepIndicatorSize: 30,
        separatorStrokeWidth: 2,
        currentStepStrokeWidth: 3,
        stepStrokeCurrentColor: '#fe7013',
        stepStrokeWidth: 3,
        stepStrokeFinishedColor: '#fe7013',
        stepStrokeUnFinishedColor: '#aaaaaa',
        separatorFinishedColor: '#fe7013',
        separatorUnFinishedColor: '#aaaaaa',
        stepIndicatorFinishedColor: '#fe7013',
        stepIndicatorUnFinishedColor: '#ffffff',
        stepIndicatorCurrentColor: '#ffffff',
        stepIndicatorLabelFontSize: 13,
        currentStepIndicatorLabelFontSize: 13,
        stepIndicatorLabelCurrentColor: '#fe7013',
        stepIndicatorLabelFinishedColor: '#ffffff',
        stepIndicatorLabelUnFinishedColor: '#aaaaaa',
        labelColor: '#999999',
        labelSize: 13,
        currentStepLabelColor: '#fe7013'
    }
    return (
        <ScrollView style={{ flex: 1, backgroundColor: "white" }}>
            <View style={{ marginTop: 5, marginBottom: 20, flex: 1, backgroundColor: "white", marginHorizontal: 20 }}>

                <Text style={{ fontSize: 24, fontWeight: "bold" }}>
                    Order Details
                </Text>
                <Text style={{ fontSize: 15, fontWeight: "400" }}>
                    View Details
                </Text>
                <Text style={{ fontSize: 15, fontWeight: "bold", marginVertical: 5 }}>
                    Order #{orderId}
                </Text>
            </View>

            <Pressable>
                <Text style={{ fontSize: 20, fontWeight: "bold", marginHorizontal: 20 }}>
                    Shipping Address
                </Text>
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
                        marginHorizontal: 10
                    }}
                >


                    <View style={{ marginLeft: 6, marginVertical: 3 }}>

                        <View
                            style={{ flexDirection: "row", alignItems: "center", gap: 3 }}
                        >
                            <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                                Họ tên: {shippingAddress?.name}
                            </Text>
                            <Entypo name="location-pin" size={24} color="red" />
                        </View>

                        <Text style={{ fontSize: 15, color: "#181818" }}>
                            Số nhà: {shippingAddress?.houseNo}
                        </Text>
                        <Text style={{ fontSize: 15, color: "#181818" }}>
                            Landmark: {shippingAddress?.landmark}
                        </Text>

                        <Text style={{ fontSize: 15, color: "#181818" }}>
                            Đường: {shippingAddress?.street}
                        </Text>

                        <Text style={{ fontSize: 15, color: "#181818" }}>
                            Quốc gia: Vietnam
                        </Text>

                        <Text style={{ fontSize: 15, color: "#181818" }}>
                            Phone No : {shippingAddress?.mobileNo}
                        </Text>
                        <Text style={{ fontSize: 15, color: "#181818" }}>
                            Pin code : {shippingAddress?.postalCode}
                        </Text>

                    </View>
                </Pressable>

                <Text style={{ fontSize: 20, fontWeight: "bold", marginHorizontal: 20 }}>
                    Order Info
                </Text>
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
                        marginHorizontal: 10
                    }}
                >


                    <View style={{ marginLeft: 6, marginVertical: 3 }}>

                        <Text
                            style={{ fontSize: 15, color: "#181818", marginVertical: 5 }}
                        >
                            Date: {moment(createdAt).format("DD/MM/YY, h:mm A")}
                        </Text>
                        <Text style={{ fontSize: 15, color: "#181818", marginVertical: 5 }}>
                            Delivery: {delivery.option} - {delivery.fee.toLocaleString('vi', { style: 'currency', currency: 'VND' })}
                        </Text>
                        <Text style={{ fontSize: 15, color: "#181818", marginVertical: 5 }}>
                            Order Status: {curStatus}
                        </Text>
                        <View style={{ marginVertical: 10, width: 340, marginLeft: 19 }}>
                            <StepIndicator
                                customStyles={customStyles}
                                currentPosition={currentPosition}
                                labels={labels}
                                stepCount={4}
                            />
                        </View>
                        <View>
                            {curStatus != "Confirmation" && curStatus != "Delivered" ? (
                                <Pressable
                                    onPress={() => handleUpdateStatus()}
                                    style={{
                                        backgroundColor: "#FFC72C",
                                        borderRadius: 6,
                                        justifyContent: "center",
                                        alignItems: "center",
                                        height: 26,
                                        width: 75,
                                        right: -150
                                    }}
                                >
                                    <Text style={{ fontWeight: "bold" }}>Update</Text>
                                </Pressable>
                            ) :
                                (<Text />)}
                            {curStatus == "Delivered" ? (
                                <View>

                                    <Text style={{ fontSize: 15, color: "orange", marginVertical: 5, right: -70 }}>
                                        Waiting for the customer to respond
                                    </Text>
                                </View>) :
                                (
                                    <Text/>
                                      
                                )}

                            

                        </View>
                    </View>
                </Pressable>

                <Text style={{ fontSize: 20, fontWeight: "bold", marginHorizontal: 20 }}>
                    Your Products
                </Text>
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
                        marginHorizontal: 10
                    }}
                >


                    <View
                        style={{
                            //flexDirection: "row",
                            alignItems: "center",
                            flexWrap: "wrap",
                        }}
                    >
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {products?.map((product, index) => (

                                <View
                                    style={{
                                        backgroundColor: "#FFFAFA",
                                        marginVertical: 10,
                                        borderBottomColor: "#F0F0F0",
                                        borderWidth: 2,
                                        borderLeftWidth: 0,
                                        borderTopWidth: 0,
                                        borderRightWidth: 0,
                                        marginHorizontal: 15,
                                    }}
                                    key={index}
                                >

                                    <Pressable
                                        style={{
                                            marginVertical: 10,
                                            flexDirection: "row",
                                            justifyContent: "space-between",
                                        }}
                                    >
                                        <View>
                                            <Image
                                                style={{ width: 140, height: 140, resizeMode: "contain", marginRight: 10 }}
                                                source={{ uri: product?.image }}
                                            />
                                        </View>

                                        <View>
                                            <Text numberOfLines={3} style={{ width: 150, marginTop: 10, fontWeight: "bold", fontSize: 17, }}>
                                                {product.name}
                                            </Text>
                                            <Text
                                                style={{ fontSize: 15, marginTop: 6 }}
                                            >
                                                {product.price.toLocaleString('vi', { style: 'currency', currency: 'VND' })}
                                            </Text>
                                            <Text
                                                style={{ fontSize: 15, marginTop: 6 }}
                                            >
                                                x{product.quantity}
                                            </Text>
                                            <Image
                                                style={{ width: 30, height: 30, resizeMode: "contain" }}
                                                source={{
                                                    uri: "https://assets.stickpng.com/thumbs/5f4924cc68ecc70004ae7065.png",
                                                }}
                                            />


                                        </View>
                                    </Pressable>




                                </View>
                            ))}

                        </ScrollView>

                    </View>

                </Pressable>


                <View>
                    <Text style={{ padding: 10, fontSize: 18, fontWeight: "400" }}>
                        Total price: {totalPrice.toLocaleString('vi', { style: 'currency', currency: 'VND' })}
                    </Text>

                </View>


            </Pressable>
        </ScrollView>
    )
}

export default ViewOrderDetailScreen

const styles = StyleSheet.create({})