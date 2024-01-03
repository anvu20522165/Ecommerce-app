import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Platform,
  ScrollView,
  Pressable,
  TextInput,
  Image,
  StatusBar,
  FlatList,
} from "react-native";
import React, { useEffect, useContext, useState, useCallback } from "react";
import { Feather } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { SliderBox } from "react-native-image-slider-box";
import axios from "axios";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { BottomModal, SlideAnimation, ModalContent } from "react-native-modals";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserType } from "../UserContext";
import jwt_decode from "jwt-decode";
const HomeScreen = () => {
  const list = [
    {
      id: "0",
      image:
        "https://m.media-amazon.com/images/G/31/img20/Events/Jup21dealsgrid/blockbuster.jpg",
      name: "Deals",
    },
    {
      id: "1",
      image: "https://m.media-amazon.com/images/I/51dZ19miAbL._AC_SY350_.jpg",
      name: "Men",
    },
    {
      id: "2",
      image: "https://th.bing.com/th/id/OIP.5U_tIKHGTL_Vk5GrCtrXCQHaLH?w=740&h=1110&rs=1&pid=ImgDetMain",
      name: "Women",
    },
    
    {
      id: "3",
      image:
        "https://th.bing.com/th/id/R.253593ed780f11373723109b80feac44?rik=a7KnhjnhhjDF8Q&riu=http%3a%2f%2fww1.prweb.com%2fprfiles%2f2012%2f10%2f31%2f10079702%2femily_qtrbnd_5.jpg&ehk=TKW64JUxLcMUzj9%2fTLQLsU%2ftMvpWU%2b7dNs%2bjmzG7e8c%3d&risl=&pid=ImgRaw&r=0",
      name: "Jewelery",
    },
    {
      id: "4",
      image:
        "https://th.bing.com/th/id/OIP.oQ9gioHYyztzuhHEVAu9OQHaHa?rs=1&pid=ImgDetMain",
      name: "Accessory",
    },
    {
      id: "5",
      image:
        "https://i5.walmartimages.com/asr/618a647e-36db-47da-85d9-d449f283271b.734ddc164b4b2d29f9eb3d6ba8085450.jpeg",
      name: "Shoes",
    },
    
  ];
  const images = [
    "https://i.pinimg.com/originals/60/b0/a4/60b0a4ee7e032a6281444a82705a665c.jpg",
    "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/85fb4e56509989.59b1565f7cc0e.jpg",
    "https://i.pinimg.com/originals/6f/39/35/6f393516f4f2876c5ff1b8ddcf57c638.jpg",
  ];
  const [deals, setDeals] = useState([]);
  const [offers, setOffers] = useState([]);
  const [newProducts, setNewProducts] = useState([]);
  const navigation = useNavigation();
  const [addresses, setAddresses] = useState([]);
  const { userId, setUserId } = useContext(UserType);
  const [selectedAddress, setSelectedAdress] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [categories, setCategories] = useState([]);

  console.log(selectedAddress)
  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://10.0.2.2:8000/categories");
      setCategories(response.data);
     
    } catch (error) {
      console.log("error message", error);
    }
  };
  const fetchTrendingData = async () => {
    try {
      const response = await axios.get("http://10.0.2.2:8000/trendingproducts");

      setDeals(response.data);
    } catch (error) {
      console.log("error message", error);
    }
  };

  const fetchOffers = async () => {
    try {
      const response = await axios.get("http://10.0.2.2:8000/saleproducts");

      setOffers(response.data);
    } catch (error) {
      console.log("error message", error);
    }
  };

  const fetchNewData = async () => {
    try {
      const response = await axios.get("http://10.0.2.2:8000/newproducts");

      setNewProducts(response.data);
      //console.log("trending data", response.data);
    } catch (error) {
      console.log("error message", error);
    }
  };
  useEffect(() => {
    fetchTrendingData();
    fetchOffers();
    fetchNewData();
    fetchCategories();
  }, []);

  useFocusEffect(
    useCallback(() => {[
      fetchNewData(),
      fetchCategories(),
    ]}, [])
  );

  useEffect(() => {
    if (userId) {

      fetchAddresses();
    }

  }, [userId, modalVisible]);
  const fetchAddresses = async () => {
    try {
      const response = await axios.get(
        `http://10.0.2.2:8000/addresses/${userId}`
      );
      const { addresses } = response.data;
      setAddresses(addresses);
    } catch (error) {
      console.log("error", error);
    }
  };
  const fetchUser = async () => {
    const token = await AsyncStorage.getItem("authToken");
    const decodedToken = jwt_decode(token);
    const userId = decodedToken.userId;
    setUserId(userId);
  };
  useEffect(() => {
    fetchUser();
  }, []);

  const handleCategorySelect = (category) => {
    navigation.navigate("Products",{
      category: category,
    });
  };
  return (
    <>
      <SafeAreaView
        style={{
          paddinTop: Platform.OS === "android" ? 40 : 0,
          flex: 1,
          backgroundColor: "white",
        }}
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
            onPress={() => navigation.navigate("ProductsSearch")}
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
              <Text style={{color:'#555555'}}>Search in Shein</Text>
            </Pressable>

            {/* <Feather name="mic" size={24} color="black" /> */}
          </View>

          <Pressable
            onPress={() => setModalVisible(!modalVisible)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              padding: 10,
              backgroundColor: "#AFEEEE",
            }}
          >
            <Ionicons name="location-outline" size={24} color="black" />

            <Pressable>
              {selectedAddress ? (
                <Text>
                  Deliver to {selectedAddress?.name} - {selectedAddress?.street}
                </Text>
              ) : (
                <Text style={{ fontSize: 13, fontWeight: "500" }}>
                  Select a Address
                </Text>
              )}
            </Pressable>

            <MaterialIcons name="keyboard-arrow-down" size={24} color="black" />
          </Pressable>
        <StatusBar barStyle="light-content"/>
        <ScrollView>
        



          <SliderBox
            images={images}
            autoPlay
            circleLoop
            dotColor={"#13274F"}
            inactiveDotColor="#90A4AE"
            ImageComponentStyle={{ width: "100%" }}
          />


          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        <ScrollView
          horizontal={true}
          style={styles.exception}
          showsHorizontalScrollIndicator={false}
        >
          <Pressable onPress={() => handleCategorySelect("all")}>
            <View
              style={[
                styles.flatlist,
                /*{ marginLeft: 20 },*/
                /*selectedCategory === "all" && styles.selectedCategory,*/
              ]}
            >
              <Image source={{ uri: list[0].image }} style={styles.categoryImage} />
              <Text
                style={[
                  styles.categories,
                  /*selectedCategory === "all" && styles.selectedText,*/
                ]}
              >
                All
              </Text>
            </View>
          </Pressable>
          <FlatList
            data={categories}
            renderItem={({ item, index }) => (
              <Pressable onPress={() => handleCategorySelect(item.name)}>
                <View
                  style={[
                    styles.flatlist,
                    /*selectedCategory === item.name && styles.selectedCategory,*/
                  ]}
                >
                  <Image
                    source={{ uri: list[index + 1].image }}
                    style={styles.categoryImage}
                    resizeMode="contain"
                  />
                  <Text
                    style={[
                      styles.categories,
                      /*selectedCategory === item.name && styles.selectedText,*/
                    ]}
                  >
                    {item.name}
                  </Text>
                </View>
              </Pressable>
            )}
            keyExtractor={(item, index) => index.toString()}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
          />
        </ScrollView>
      </ScrollView>
          <Text style={{ padding: 10, fontSize: 18, fontWeight: "bold" }}>
            Most Sold Products
          </Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {deals.map((item, index) => (
              <Pressable
                onPress={() =>
                  navigation.navigate("Info", {
                    _id: item._id,
                    title: item.title,
                    price: item?.price,

                    description: item?.description,
                    category: item?.category,
                    image: item?.image,
                    offer: item?.offer,
                    storage: item?.storage,
                    sold: item?.sold,
                    item: item,

                  })
                }
                style={{
                  marginVertical: 10,
                  marginHorizontal: 15,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Image
                  style={{ width: 120, height: 120, resizeMode: "contain" }}
                  source={{ uri: item?.image }}
                />
                <Text
                  style={{
                    textAlign: "center",
                    color: "black",
                    fontSize: 12,
                    fontWeight: "bold",
                    marginTop: 5,
                    width: 150
                  }}
                >
                  {item?.title}
                </Text>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                  <View>
                    <Text
                      style={{
                        textAlign: "center",
                        color: "red",
                        fontSize: 13,
                        fontWeight: "bold",
                        marginTop: 5,
                        marginLeft: -70
                      }}
                    >
                      {item?.price.toLocaleString('vi', { style: 'currency', currency: 'VND' })}
                    </Text>
                  </View>
                  <View>
                    <Text
                      style={{
                        textAlign: "center",
                        color: "black",
                        fontSize: 13,
                        fontWeight: "bold",
                        marginTop: 5,
                        marginRight: -90
                      }}
                    >
                      {item?.sold} sold
                    </Text>
                  </View>
                </View>


              </Pressable>
            ))}
          </ScrollView>

          <Text
            style={{
              height: 1,
              borderColor: "#D0D0D0",
              borderWidth: 2,
              marginTop: 15,
            }}
          />

          <Text style={{ padding: 10, fontSize: 18, fontWeight: "bold" }}>
            Flash sale
          </Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {offers.map((item, index) => (
              <Pressable
                onPress={() =>
                  navigation.navigate("Info", {
                    _id: item._id,
                    title: item.title,
                    price: item?.price,

                    description: item?.description,
                    category: item?.category,
                    image: item?.image,
                    offer: item?.offer,
                    storage: item?.storage,
                    sold: item?.sold,
                    item: item,

                  })
                }
                style={{
                  marginVertical: 10,
                  marginHorizontal: 15,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <View style={{
                  position: "relative",
                }}>
                  <View style={{ backgroundColor: "red", borderRadius: 60, width: 30, height: 30, marginLeft: 95, marginTop: -10, alignItems: "center", position: "absolute", resizeMode: "contain" }}>
                    <Text style={{ fontSize: 14, fontWeight: "bold", color: "white", marginTop: 4 }}>
                      {item?.offer}%
                    </Text>
                  </View>

                  <Image
                    style={{ width: 100, height: 100, resizeMode: "contain", }}
                    source={{ uri: item?.image }}
                  />
                </View>


                <Text
                  style={{
                    textAlign: "center",
                    color: "black",
                    fontSize: 12,
                    fontWeight: "bold",
                    marginTop: 5,
                    width: 150
                  }}
                >
                  {item?.title}
                </Text>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", }}>
                  <View>
                    <Text
                      style={{
                        textAlign: "center",
                        color: "red",
                        fontSize: 13,
                        fontWeight: "bold",
                        marginTop: 5,

                      }}
                    >
                      {(item?.price - item?.price*item?.offer/100).toLocaleString('vi', { style: 'currency', currency: 'VND' })}
                    </Text>
                  </View>

                </View>


              </Pressable>
            ))}
          </ScrollView>
          <Text
            style={{
              height: 1,
              borderColor: "#D0D0D0",
              borderWidth: 2,
              marginTop: 15,
            }}
          />
          <Text style={{ padding: 10, fontSize: 18, fontWeight: "bold" }}>
            Brand New Products
          </Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {newProducts.map((item, index) => (
              <Pressable
                onPress={() =>
                  navigation.navigate("Info", {
                    _id: item._id,
                    title: item.title,
                    price: item?.price,

                    description: item?.description,
                    category: item?.category,
                    image: item?.image,
                    offer: item?.offer,
                    storage: item?.storage,
                    sold: item?.sold,
                    item: item,

                  })
                }
                style={{
                  marginVertical: 10,
                  marginHorizontal: 15,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Image
                  style={{ width: 120, height: 120, resizeMode: "contain" }}
                  source={{ uri: item?.image }}
                />
                <Text
                  style={{
                    textAlign: "center",
                    color: "black",
                    fontSize: 12,
                    fontWeight: "bold",
                    marginTop: 5,
                    width: 150
                  }}
                >
                  {item?.title}
                </Text>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                  <View>
                    <Text
                      style={{
                        textAlign: "center",
                        color: "red",
                        fontSize: 13,
                        fontWeight: "bold",
                        marginTop: 5,
                        marginLeft: -70
                      }}
                    >
                      {item?.price.toLocaleString('vi', { style: 'currency', currency: 'VND' })}
                    </Text>
                  </View>
                  <View>
                    <Text
                      style={{
                        textAlign: "center",
                        color: "black",
                        fontSize: 13,
                        fontWeight: "bold",
                        marginTop: 5,
                        marginRight: -90
                      }}
                    >
                      {item?.sold} sold
                    </Text>
                  </View>
                </View>


              </Pressable>
            ))}
          </ScrollView>


        </ScrollView>
      </SafeAreaView>


      <BottomModal
        onBackdropPress={() => setModalVisible(!modalVisible)}
        swipeDirection={["up", "down"]}
        swipeThreshold={200}
        modalAnimation={
          new SlideAnimation({
            slideFrom: "bottom",
          })
        }
        onHardwareBackPress={() => setModalVisible(!modalVisible)}
        visible={modalVisible}
        onTouchOutside={() => setModalVisible(!modalVisible)}
      >
        <ModalContent style={{ width: "100%", height: 400 }}>
          <View style={{ marginBottom: 8 }}>
            <Text style={{ fontSize: 16, fontWeight: "500" }}>
              Choose your Location
            </Text>

            <Text style={{ marginTop: 5, fontSize: 16, color: "gray" }}>
              Select a delivery location to see product availabilty and delivery
              options
            </Text>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {/* already added addresses */}
            {addresses?.map((item, index) => (
              <Pressable
                onPress={() => setSelectedAdress(item)}
                style={{
                  width: 140,
                  height: 140,
                  borderColor: "#D0D0D0",
                  borderWidth: 1,
                  padding: 10,
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 3,
                  marginRight: 15,
                  marginTop: 10,
                  backgroundColor: selectedAddress === item ? "#FBCEB1" : "white"
                }}
              >
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 3 }}
                >
                  <Text style={{ fontSize: 13, fontWeight: "bold" }}>
                    {item?.name}
                  </Text>
                  <Entypo name="location-pin" size={24} color="red" />
                </View>

                <Text
                  numberOfLines={1}
                  style={{ width: 130, fontSize: 13, textAlign: "center" }}
                >
                  {item?.houseNo},{item?.landmark}
                </Text>

                <Text
                  numberOfLines={1}
                  style={{ width: 130, fontSize: 13, textAlign: "center" }}
                >
                  {item?.street}
                </Text>
                <Text
                  numberOfLines={1}
                  style={{ width: 130, fontSize: 13, textAlign: "center" }}
                >
                  Vietnam
                </Text>
              </Pressable>
            ))}

            <Pressable
              onPress={() => {
                setModalVisible(false);
                navigation.navigate("Address");
              }}
              style={{
                width: 140,
                height: 140,
                borderColor: "#D0D0D0",
                marginTop: 10,
                borderWidth: 1,
                padding: 10,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  color: "#0066b2",
                  fontWeight: "500",
                }}
              >
                Add an Address or pick-up point
              </Text>
            </Pressable>
          </ScrollView>


        </ModalContent>
      </BottomModal>
    </>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  flatlist:{
    margin: 10,
                  justifyContent: "center",
                  alignItems: "center",
  },
  categoryImage:{
    width: 65, height: 65, resizeMode: "contain" 
  },
  categories:{
    textAlign: "center",
                    fontSize: 12,
                    fontWeight: "500",
                    marginTop: 5,
  }
});