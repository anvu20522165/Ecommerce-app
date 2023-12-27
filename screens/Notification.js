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
  FlatList,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import SelectDropdown from 'react-native-select-dropdown'
import React, { useEffect, useContext, useState, useCallback } from "react";
import moment from "moment";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { UserType } from '../UserContext';
import axios from "axios";
const Notification = () => {


  const navigation = useNavigation();


  const { userId, setUserId } = useContext(UserType);
  const [user, setUser] = useState([]);
  const [noti, setNoti] = useState([]);
  const fetchUser = async () => {
    try {
      const response = await axios.get(
        `http://10.0.2.2:8000/user/${userId}`
      );
      //const { userData } = response.data;
      //console.log(response.data)
      setUser(response.data);
    } catch (error) {
      console.log("error", error);
    }
  };

  const fetchNotification = async () => {
    try {
      const response = await axios.get(
        `http://10.0.2.2:8000/notification/${userId}`
      );
      //const { userData } = response.data;
      //console.log(response.data)
      setNoti(response.data);
    } catch (error) {
      console.log("error", error);
    }
  };

  const deleteNoti = async (notiId) => {
    try {
      const response = await axios.delete(
        `http://10.0.2.2:8000/notification/${notiId}`
      );
      fetchNotification();
    } catch (error) {
      console.log("error", error);
    }
  };

  const updateNoti = async (id) => {
    try {
      const response = await axios.put(
        `http://10.0.2.2:8000/updateClickNotification/${id}`
      );
      fetchNotification();
    } catch (error) {
      console.log("error", error);
    }
  }

  const actionAfter = async (order, id) => {
    try {
      updateNoti(id)     
        navigation.navigate("MyOrdersDetails", {
          _id: order.orderid._id,
          shippingAddress: order.orderid.shippingAddress,
          products: order.orderid.products,
          paymentMethod: order.orderid.paymentMethod,
          delivery: order.orderid.delivery,
          status: order.orderid.status,
          totalPrice: order.orderid.totalPrice,
          createdAt: order.orderid.createdAt,
          item: order.orderid,
        })
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    if (userId) {
      console.log("user id:", userId)
      fetchUser();
    }
  }, [userId]);

  useFocusEffect(
    useCallback(() => {
      fetchUser();
      fetchNotification();
    }, [])
  );
  return (
    <SafeAreaView>
      <ScrollView>
        <View style={{ marginHorizontal: 20 }}>
          <Pressable>

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
              }}
            >


              <View style={{ marginLeft: 6, marginVertical: 5 }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 3,
                    marginVertical: 10
                  }}
                >


                  <Image
                    style={{ width: 60, height: 60, resizeMode: "contain", borderRadius: 15 }}
                    source={{ uri: user?.avatar }}
                  />
                  <View style={{ marginLeft: 15 }}>
                    <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                      {user?.name}
                    </Text>
                    <Text style={{ fontSize: 14 }}>
                      {user?.email}
                    </Text>
                  </View>
                </View>



              </View>
            </Pressable>

          </Pressable>
          <Pressable>

            <FlatList
              data={noti}
              renderItem={({ item, index }) => {
                return (

                  <Pressable style={{

                    marginVertical: 3,
                    borderRadius: 10,
                    marginTop: 13,
                    borderWidth: 1,
                    borderColor: "#D0D0D0",

                  }}>
                    {item.isClicked == true ? (
                      <View style={{
                        backgroundColor: "#e0ffff",
                        borderRadius: 10,
                        borderWidth: 1,
                        borderColor: "#D0D0D0",

                      }}>
                        <Pressable
                          style={{
                            marginHorizontal: 5
                          }}
                        >

                          <Pressable
                            style={{ left: 350 }}
                            onPress={() => deleteNoti(item._id)}
                          >
                            <MaterialIcons name="delete" size={26} color="black" />
                          </Pressable>


                          <Pressable
                            style={{

                              borderRadius: 5,

                              marginHorizontal: 10,
                              marginTop: 5,
                            }}
                          >
                            <Text style={{ fontWeight: "bold", fontSize: 19 }}>Order #{item.orderid._id}</Text>

                          </Pressable>

                        </Pressable>


                        <View style={{ flexDirection: "row" }}>
                          <View>
                            <Pressable
                              onPress={() =>
                                actionAfter(item, item._id)
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
                              Update on your order
                            </Text>
                            <Text
                              style={{
                                padding: 10,
                                fontSize: 14,
                                fontWeight: "400",
                                marginTop: 5,
                              }}
                            >
                              Date: {moment(item.time).format("DD/MM/YY, h:mm A")}
                            </Text>

                          </View>

                        </View>
                      </View>)
                      : (
                        <View style={{
                          // backgroundColor: "#e0ffff",
                          borderRadius: 10,
                          borderWidth: 1,
                          borderColor: "#D0D0D0",

                        }}>
                          <Pressable
                            style={{
                              marginHorizontal: 5
                            }}
                          >
                            <Pressable
                              style={{ left: 350 }}
                              onPress={() => deleteNoti(item._id)}
                            >
                              <MaterialIcons name="delete" size={26} color="black" />
                            </Pressable>
                            <Pressable
                              style={{

                                borderRadius: 5,

                                marginHorizontal: 10,
                                marginTop: 5,
                              }}
                            >
                              <Text style={{ fontWeight: "bold", fontSize: 19 }}>Order #{item.orderid._id}</Text>

                            </Pressable>

                          </Pressable>


                          <View style={{ flexDirection: "row" }}>
                            <View>
                              <Pressable
                                onPress={() =>
                                  actionAfter(item, item._id)
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
                                Update on your order
                              </Text>
                              <Text
                                style={{
                                  padding: 10,
                                  fontSize: 14,
                                  fontWeight: "400",
                                  marginTop: 5,
                                }}
                              >
                                Date: {moment(item.time).format("DD/MM/YY, h:mm A")}
                              </Text>

                            </View>

                          </View>
                        </View>
                      )}

                  </Pressable>
                )
              }}
              keyExtractor={(item, index) => index.toString()}
            //ItemSeparatorComponent={}
            />

          </Pressable>


        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Notification