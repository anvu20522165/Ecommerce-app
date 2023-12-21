import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Platform,
  ScrollView,
  Pressable,
  TextInput,
  FlatList,
} from "react-native";
import { FontAwesome5, Ionicons, FontAwesome } from "@expo/vector-icons";
import React, { useEffect, useContext, useState, useCallback } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import axios from "axios";
import { AntDesign } from "@expo/vector-icons";
import moment from "moment";
import DropDownPicker from "react-native-dropdown-picker";

export default function ViewOrdersScreen() {
  const [open, setOpen] = useState(false);

  const navigation = useNavigation();
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState("Pending");
  const [items, setItems] = useState([
    { label: "Pending", value: "Pending" },
    { label: "Shipping", value: "Shipping" },
    { label: "Delivered", value: "Delivered" },
  ]);
  const fetchOrders = async () => {
    try {
      const ordersResponse = await axios.get("http://10.0.2.2:8000/orders");
      setOrders(ordersResponse.data);
      console.log("all data", ordersResponse.data);
    } catch (error) {
      console.log("error message", error);
    }
  };
  useEffect(() => {
    
    fetchOrders();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchOrders();
    }, [])
  );
  let filteredOrders = orders.filter((item) => item.status === status);
  useEffect(() => {
    filteredOrders = orders.filter((item) => item.status === status);
  }, [orders, status]);
  return (
    <SafeAreaView style={styles.container}>

      <Text style={styles.textTitle}>View all orders</Text>
      <Pressable
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          backgroundColor: "white",
          borderRadius: 5,
          height: 38,
          marginHorizontal: 15,
          shadowColor: "#000",
          shadowOffset: { width: 1, height: 1 },
          shadowOpacity: 0.5,
          shadowRadius: 1,
          elevation: 2,
          marginBottom: 20,
        }}
      >
        <AntDesign
          style={{ paddingLeft: 10 }}
          name="search1"
          size={18}
          color="black"
        />
        <TextInput placeholder="Find Order" />
      </Pressable>
      <View
        style={{
          marginHorizontal: 10,

          width: "45%",
          marginBottom: 60,
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
          placeholder="Choose category"
          placeholderStyle={styles.placeholderStyles}
          zIndex={3000}
          zIndexInverse={1000}
        />
      </View>
      {filteredOrders.length === 0 ? (
      <Text style={styles.noOrdersText}>No orders found</Text>
    ) : (
      <FlatList
        data={orders.filter((item) => item.status === status)}
        renderItem={({ item, index }) => {
          return (
            <View style={styles.productListView} key={index}>
              <View style={{ flexDirection: "row" }}>
                <View
                  style={{ flexDirection: "column", alignItems: "flex-start" }}
                >
                  <Text
                    style={{ fontSize: 16, fontWeight: "bold", marginBottom: 5 }}
                  >
                    Order #{" "}
                    {item._id.length > 10 ? item._id.slice(0, 10) : item._id}
                  </Text>
                  <Text style={{ fontSize: 14, marginBottom: 3 }}>
                    Total amount: {item.totalPrice} VNĐ
                  </Text>
                  <Text style={{ fontSize: 14, marginBottom: 3 }}>
                    {moment(item.createdAt).format("DD/MM/YY, h:mm A")}
                  </Text>
                  <Text style={{ fontSize: 14, marginBottom: 10 }}>
                    Status: {item.status}
                  </Text>
                  <View>
                    <Pressable
                      onPress={() =>
                        navigation.navigate("ViewOrderDetailScreen", {
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
                        height: 26,
                        width: 75,

                      }}
                    >
                      <Text style={{ fontWeight: "bold" }}>Details</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            </View>
          )
        }}
      />)}

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafa",
  },
  textTitle: {
    fontSize: 25,
    fontWeight: "bold",
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 10,
  },
  description: {
    fontSize: 18,
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  productListView: {
    //marginTop:5,
    backgroundColor: "#fff",
    marginHorizontal: 15,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 1,
    elevation: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
