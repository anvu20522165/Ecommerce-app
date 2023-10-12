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
import { useDispatch, useSelector } from "react-redux";
import DropDownPicker from "react-native-dropdown-picker";
import { UserType } from '../../UserContext';
import axios from "axios";
import { useNavigation, useRoute } from "@react-navigation/native";
import ProductItem from "../../components/ProductItem";
const MyOrders = () => {
    const { userId, setUserId } = useContext(UserType);
    const route = useRoute();
    const [open, setOpen] = useState(false);
    const [status, setStatus] = useState("Pending");
    const [items, setItems] = useState([
        { label: "Pending", value: "Pending" },
        { label: "Shipping", value: "Shipping" },
        { label: "Delivered", value: "Delivered" },
    ]);
    //   const onGenderOpen = useCallback(() => {
    //     setCompanyOpen(false);
    //   }, []);
    const [orderData, setOrderData] = useState([]);
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get(`http://10.0.2.2:8000/orders/${userId}`);
                //const { orderData } = response.data;
                //setOrderData(orderData);
                setOrderData(response.data);
                console.log(response.data);
            } catch (error) {
                console.log("error message", error);
            }
        };
        fetchOrders()
    }, []);
    useEffect(() => {
        console.log(orderData);
    })
    return (
        <ScrollView style={{ marginTop: 55, flex: 1, backgroundColor: "white" }}>

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
                    marginBottom: open ? 50 : 15,
                }}
            >
                <DropDownPicker
                    style={{
                        borderColor: "#B7B7B7",
                        height: 30,
                        marginBottom: open ? 120 : 15,
                    }}
                    open={open}
                    value={status} //genderValue
                    items={items}
                    setOpen={setOpen}
                    setValue={setStatus}
                    setItems={setItems}
                    placeholder="choose category"
                    placeholderStyle={styles.placeholderStyles}
                    //onOpen={onGenderOpen}
                    //onChangeValue={onChange}
                    zIndex={3000}
                    zIndexInverse={1000}
                />
            </View>



            <ScrollView >
                {orderData
                .filter((item) => item.status === status)
                ?.map((item, index) => (
                    <Pressable key={index} style={{borderRadius: 5,
                        borderColor: "#98E4FF",
                        borderWidth: 0.6, marginTop: 20}}>
                        <Pressable

                            style={{
                                margin: 10,
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >

                            <Pressable

                                style={{
                                    backgroundColor: "#FFC72C",
                                    padding: 10,
                                    borderRadius: 5,

                                    marginHorizontal: 10,
                                    marginTop: 10,
                                }}
                            >
                                <Text style={{ fontWeight: "bold", fontSize: 18 }}>Order {index + 1}</Text>
                            </Pressable>

                        </Pressable>
                        <Text style={{ marginHorizontal: 10, fontSize: 20, marginVertical: 10 }}>Your ({item.products.length}) products details: </Text>
                        
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                flexWrap: "wrap",
                            }}
                        >
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {item?.products

                                .map((product, index) => (
                                    
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
                                                <Text numberOfLines={3} style={{ width: 150, marginTop: 10, fontWeight: "bold",fontSize: 17, }}>
                                                    {product.name}
                                                </Text>
                                                <Text
                                                    style={{ fontSize: 15,  marginTop: 6 }}
                                                >
                                                    {product.price.toLocaleString('vi', { style: 'currency', currency: 'VND' })}
                                                </Text>
                                                <Text
                                                    style={{ fontSize: 15,  marginTop: 6 }}
                                                >
                                                    Quantity: {product.quantity}
                                                </Text>
                                                <Image
                                                    style={{ width: 30, height: 30, resizeMode: "contain" }}
                                                    source={{
                                                        uri: "https://assets.stickpng.com/thumbs/5f4924cc68ecc70004ae7065.png",
                                                    }}
                                                />
                                                <Text style={{ color: "green" }}>In Stock</Text>

                                            </View>
                                        </Pressable>

                                        <Pressable
                                            style={{
                                                marginTop: 15,
                                                marginBottom: 10,
                                                flexDirection: "row",
                                                alignItems: "center",
                                                gap: 10,
                                            }}
                                        >
                                           
                                            
                                        </Pressable>

                                        
                                    </View>
                                ))}
                                </ScrollView>
                        </View>
                        <View style={{ padding: 10, flexDirection: "row" }}>
                            <Text style={{ fontSize: 18, fontWeight: "400" }}>Subtotal : {item.totalPrice.toLocaleString('vi', { style: 'currency', currency: 'VND' })}</Text>
                        </View>
                        <Text
                            style={{
                                padding: 10,
                                fontSize: 12,
                                fontWeight: "500",
                                marginTop: 5,
                                fontSize: 17
                            }}
                        >
                            Status: {item.status}
                        </Text>




                    </Pressable>
                ))}
            </ScrollView>


           
        </ScrollView>
    )
}

export default MyOrders

const styles = StyleSheet.create({})