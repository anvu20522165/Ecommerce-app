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
    TouchableOpacity, Image, FlatList,
} from "react-native";

import React, { useEffect, useState, useContext, useCallback } from "react";
import { AntDesign, Feather } from "@expo/vector-icons";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { useRoute, useFocusEffect, useNavigation } from "@react-navigation/native";

import { UserType } from "../../UserContext";
import axios from "axios";
const ViewProductFeedbackScreen = () => {
    const { userId, setUserId, setCartNumber } = useContext(UserType);
    const navigation = useNavigation();
    const route = useRoute();
    const [productId, setProductId] = useState(route.params._id);
    const [rate, setRate] = useState(0);

    const { width } = Dimensions.get("window");
    const height = (width * 100) / 100;
    const [total, setTotal] = useState(false);
    const [maxRating, setMaxRating] = useState([1, 2, 3, 4, 5]);
    const [feedbacksWithUserNames,setFeedbacksWithUserNames] =useState([]);
    const starImgFilled = 'https://github.com/tranhonghan/images/blob/main/star_filled.png?raw=true'
    const starImgCorner = 'https://github.com/tranhonghan/images/blob/main/star_corner.png?raw=true'

    const CustomRatingBar = ({rate}) => {
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
    

    const fetchFeedbacksWithUserNames = async () => {
        try {
          const usersResponse = await axios.get("http://10.0.2.2:8000/users");
          const feedbackResponse = await axios.get(`http://10.0.2.2:8000/feedback/${productId}`);
          
          const users = usersResponse.data;
          const feedback = feedbackResponse.data;
          
          const feedbacksWithUserNames = feedback.map(feedback => {
            const user = users.find(user => user._id === feedback.userid);
            const userName = user ? user.name : "Unknown User";
            return {
              ...feedback,
              userName
            };
          });
    
          setFeedbacksWithUserNames(feedbacksWithUserNames);
          console.log("named",feedbacksWithUserNames);
        } catch (error) {
          console.log("error message", error);
        }
      };
    
      
     

    const fetchRank = async () => {
        try {
            const response = await axios.get(`http://10.0.2.2:8000/rank/${productId}`);
            
            if (response.data!=null) {
                setRate(Math.round(response.data.sum / response.data.size))
            }
            console.log("productid",productId);
        } catch (error) {
            console.log("error message", error);
        }
    };
    


    useFocusEffect(
        useCallback(() => {
            fetchRank();
            caculateTotal();
            fetchFeedbacksWithUserNames();
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
            console.log("my cart:", response.data);
            setCartNumber(response.data.length);
        }).catch((error) => {
            Alert.alert("Error", "Failed to add product")
            console.log("error", error)
        })
    };
    const handleDeleteFeedback= async (id)=>{
        try {
          console.log(id);
          const response = await axios.delete(
            `http://10.0.2.2:8000/feedback/${id}`, 
          );
          console.log("delete: ", response);
          fetchRank();
            fetchFeedbacksWithUserNames();
        } catch (error) {
          console.log("error", error);
        }
      }
    return (
        <View style={{flex:1}}>
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
                    onPress = {()=> navigation.navigate("ProductsSearch")}
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
                    <CustomRatingBar rate={rate}/>
                    {/* <Text style={{ color: "black", fontWeight: "500", fontSize: 15 }}>
                        {route?.params?.storage} left
                    </Text> */}
                    <Text style={{ color: "black", fontWeight: "500", fontSize: 15 }}>
                        {route?.params?.sold} have been sold
                    </Text>
                </View>
            </View>





            <Text style={{ height: 1, borderColor: "#D0D0D0", borderWidth: 1, marginHorizontal: 100, marginVertical: 10 }} />

            <View style={{ marginHorizontal: 11 }}>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginHorizontal: 10 }}>
                    <View style={{}}>
                        <Text style={{ fontSize: 18, fontWeight: "normal", color: "grey", }}>
                            Price 
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
            <Text style={{ height: 1, borderColor: "#D0D0D0", borderWidth: 1, marginHorizontal: 100, marginVertical: 10 }} />

            <View
                style={{
                    flexDirection: "row",
                    marginVertical: 5,
                    alignItems: "center",
                    gap: 5, marginHorizontal: 10
                }}
            >
                <Ionicons name="location" size={24} color="#00CED1" />

                <Text style={{ fontSize: 15, fontWeight: "500", color: "#00CED1", }}>
                    Deliver In Vietnam regions
                </Text>
            </View>
            {/* <Text style={{ height: 1, borderColor: "#D0D0D0", borderWidth: 1, marginHorizontal: 100, marginVertical: 10 }} /> */}
            <View style={{marginLeft: 15, marginTop: 10, marginBottom: 20}}>
                <Text style={{fontSize: 18, fontWeight: "500", marginBottom: 10 }}>Customers Feedback</Text>
                <FlatList
        data={feedbacksWithUserNames}
        renderItem={({item}) =>(
            <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
            <View style={{marginLeft: 10, alignContent: "flex-start", marginBottom: 10, borderBottomWidth: 1, borderBottomColor: "#D0D0D0", paddingBottom: 10, marginRight: 30}}>
                <View style={{flexDirection: "row", alignItems: "center", marginBottom: 5 }}>
                <Text style={{fontSize: 18, fontWeight: "500", marginRight: 15}}>{item.userName}</Text>
                <CustomRatingBar rate={item.rate}/>
                </View>
                <Text style ={{fontSize: 15}}>{item.comment}</Text>                

            </View>
            <Pressable
            onPress={()=>handleDeleteFeedback(item.orderid)}
            >
            <FontAwesome5
                name="trash-alt"
                size={16}
                color="white"
                style={{ backgroundColor: "red", padding: 8, borderRadius: 5, marginRight: 25 }}
              />
              </Pressable>
            </View>
    )}
        keyExtractor={(item, index) => index}
      />
                </View>

        </ScrollView>
         <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginHorizontal: 14, marginVertical: 5  }}>
         <View>
             <Text style={{ fontSize: 18, fontWeight: "normal", color: "grey" }}>
                 Total
             </Text>
             <Text style={{ fontSize: 18, fontWeight: "bold" }} >{total.toLocaleString('vi', { style: 'currency', currency: 'VND' })}</Text>

         </View>
        
     </View>
     </View>
    )
}

export default ViewProductFeedbackScreen;

const styles = StyleSheet.create({})