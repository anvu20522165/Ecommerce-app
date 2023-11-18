import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Pressable,
    TextInput,
    FlatList,
} from "react-native";
import { LogBox } from 'react-native';
import React, { useEffect, useContext, useState, useCallback } from "react";
import { Feather } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import DropDownPicker from "react-native-dropdown-picker";
import { UserType } from '../../UserContext';
import axios from "axios";
import { useNavigation, useRoute } from "@react-navigation/native";
import moment from "moment";
const MyOrders = () => {
    const { userId, setUserId } = useContext(UserType);
    const navigation = useNavigation();

    const [open, setOpen] = useState(false);
    const [status, setStatus] = useState("Pending");
    const [items, setItems] = useState([
        { label: "Pending", value: "Pending" },
        { label: "Shipping", value: "Shipping" },
        { label: "Delivered", value: "Delivered" },
    ]);
    const [orderData, setOrderData] = useState([]);
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get(`http://10.0.2.2:8000/orders/${userId}`);
                //const { orderData } = response.data;
                //setOrderData(orderData);
                setOrderData(response.data);
                //console.log(response.data);
            } catch (error) {
                console.log("error message", error);
            }
        };
        fetchOrders()
    }, []);

    return ( 
<View style={{ marginTop: 55, flex: 1, backgroundColor: "white" }}>
            <View
                style={{
                    backgroundColor: "#00CED1",
                    padding: 10,
                    flexDirection: "row",
                    alignItems: "center",
                }}
            >

                <Pressable
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginHorizontal: 7,
                        gap: 10,
                        backgroundColor: "white",
                        borderRadius: 3,
                        height: 38,
                        flex: 1,
                    }}
                >
                    <AntDesign
                        style={{ paddingLeft: 10 }}
                        name="search1"
                        size={22}
                        color="black"
                    />
                    <TextInput placeholder="Search Amazon.in" />
                </Pressable>

                <Feather name="mic" size={24} color="black" />
            </View>
            <View
                style={{
                    marginHorizontal: 10,
                    marginTop: 20,
                    width: "45%",
                }}
            >
                <Text style={{ fontSize: 25, fontWeight: "bold" }}>
                    Your Orders
                </Text>
            </View>
            <View
                style={{
                    marginHorizontal: 10,
                    marginTop: 20,
                    width: "45%",
                    marginBottom: 40,
                    position: "relative",
                }}
            >
                <DropDownPicker
                    style={{
                        borderColor: "#B7B7B7",
                        height: 30,
                        marginBottom: open ? 120 : 15,
                        position: "absolute",
                    }}
                    open={open}
                    value={status} //genderValue
                    items={items}
                    setOpen={setOpen}
                    setValue={setStatus}
                    setItems={setItems}
                    placeholder="choose category"
                    placeholderStyle={styles.placeholderStyles}
                    zIndex={3000}
                    zIndexInverse={1000}
                />
            </View>



            <FlatList
                data={orderData.filter((item) => item.status === status)}
                renderItem={({ item, index }) => {
                    return (
                        <Pressable style={{
                            paddingBottom: 17,
                            marginVertical: 3,
                            borderRadius: 10,
                            marginTop: 20,
                            borderWidth: 1,
                            borderColor: "#D0D0D0",
                            marginHorizontal: 6
                        }}>
                            <Pressable

                                style={{
                                    marginHorizontal: 5

                                }}
                            >

                                <Pressable

                                    style={{
                                        //backgroundColor: "#FFC72C",
                                        padding: 10,
                                        borderRadius: 5,

                                        marginHorizontal: 10,
                                        marginTop: 5,
                                    }}
                                >
                                    <Text style={{ fontWeight: "400", fontSize: 20 }}>{index + 1}</Text>
                                    <Text style={{ fontWeight: "bold", fontSize: 19 }}>Order #{item._id}</Text>
                                    
                                </Pressable>

                            </Pressable>


                            <View style={{ padding: 10, flexDirection: "row" }}>
                                <View>
                                    <Pressable
                                        onPress={() =>
                                            navigation.navigate("MyOrdersDetails", {
                                                _id: item._id,
                                                shippingAddress: item.shippingAddress,
                                                products: item.products,
                                                paymentMethod: item.paymentMethod,
                                                delivery: item.delivery,
                                                status: item.status,
                                                totalPrice: item.totalPrice,
                                                createdAt: item.createdAt,
                                                item: item,
                                                
                                            })
                                        }
                                        style={{
                                            backgroundColor: "#FFC72C",
                                            //padding: 19,
                                            borderRadius: 6,
                                            justifyContent: "center",
                                            alignItems: "center",
                                            marginTop: 50,
                                            height: 26,
                                            width: 75,
                                            marginLeft: 15
                                        }}
                                    >
                                        <Text style={{ fontWeight: "bold" }}>Details</Text>
                                    </Pressable>
                                </View>
                                <View style={{ marginLeft: 50 }}>
                                    <Text style={{ padding: 10, fontSize: 18, fontWeight: "400" }}>
                                        Total price: {item.totalPrice.toLocaleString('vi', { style: 'currency', currency: 'VND' })}
                                    </Text>
                                    <Text
                                        style={{
                                            padding: 10,
                                            fontSize: 14,
                                            fontWeight: "400",
                                            marginTop: 5,
                                            //marginLeft: 50
                                        }}
                                    >
                                        Date: {moment(item.createdAt).format("DD/MM/YY, h:mm A")}
                                    </Text>
                                    <Text
                                        style={{
                                            padding: 10,
                                            fontWeight: "500",
                                            marginTop: 5,
                                            fontSize: 15
                                        }}
                                    >
                                        Status: {item.status}
                                    </Text>
                                </View>

                            </View>




                        </Pressable>
                    )
                }}
                keyExtractor={(item, index) => index.toString()}
            //ItemSeparatorComponent={}
            />


</View>
        
    )
}

export default MyOrders

const styles = StyleSheet.create({})