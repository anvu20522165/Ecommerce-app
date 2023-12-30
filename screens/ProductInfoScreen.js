import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Pressable,
    TextInput,
    ImageBackground,
    Dimensions,
    Alert,
    TouchableOpacity, Image,
} from "react-native";

import React, { useEffect, useState, useContext, useCallback } from "react";
import { AntDesign, Feather } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { useRoute, useFocusEffect, } from "@react-navigation/native";

import { UserType } from "../UserContext";
import axios from "axios";
const ProductInfoScreen = () => {
    const route = useRoute();
    const [productId, setProductId] = useState(route.params._id);
    const [rate, setRate] = useState(0);
    const { userId, setUserId } = useContext(UserType);

    const { width } = Dimensions.get("window");
    const height = (width * 100) / 100;
    const [total, setTotal] = useState(false);
    const [addedToCart, setAddedToCart] = useState(false);
    const [addedToFavorites, setAddedToFavorites] = useState(false);
    const [favorites, setFavorites] = useState([]);
    const [maxRating, setMaxRating] = useState([1, 2, 3, 4, 5]);
    const starImgFilled = 'https://github.com/tranhonghan/images/blob/main/star_filled.png?raw=true'
    const starImgCorner = 'https://github.com/tranhonghan/images/blob/main/star_corner.png?raw=true'

    const CustomRatingBar = () => {
        return (
            <View style={{ justifyContent: "center", flexDirection: "row"}}>
                {
                    maxRating.map((item, key) => {
                        return (
                            <TouchableOpacity
                                activeOpacity={0.7}
                                key={item}
                            >
                                <Image
                                    style={{ width: 20, height: 20, resizeMode: "cover" }}
                                    source={
                                        item <= rate
                                            ? { uri: starImgFilled }
                                            :
                                            { uri: starImgCorner }
                                    }
                                />
                            </TouchableOpacity>
                        )
                    })
                }
            </View>
        )
    }

    const fetchRank = async () => {
        try {
            const response = await axios.get(`http://10.0.2.2:8000/rank/${productId}`);
            
            if (response.data!=null) {
                setRate(Math.round(response.data.sum / response.data.size))
            }
        } catch (error) {
            console.log("error message", error);
        }
    };
    const fetchFavorites = () => {
        axios
            .get(`http://10.0.2.2:8000/favorites/${userId}`)
            .then((response) => {
                setFavorites(response.data);
                //console.log(response.data);

                const isAddedToFavorites = response.data.some(
                    (favorite) => favorite.productid._id === route.params.item._id
                );
                if (isAddedToFavorites) {
                    //console.log(isAddedToFavorites);
                    setAddedToFavorites(true);
                }
            })
            .catch((error) => {
                console.log("error", error);
            });
    };


    useFocusEffect(
        useCallback(() => {
            fetchFavorites();
            fetchRank();
            caculateTotal();
        }, [])
    );

    const caculateTotal = (x, y) => {
        setTotal(route.params.price - (route.params.price * route?.params?.offer / 100))
        //console.log(total);
    };

    useEffect(() => {
        caculateTotal();
        fetchRank();
    }, []);

    const addToFavorites = (item) => {
        if (addedToFavorites) {
            // Xóa product khỏi favorites
            axios
                .delete(`http://10.0.2.2:8000/favorites/${userId}/${item._id}`)
                .then((response) => {
                    Alert.alert("Success", "Product removed from favorites");
                    //console.log("my favorites:", response.data);
                    setAddedToFavorites(false);
                })
                .catch((error) => {
                    Alert.alert("Error", "Failed to remove product from favorites");
                    console.log("error", error);
                });
        } else {
            const favorite = {
                productid: item._id,
                price: (item.price - item.price * item?.offer / 100),
            }
            axios.post("http://10.0.2.2:8000/favorites", { userId, favorite }).then((response) => {
                Alert.alert("Success", "Product added successfully");
                //console.log("my favorites:", response.data);
                setAddedToFavorites(true);
            }).catch((error) => {
                Alert.alert("Error", "Failed to add product to favorites");
                console.log("error", error);
            })
        }
    };

    //main cart in user
    const addProductIntoCart = (item) => {
        const cart = {
            productid: item._id,
            price: (item.price - item.price * item?.offer / 100),
            quantity: 1
        }
        //console.log("cart api:", cart)
        axios.post("http://10.0.2.2:8000/cart", { userId, cart }).then((response) => {
            Alert.alert("Success", "Product added successfully");
            console.log("my cart:", response.data)

        }).catch((error) => {
            Alert.alert("Error", "Failed to add product")
            console.log("error", error)
        })
    };
    return (
        <ScrollView
            style={{ marginTop: 0, flex: 1, backgroundColor: "white" }}
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
                <ImageBackground
                    style={{ width, height: 300, marginTop: 25, resizeMode: "contain" }}
                    source={{ uri: route?.params?.image }}
                >

                </ImageBackground>
            </ScrollView>
            <View style={{ padding: 5, marginHorizontal: 10, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>

                <View style={{ width: 250 }}>
                    <Text style={{ fontSize: 18, fontWeight: "500" }}>
                        {route?.params?.title}
                    </Text>
                    <Text style={{ fontSize: 15, fontWeight: "normal", color: "grey" }}>
                        {route?.params?.category}
                    </Text>

                </View>
                <View>
                    {route?.params?.storage != 0 ? (
                        <Text style={{ color: "green", fontWeight: "500", fontSize: 15 }}>
                            Available In Stock
                        </Text>
                    ) :
                        (
                            <Text style={{ color: "red", fontWeight: "500", fontSize: 15 }}>
                                Out Of Stock
                            </Text>
                        )
                    }
                    <CustomRatingBar item={rate}/>
                    {/* <Text style={{ color: "black", fontWeight: "500", fontSize: 15 }}>
                        {route?.params?.storage} left
                    </Text> */}
                    <Text style={{ color: "black", fontWeight: "500", fontSize: 15 }}>
                        {route?.params?.sold} have been sold
                    </Text>
                </View>
            </View>





            <Text style={{ height: 1, borderColor: "#D0D0D0", borderWidth: 1, marginHorizontal: 100 }} />

            <View style={{ marginHorizontal: 11 }}>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginHorizontal: 10 }}>
                    <View style={{}}>
                        <Text style={{ fontSize: 18, fontWeight: "normal", color: "grey", }}>
                            Price {rate}
                        </Text>
                        {route?.params?.offer != 0 ? (
                            <Text style={{ fontSize: 18, fontWeight: "bold", textDecorationLine: 'line-through', textDecorationStyle: 'solid', color: '#555555' }}>
                                {route?.params?.price.toLocaleString('vi', { style: 'currency', currency: 'VND' })}

                            </Text>
                        ) : (
                            <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                                {route?.params?.price.toLocaleString('vi', { style: 'currency', currency: 'VND' })}

                            </Text>
                        )}

                    </View>
                    <View style={{ backgroundColor: "red", borderRadius: 60, width: 40, height: 40, alignItems: "center" }}>
                        <Text style={{ fontSize: 18, fontWeight: "bold", color: "white", marginTop: 7 }}>
                            {route?.params?.offer}%
                        </Text>
                    </View>
                </View>

                {/* <Text style={{ color: "#00CED1" }}>
                    FREE delivery Tomorrow by 3 PM.Order within 10hrs 30 mins
                </Text> */}


            </View>




            <View style={{ padding: 10, marginHorizontal: 11 }}>
                <Text style={{ fontSize: 15, fontWeight: "bold" }} >Description: </Text>
                <Text style={{ fontSize: 14, fontWeight: "normal", color: "grey" }}>
                    {route?.params?.description}
                </Text>
            </View>
            <Text style={{ height: 1, borderColor: "#D0D0D0", borderWidth: 1, marginHorizontal: 100 }} />

            <View
                style={{
                    flexDirection: "row",
                    marginVertical: 5,
                    alignItems: "center",
                    gap: 5, marginHorizontal: 10
                }}
            >
                <Ionicons name="location" size={24} color="#00CED1" />

                <Text style={{ fontSize: 15, fontWeight: "500", color: "#00CED1" }}>
                    Deliver In Vietnam regions
                </Text>
            </View>

            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginHorizontal: 14 }}>
                <View>
                    <Text style={{ fontSize: 18, fontWeight: "normal", color: "grey" }}>
                        Total
                    </Text>
                    <Text style={{ fontSize: 18, fontWeight: "bold" }} >{total.toLocaleString('vi', { style: 'currency', currency: 'VND' })}</Text>

                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Pressable
                        onPress={() => addToFavorites(route?.params?.item)}
                    >
                        <AntDesign name={addedToFavorites ? 'heart' : 'hearto'} size={32} color={addedToFavorites ? 'red' : 'black'} />
                    </Pressable>
                    {route?.params?.storage != 0 ? (
                        <Pressable
                            onPress={() => addProductIntoCart(route?.params?.item)}
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
                    ) : (
                        <Pressable

                            style={{
                                //backgroundColor: "#FFC72C",
                                padding: 10,
                                borderRadius: 10,
                                borderWidth: 1,
                                borderColor: "#D0D0D0",
                                justifyContent: "center",
                                alignItems: "center",
                                marginHorizontal: 10,
                                marginVertical: 10,
                            }}
                        >
                            <Text style={{ fontWeight: "bold" }}>Out of stock</Text>
                        </Pressable>
                    )}

                </View>
            </View>

        </ScrollView>
    )
}

export default ProductInfoScreen

const styles = StyleSheet.create({})