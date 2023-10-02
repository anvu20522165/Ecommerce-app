import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Pressable,
    TextInput,
    ImageBackground,
    Dimensions,
} from "react-native";

import React, { useState } from "react";
import { AntDesign, Feather } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/CartReducer";
import { useEffect } from "react";
const ProductInfoScreen = () => {
    const route = useRoute();
    const { width } = Dimensions.get("window");
    const height = (width * 100) / 100;
    const [total, setTotal] = useState(false);
    const [addedToCart, setAddedToCart] = useState(false);
    const dispatch = useDispatch();
    const addItemToCart = (item) => {
        setAddedToCart(true);
        dispatch(addToCart(item));
        setTimeout(() => {
          setAddedToCart(false);
        }, 30000);
      };
      const cart = useSelector((state) => state.cart.cart);
      console.log(cart);

      const caculateTotal = (x,y) => {
        setTotal(route.params.price-(route.params.price*route?.params?.offer/100))
        console.log(total);
      };
      useEffect(() => {
        caculateTotal()
      }, []);
    return (
        <ScrollView
            style={{ marginTop: 55, flex: 1, backgroundColor: "white" }}
            showsVerticalScrollIndicator={false}
        >
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
<Pressable><Feather name="mic" size={24} color="black" /></Pressable>
                
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {/* {route.params.carouselImages.map((item, index) => (
                    <ImageBackground
                        style={{ width, height, marginTop: 25, resizeMode: "contain" }}
                        source={{ uri: item }}
                        key={index}
                    >
                        <View
                            style={{
                                padding: 20,
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                            }}
                        >
                            <View
                                style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 20,
                                    backgroundColor: "#C60C30",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    flexDirection: "row",
                                }}
                            >
                                <Text
                                    style={{
                                        color: "white",
                                        textAlign: "center",
                                        fontWeight: "600",
                                        fontSize: 12,
                                    }}
                                >
                                    20% off
                                </Text>
                            </View>

                            <View
                                style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 20,
                                    backgroundColor: "#E0E0E0",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    flexDirection: "row",
                                }}
                            >
                                <MaterialCommunityIcons
                                    name="share-variant"
                                    size={24}
                                    color="black"
                                />
                            </View>
                        </View>

                        <View
                            style={{
                                width: 40,
                                height: 40,
                                borderRadius: 20,
                                backgroundColor: "#E0E0E0",
                                justifyContent: "center",
                                alignItems: "center",
                                flexDirection: "row",
                                marginTop: "auto",
                                marginLeft: 20,
                                marginBottom: 20,
                            }}
                        >
                            <AntDesign name="hearto" size={24} color="black" />
                        </View>
                    </ImageBackground>
                ))} */}
                <ImageBackground
                        style={{ width, height: 300, marginTop: 25, resizeMode: "contain" }}
                        source={{ uri: route?.params?.image }}
                        //source={{ uri: "https://cdn.discordapp.com/attachments/668817507766763529/1157752252514172948/received_1064120524753563.gif?ex=651a690e&is=6519178e&hm=8777ccb89e000d5f4f1fae3a5cdb75df51d5c2eee84d4f1096ad5f6771e0b6ab&" }}
                    >

                    </ImageBackground>
            </ScrollView>
            <View style={{ padding: 10 }}>
                <Text style={{ fontSize: 15, fontWeight: "500" }}>
                    {route?.params?.title}
                </Text>

                <Text style={{ fontSize: 18, fontWeight: "600", marginTop: 6 }}>
                   Price: {route?.params?.price.toLocaleString('vi', {style : 'currency', currency : 'VND'})}
                </Text>
                <Text style={{ fontSize: 18, fontWeight: "600", marginTop: 6 }}>
                   Sale: {route?.params?.offer}% 
                </Text>
            </View>

            <Text style={{ height: 1, borderColor: "#D0D0D0", borderWidth: 1 }} />

            <View style={{padding: 10 }}>
                <Text style={{ fontSize: 15, fontWeight:"bold"}} >Description: </Text>
                <Text style={{ fontSize: 15}}>
                    {route?.params?.description}
                </Text>
            </View>

            <View style={{ flexDirection: "row", alignItems: "center", padding: 10 }}>
                <Text>Category: </Text>
                <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                    {route?.params?.category}
                </Text>
            </View>

            <Text style={{ height: 1, borderColor: "#D0D0D0", borderWidth: 1 }} />

            <View style={{ padding: 10 }}>
                <Text style={{ fontSize: 15, fontWeight: "bold", marginVertical: 5 }}>
                    Total : {total.toLocaleString('vi', {style : 'currency', currency : 'VND'})}
                </Text>
                <Text style={{ color: "#00CED1" }}>
                    FREE delivery Tomorrow by 3 PM.Order within 10hrs 30 mins
                </Text>

                <View
                    style={{
                        flexDirection: "row",
                        marginVertical: 5,
                        alignItems: "center",
                        gap: 5,
                    }}
                >
                    <Ionicons name="location" size={24} color="black" />

                    <Text style={{ fontSize: 15, fontWeight: "500" }}>
                        Deliver To Sujan - Bangalore 560019
                    </Text>
                </View>
            </View>

            <Text style={{ color: "green", marginHorizontal: 10, fontWeight: "500" }}>
                IN Stock
            </Text>

            <Pressable
        onPress={() => addItemToCart(route?.params?.item)}
        style={{
          backgroundColor: "#FFC72C",
          padding: 10,
          borderRadius: 20,
          justifyContent: "center",
          alignItems: "center",
          marginHorizontal: 10,
          marginVertical: 10,
        }}
      >
        {addedToCart ? (
          <View>
            <Text>Added to Cart</Text>
          </View>
        ) : (
          <Text>Add to Cart</Text>
        )}
      </Pressable>

      <Pressable
        style={{
          backgroundColor: "#FFAC1C",
          padding: 10,
          borderRadius: 20,
          justifyContent: "center",
          alignItems: "center",
          marginHorizontal: 10,
          marginVertical: 10,
        }}
      >
        <Text>Buy Now</Text>
      </Pressable>
        </ScrollView>
    )
}

export default ProductInfoScreen

const styles = StyleSheet.create({})