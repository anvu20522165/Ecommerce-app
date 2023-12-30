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
import {
  addToCart,
  cleanCart,
  initCart
} from "../redux/CartReducer";
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { UserType } from "../UserContext";
import Checkbox from 'expo-checkbox'
import axios from "axios";
// import CheckBox from 'expo-checkbox';
const CartScreen = () => {
  const [cartApi, setCartApi] = useState([]);
  const { userId, setUserId, setCartNumber } = useContext(UserType);
  const cart = useSelector((state) => state.cart.cart);
  const total = cart
    ?.map((item) => item.price * item.quantity)
    .reduce((curr, prev) => curr + prev, 0);
  const dispatch = useDispatch();

  const navigation = useNavigation();

  useEffect(() => {
    if (userId) {
      fetchCart();
    }
  }, [userId]);

  const fetchCart = async () => {
    try {
      const response = await axios.get(
        `http://10.0.2.2:8000/productsInCart/${userId}`
      );

      setCartApi(response.data);
      //console.log(response.data)
      dispatch(cleanCart())
      //dispatch(initCart(response.data))
      response.data.forEach(element => {
        if (element.isChecked == true) {
          console.log(element);
          dispatch(addToCart(element))
        }
      });
      setCartNumber(response.data.length);
    } catch (error) {
      console.log("error", error);
    }
  };
  useFocusEffect(
    useCallback(() => {
      fetchCart();
    }, [])
  );
  const increaseQuantity = async (productid) => {
    try {
      //console.log(productid)
      const response = await axios.put(
        `http://10.0.2.2:8000/cartIncreasedQuanity/${userId}/${productid}`,
      );
      //console.log("increased quantity:", response);
      //const { addresses } = response.data;
      //setAddresses(addresses);
      fetchCart();
    } catch (error) {
      console.log("error", error);
    }
  };

  const decreaseQuantity = async (productid) => {
    try {
      //console.log(productid)
      const response = await axios.put(
        `http://10.0.2.2:8000/cartDecreasedQuanity/${userId}/${productid}`,
      );
      //console.log("decreased quantity:", response);
      //const { addresses } = response.data;
      //setAddresses(addresses);
      fetchCart();
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleRemove = async (productid) => {
    try {
      //console.log(productid)
      const response = await axios.delete(
        `http://10.0.2.2:8000/cart/${userId}/${productid}`,
      );
      //console.log("delete:", response);
      //const { addresses } = response.data;
      //setAddresses(addresses);
      fetchCart();
    } catch (error) {
      console.log("error", error);
    }
  }

  const emptyCart = async (index) => {
    try {
      if (index != 0) {
        console.log("Length is not 0")
        const response = await axios.delete(
          `http://10.0.2.2:8000/cart/${userId}`,
        );
        setAllChecked(false)
        fetchCart();
      }
      else {
        console.log("Length is 0")
        Alert.alert("0 product selected", "Please choose the products to proceed next action");
      }
    } catch (error) {
      console.log("error", error);
    }
  }

  const setChecked = async (productid) => {
    try {
      //console.log(productid)
      const response = await axios.put(
        `http://10.0.2.2:8000/cart/checkedProduct/${userId}/${productid}`,
      );

      fetchCart();
    } catch (error) {
      console.log("error", error);
    }
  }

  const [allChecked, setAllChecked] = useState(false);
  const setAllCheckedAPI = async () => {
    try {

      if (allChecked) {

        const stringChecked = "true"
        const response = await axios.put(
          `http://10.0.2.2:8000/cart/checkedAll/${userId}`, { stringChecked }
        );
        setAllChecked(!allChecked)
        fetchCart();

      }
      else {

        const stringChecked = "false"
        const response = await axios.put(
          `http://10.0.2.2:8000/cart/checkedAll/${userId}`, { stringChecked }
        );
        setAllChecked(!allChecked)
        fetchCart();
      }

    } catch (error) {
      console.log("error", error);
    }
  }
  return (
    <ScrollView style={{ flex: 1, backgroundColor: "white" }}>
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

      <View style={{ padding: 10, flexDirection: "row", alignItems: "center" }}>
        <Text style={{ fontSize: 18, fontWeight: "400" }}>Subtotal : </Text>
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>{total.toLocaleString('vi', { style: 'currency', currency: 'VND' })}</Text>
      </View>
      <Text style={{ marginHorizontal: 10 }}>Taxes detail Available</Text>
      {cart.length == 0 ? (
        <Pressable
          onPress={() => {

            Alert.alert("Notification", "You haven't selected any products");
          }}
          style={{
            backgroundColor: "#FFC72C",
            padding: 10,
            borderRadius: 5,
            justifyContent: "center",
            alignItems: "center",
            marginHorizontal: 10,
            marginTop: 10,
          }}
        >
          <Text style={{ color: 'black', fontWeight: 'bold' }}>Proceed to Buy ({cart.length}) items</Text>
        </Pressable>
      ) : (
        <Pressable
          onPress={() => navigation.navigate("Confirmation")}
          style={{
            backgroundColor: "#FFC72C",
            padding: 10,
            borderRadius: 5,
            justifyContent: "center",
            alignItems: "center",
            marginHorizontal: 10,
            marginTop: 10,
          }}
        >
          <Text style={{ color: 'black', fontWeight: 'bold' }}>Proceed to Buy ({cart.length}) items</Text>
        </Pressable>
      )}

      {cart.length == 0 ? (
        <Pressable
          onPress={() => {

            Alert.alert("Notification", "You haven't selected any products");
          }}
          name="circle"
          size={20}
          color="gray"
          style={{
            backgroundColor: "red",
            padding: 10,
            borderRadius: 5,
            justifyContent: "center",
            alignItems: "center",
            marginHorizontal: 10,
            marginTop: 10,
          }}
        >
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Empty your cart</Text>
        </Pressable>
      ) : (
        <Pressable
          onPress={() => {

            Alert.alert("You're about to empty the Cart", "Are you sure?", [
              {
                text: "Cancel",
                onPress: () => console.log("Cancel is pressed"),
              },
              {
                text: "Confirm",
                onPress: () => emptyCart(cart.length),
              },
            ]);
          }}
          name="circle"
          size={20}
          color="gray"
          style={{
            backgroundColor: "red",
            padding: 10,
            borderRadius: 5,
            justifyContent: "center",
            alignItems: "center",
            marginHorizontal: 10,
            marginTop: 10,
          }}
        >
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Empty ({cart.length}) items</Text>
        </Pressable>
      )}
      <View style={{ marginTop: 5, marginHorizontal: 10, display: "flex", flexDirection: "row" }}>
        <View>
          <Checkbox value={allChecked} onValueChange={() => setAllCheckedAPI()} />
        </View>
        <View>
          <Text style={{ color: 'black', fontWeight: 'bold', marginHorizontal: 10 }}>Select all</Text>
        </View>
      </View>
      <Text
        style={{
          height: 1,
          borderColor: "#D0D0D0",
          borderWidth: 1,
          marginTop: 5,
        }}
      />

      <View style={{ marginHorizontal: 10 }}>
        {cartApi?.map((item, index) => (
          <View
            style={{
              backgroundColor: "white",
              marginVertical: 10,
              borderBottomColor: "#F0F0F0",
              borderWidth: 2,
              borderLeftWidth: 0,
              borderTopWidth: 0,
              borderRightWidth: 0,
            }}
            key={index}
          >
            <Checkbox value={item?.isChecked} onValueChange={() => setChecked(item.productid._id)} />
            <Pressable
              style={{
                marginVertical: 10,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <View>
                <Image
                  style={{ width: 140, height: 140, resizeMode: "contain" }}
                  source={{ uri: item?.productid.image }}
                />
              </View>

              <View>
                <Text numberOfLines={3} style={{ width: 150, marginTop: 10 }}>
                  {item?.productid.title}
                </Text>
                <Text
                  style={{ fontSize: 20, fontWeight: "bold", marginTop: 6 }}
                >
                  {item?.price.toLocaleString('vi', { style: 'currency', currency: 'VND' })}
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
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  borderRadius: 7,
                }}
              >
                {item?.quantity > 1 ? (
                  <Pressable
                    onPress={() => decreaseQuantity(item.productid._id)}
                    style={{
                      backgroundColor: "#D8D8D8",
                      padding: 7,
                      borderTopLeftRadius: 6,
                      borderBottomLeftRadius: 6,
                    }}
                  >
                    <AntDesign name="minus" size={24} color="black" />
                  </Pressable>
                ) : (
                  <Pressable
                    onPress={() => handleRemove(item.productid._id)}
                    style={{
                      backgroundColor: "#D8D8D8",
                      padding: 7,
                      borderTopLeftRadius: 6,
                      borderBottomLeftRadius: 6,
                    }}
                  >
                    <AntDesign name="delete" size={24} color="black" />
                  </Pressable>
                )}

                <Pressable
                  style={{
                    backgroundColor: "white",
                    paddingHorizontal: 18,
                    paddingVertical: 6,
                  }}
                >
                  <Text>{item?.quantity}</Text>
                </Pressable>

                <Pressable
                  onPress={() => increaseQuantity(item.productid._id)}
                  style={{
                    backgroundColor: "#D8D8D8",
                    padding: 7,
                    borderTopLeftRadius: 6,
                    borderBottomLeftRadius: 6,
                  }}
                >
                  <Feather name="plus" size={24} color="black" />
                </Pressable>
              </View>
              <Pressable
                onPress={() => handleRemove(item.productid._id)}
                style={{
                  backgroundColor: "white",
                  paddingHorizontal: 8,
                  paddingVertical: 10,
                  borderRadius: 5,
                  borderColor: "#C0C0C0",
                  borderWidth: 0.6,
                }}
              >
                <Text>Delete</Text>
              </Pressable>
            </Pressable>

            <Pressable
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                marginBottom: 15,
              }}
            >


              <Pressable
                style={{
                  backgroundColor: "white",
                  paddingHorizontal: 8,
                  paddingVertical: 10,
                  borderRadius: 5,
                  borderColor: "#C0C0C0",
                  borderWidth: 0.6,
                }}
              >
                <Text>See More Like this</Text>
              </Pressable>
            </Pressable>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default CartScreen;

const styles = StyleSheet.create({});