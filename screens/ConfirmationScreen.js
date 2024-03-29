import { StyleSheet, Text, View, ScrollView, Pressable, Alert } from "react-native";

import axios from "axios";
import { UserType } from "../UserContext";
import { Entypo } from "@expo/vector-icons";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useContext, useState, useCallback } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

import { cleanCart } from "../redux/CartReducer";


const ConfirmationScreen = () => {


  const steps = [
    { title: "Address", content: "Address Form" },
    { title: "Delivery", content: "Delivery Options" },
    { title: "Payment", content: "Payment Details" },
    { title: "Place Order", content: "Order Summary" },
  ];
  const navigation = useNavigation();
  const [currentStep, setCurrentStep] = useState(0);
  const [addresses, setAddresses] = useState([]);
  const { userId, setUserId, setCartNumber } = useContext(UserType);
  const cart = useSelector((state) => state.cart.cart);
  const total = cart
    ?.map((item) => item.price * item.quantity)
    .reduce((curr, prev) => curr + prev, 0);
  const [totalCost, setTotalCost] = useState();
  const [selectedDeliveryOption, setSelectedDeliveryOption] = useState("");
  useEffect(() => {
    fetchAddresses();
  }, []);
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
  const dispatch = useDispatch();

  const fetchCartNumber = async () => {
    try {
      const response = await axios.get(
        `http://10.0.2.2:8000/productsInCart/${userId}`
      );

      setCartNumber(response.data.length);

    } catch (error) {
      console.log("error", error);
    }
  };

  const handleAfterPayment = async () => {
    setCurrentStep(3);
    setTotalCost((selectedDeliveryOption === "fast delivery") ? total + deliveryFee : total);
  }

  const handleRemove = async (addressId) => {
    try {
      console.log(addressId)
      const response = await axios.delete(
        `http://10.0.2.2:8000/addresses/${userId}/${addressId}`, 
      );

      fetchAddresses();
    } catch (error) {
      console.log("error", error);
    }
  }
  const [selectedAddress, setSelectedAdress] = useState("");
  const [status, setStatus] = useState("Pending");
  const [selectedOption, setSelectedOption] = useState("");
  const [deliveryFee, setDeliveryFee] = useState(50000);
  const handlePlaceOrder = async () => {
    try {
      const delivery = {
        option: selectedDeliveryOption,
        fee: (selectedDeliveryOption === "fast delivery") ? deliveryFee : 0,
      }
      //console.log("my option", selectedDeliveryOption)
      const orderData = {
        userId: userId,
        cartItems: cart,
        totalPrice: total,
        shippingAddress: selectedAddress,
        paymentMethod: selectedOption,
        delivery: delivery,
        status: status,
        finalCost: totalCost,
      };


      const response = await axios.post(
        "http://10.0.2.2:8000/orders",
        orderData
      );
      if (response.status === 200) {
        navigation.navigate("Order");
        dispatch(cleanCart());
        fetchCartNumber();

        //setCurrentStep(0)
      } else {
        console.log("error creating order", response.data);
      }
    } catch (error) {
      console.log("errror", error.response.data);
    } finally {
      setCurrentStep(0)
    }
  };
  useFocusEffect(
    useCallback(() => {
      fetchAddresses()
    }, [])
  );
  return (
    <ScrollView style={{ marginTop: 55 }}>
      <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 40 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 20,
            justifyContent: "space-between",
          }}
        >
          {steps?.map((step, index) => (
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              {index > 0 && (
                <View
                  style={[
                    { flex: 1, height: 2, backgroundColor: "green" },
                    index <= currentStep && { backgroundColor: "green" },
                  ]}
                />
              )}
              <View
                style={[
                  {
                    width: 30,
                    height: 30,
                    borderRadius: 15,
                    backgroundColor: "#ccc",
                    justifyContent: "center",
                    alignItems: "center",
                  },
                  index < currentStep && { backgroundColor: "green" },
                ]}
              >
                {index < currentStep ? (
                  <Text
                    style={{ fontSize: 16, fontWeight: "bold", color: "white" }}
                  >
                    &#10003;
                  </Text>
                ) : (
                  <Text
                    style={{ fontSize: 16, fontWeight: "bold", color: "white" }}
                  >
                    {index + 1}
                  </Text>
                )}
              </View>
              <Text style={{ textAlign: "center", marginTop: 8 }}>
                {step.title}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {currentStep == 0 && (
        <View style={{ marginHorizontal: 20 }}>
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>
            Select Delivery Address
          </Text>
          {addresses.length != 0 ? (
            <Pressable>
              {addresses?.map((item, index) => (
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
                  {selectedAddress && selectedAddress._id === item?._id ? (
                    <FontAwesome5 name="dot-circle" size={20} color="#008397" />
                  ) : (
                    <Entypo
                      onPress={() => setSelectedAdress(item)}
                      name="circle"
                      size={20}
                      color="gray"
                    />
                  )}

                  <View style={{ marginLeft: 6 }}>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 3,
                      }}
                    >
                      <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                        {item?.name}
                      </Text>
                      <Entypo name="location-pin" size={24} color="red" />
                    </View>

                    <Text style={{ fontSize: 15, color: "#181818" }}>
                      {item?.houseNo}, {item?.landmark}
                    </Text>

                    <Text style={{ fontSize: 15, color: "#181818" }}>
                      {item?.street}
                    </Text>

                    <Text style={{ fontSize: 15, color: "#181818" }}>
                      Vietnam
                    </Text>

                    <Text style={{ fontSize: 15, color: "#181818" }}>
                      phone No : {item?.mobileNo}
                    </Text>
                    <Text style={{ fontSize: 15, color: "#181818" }}>
                      pin code : {item?.postalCode}
                    </Text>

                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 10,
                        marginTop: 7,
                      }}
                    >
                      <Pressable
                      onPress={() =>
                        navigation.navigate("EditAddress", {
                          _id: item._id,
                          name: item?.name,
                          mobileNo: item?.mobileNo,
                          houseNo: item?.houseNo,
                          street: item?.street,
                          landmark: item?.landmark,
                          
                          postalCode: item?.postalCode,
                          item: item,
                        })
                      }
                        style={{
                          backgroundColor: "#F5F5F5",
                          paddingHorizontal: 10,
                          paddingVertical: 6,
                          borderRadius: 5,
                          borderWidth: 0.9,
                          borderColor: "#D0D0D0",
                        }}
                      >
                        <Text>Edit</Text>
                      </Pressable>

                      <Pressable
                      onPress={() => handleRemove(item._id)}
                        style={{
                          backgroundColor: "#F5F5F5",
                          paddingHorizontal: 10,
                          paddingVertical: 6,
                          borderRadius: 5,
                          borderWidth: 0.9,
                          borderColor: "#D0D0D0",
                        }}
                      >
                        <Text>Remove</Text>
                      </Pressable>

                    </View>

                    <View>
                      {selectedAddress && selectedAddress._id === item?._id && (
                        <Pressable
                          onPress={() => setCurrentStep(1)}
                          style={{
                            backgroundColor: "#008397",
                            padding: 10,
                            borderRadius: 20,
                            justifyContent: "center",
                            alignItems: "center",
                            marginTop: 10,
                          }}
                        >
                          <Text style={{ textAlign: "center", color: "white" }}>
                            Deliver to this Address
                          </Text>
                        </Pressable>
                      )}
                    </View>
                  </View>
                </Pressable>
              ))}
            </Pressable>
          ) : (
            <Pressable style={{ marginVertical: 10 }}>
              <Text style={{ fontSize: 16, fontWeight: "bold", color: '#555555', }}>
                You haven't created any Addressess

              </Text>
              <Pressable
                onPress={() => {
                  navigation.navigate("Address");
                }}
                style={{
                  width: 140,
                  height: 140,
                  borderColor: "#D0D0D0",
                  marginTop: 15,
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

            </Pressable>
          )}

        </View>
      )}

      {currentStep == 1 && (
        <View style={{ marginHorizontal: 20 }}>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>
            Choose your delivery options
          </Text>

          <View
            style={{
              backgroundColor: "white",
              padding: 8,
              borderColor: "#D0D0D0",
              borderWidth: 1,
              flexDirection: "row",
              alignItems: "center",
              gap: 7,
              marginTop: 12,
            }}
          >
            {selectedDeliveryOption === "normal delivery" ? (
              <FontAwesome5 name="dot-circle" size={20} color="#008397" />
            ) : (
              <Entypo
                onPress={() => setSelectedDeliveryOption("normal delivery")}
                name="circle"
                size={20}
                color="gray"
              />
            )}


            <Text style={{ flex: 1 }}>
              <Text style={{ color: "green", fontWeight: "500" }}>
                Free Delivery
              </Text>{" "}
              - 5 days estimated
            </Text>
          </View>

          <View
            style={{
              backgroundColor: "white",
              padding: 8,
              borderColor: "#D0D0D0",
              borderWidth: 1,
              flexDirection: "row",
              alignItems: "center",
              gap: 7,
              marginTop: 12,
            }}
          >
            {selectedDeliveryOption === "fast delivery" ? (
              <FontAwesome5 name="dot-circle" size={20} color="#008397" />
            ) : (
              <Entypo
                onPress={() => setSelectedDeliveryOption("fast delivery")}
                name="circle"
                size={20}
                color="gray"
              />
            )}

            <Text style={{ flex: 1 }}>
              <Text style={{ color: "green", fontWeight: "500" }}>
                Fast Delivery
              </Text>{" "}
              - 2 days estimated - Extra Fee
            </Text>
          </View>

          <Pressable
            onPress={() => setCurrentStep(2)}
            style={{
              backgroundColor: "#FFC72C",
              padding: 10,
              borderRadius: 20,
              justifyContent: "center",
              alignItems: "center",
              marginTop: 15,
            }}
          >
            <Text>Continue</Text>
          </Pressable>
        </View>
      )}

      {currentStep == 2 && (
        <View style={{ marginHorizontal: 20 }}>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>
            Select your payment Method
          </Text>

          <View
            style={{
              backgroundColor: "white",
              padding: 8,
              borderColor: "#D0D0D0",
              borderWidth: 1,
              flexDirection: "row",
              alignItems: "center",
              gap: 7,
              marginTop: 12,
            }}
          >
            {selectedOption === "cash" ? (
              <FontAwesome5 name="dot-circle" size={20} color="#008397" />
            ) : (
              <Entypo
                onPress={() => setSelectedOption("cash")}
                name="circle"
                size={20}
                color="gray"
              />
            )}

            <Text>Cash on Delivery</Text>
          </View>


          <Pressable
            onPress={() => handleAfterPayment()}
            style={{
              backgroundColor: "#FFC72C",
              padding: 10,
              borderRadius: 20,
              justifyContent: "center",
              alignItems: "center",
              marginTop: 15,
            }}
          >
            <Text>Continue</Text>
          </Pressable>
        </View>
      )}

      {currentStep === 3 && selectedOption === "cash" && (
        <View style={{ marginHorizontal: 20 }}>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>Order Now</Text>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 8,
              backgroundColor: "white",
              padding: 8,
              borderColor: "#D0D0D0",
              borderWidth: 1,
              marginTop: 10,
            }}
          >
            <View>
              <Text style={{ fontSize: 17, fontWeight: "bold" }}>
                Save 5% and never run out
              </Text>
              <Text style={{ fontSize: 15, color: "gray", marginTop: 5 }}>
                Turn on auto deliveries
              </Text>
            </View>

            <MaterialIcons
              name="keyboard-arrow-right"
              size={24}
              color="black"
            />
          </View>

          <View
            style={{
              backgroundColor: "white",
              padding: 8,
              borderColor: "#D0D0D0",
              borderWidth: 1,
              marginTop: 10,
            }}
          >
            <Text>Shipping to {selectedAddress?.name}</Text>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: 8,
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: "500", color: "gray" }}>
                Items
              </Text>

              <Text style={{ color: "gray", fontSize: 16 }}>{total.toLocaleString('vi', { style: 'currency', currency: 'VND' })}</Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: 8,
              }}
            >

              <Text style={{ fontSize: 16, fontWeight: "500", color: "gray" }}>
                Delivery fee
              </Text>
              {selectedDeliveryOption === "fast delivery" ?
                (<Text style={{ color: "gray", fontSize: 16 }}>{deliveryFee.toLocaleString('vi', { style: 'currency', currency: 'VND' })}</Text>)
                :
                (<Text style={{ color: "gray", fontSize: 16 }}>free</Text>)}
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: 8,
              }}
            >
              <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                Order Total
              </Text>

              <Text
                style={{ color: "#C60C30", fontSize: 17, fontWeight: "bold" }}
              >
                {totalCost.toLocaleString('vi', { style: 'currency', currency: 'VND' })}
              </Text>
            </View>
          </View>

          <View
            style={{
              backgroundColor: "white",
              padding: 8,
              borderColor: "#D0D0D0",
              borderWidth: 1,
              marginTop: 10,
            }}
          >
            <Text style={{ fontSize: 16, color: "gray" }}>Pay With</Text>

            <Text style={{ fontSize: 16, fontWeight: "600", marginTop: 7 }}>
              {selectedOption}
            </Text>
          </View>

          <Pressable
            onPress={handlePlaceOrder}
            style={{
              backgroundColor: "#FFC72C",
              padding: 10,
              borderRadius: 20,
              justifyContent: "center",
              alignItems: "center",
              marginTop: 20,
            }}
          >
            <Text>Place your order</Text>
          </Pressable>
        </View>
      )}
    </ScrollView>
  );
};

export default ConfirmationScreen;

const styles = StyleSheet.create({});