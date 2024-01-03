import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useContext, useState, useCallback } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import HomeScreen from "../screens/HomeScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Entypo } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import ProductInfoScreen from "../screens/ProductInfoScreen";
import AddAddressScreen from "../screens/AddAddressScreen";
import AddressScreen from "../screens/AddressScreen";
import CartScreen from "../screens/CartScreen";
import ProfileScreen from "../screens/ProfileScreen";
import ConfirmationScreen from "../screens/ConfirmationScreen";
import OrderScreen from "../screens/OrderScreen";
import EditAddressScreen from "../screens/EditAddressScreen";
import PersonalDetailScreen from "../screens/profileLinks/PersonalDetailScreen";
import MyOrders from "../screens/profileLinks/MyOrders";
import MyOrdersDetails from "../screens/profileLinks/MyOrdersDetails";
import AdminDashboard from "../screens/admin/AdminDashboard";
import ViewProductsScreen from "../screens/admin/ViewProductsScreen";
import ViewUsersScreen from "../screens/admin/ViewUsersScreen";
import ViewOrdersScreen from "../screens/admin/order/ViewOrdersScreen";
import AddProductsScreen from "../screens/admin/AddProductsScreen";
import Products from "../screens/Products";
import FlatlistTemp from "../screens/profileLinks/FlatlistTemp";
import ViewOrderDetailScreen from "../screens/admin/order/ViewOrderDetailScreen";
import UpdateProductsScreen from "../screens/admin/UpdateProductsScreen";
import ViewCategoriesScreen from "../screens/admin/ViewCategoriesScreen";
import AddCategoriesScreen from "../screens/admin/AddCategoriesScreen";
import UpdateCategoriesScreen from "../screens/admin/UpdateCategoriesScreen";
import UpdatePassword from "../screens/profileLinks/UpdatePassword";
import MyFavorites from "../screens/profileLinks/MyFavorites";
import Notification from "../screens/Notification";
import axios from "axios";
import { UserType } from "../UserContext";
import FeedbackScreen from "../screens/FeedbackScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt_decode from "jwt-decode";
import ProductsSearch from "../screens/ProductsSearch";
import ViewLowStockScreen from "../screens/admin/ViewLowStockScreen";
import UpdateFeedBackScreen from "../screens/UpdateFeedbackScreen";
import ViewProductFeedbackScreen from "../screens/admin/ViewProductFeedbackScreen";

const StackNavigator = () => {
  const [notiNumber, setNotiNumber] = useState();
  const { userId, setUserId, cartNumber, setCartNumber } = useContext(UserType);
  const fetchUser = async () => {
    const token = await AsyncStorage.getItem("authToken");
    const decodedToken = jwt_decode(token);
    const userId = decodedToken.userId;
    setUserId(userId);
  };
  const fetchCartNumber = async () => {
    try {
      const response = await axios.get(
        `http://10.0.2.2:8000/productsInCart/${userId}`
      );

      setCartNumber(response.data.length);
      console.log("cart number",response.data.length);
      console.log("cart", response.data);
    } catch (error) {
      console.log("error", error);
    }
  };
  const fetchNotiNumber = async () => {
    try {
      const response = await axios.get(
        `http://10.0.2.2:8000/notification/range`
      );
      //const { userData } = response.data;
      console.log(response.data)
      setNotiNumber(response.data);
    } catch (error) {
      console.log("error", error);
    }
  };
  useEffect(() => {
    if(userId)
    {
      fetchCartNumber();
    }
  },[userId]);
  useEffect(() => {
    fetchUser();
    fetchNotiNumber();
  }, []);
  const Stack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator();
  function BottomTabs() {
    return (
      <Tab.Navigator>
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarLabel: "Home",
            tabBarLabelStyle: { color: "#008E97", fontSize: 12 },
            headerShown: false,
            tabBarIcon: ({ focused }) =>
              focused ? (
                <Entypo name="home" size={24} color="#008E97" />
              ) : (
                <AntDesign name="home" size={24} color="black" />
              ),
          }}
        />
        <Tab.Screen
          name="Products"
          component={Products}
          options={{
            tabBarLabel: "Products",
            tabBarLabelStyle: { color: "#008E97", fontSize: 12 },
            headerShown: false,
            tabBarIcon: ({ focused }) =>
              focused ? (
                <Ionicons name="shirt-sharp" size={24} color="#008E97" />
              ) : (
                <Ionicons name="shirt-outline" size={24} color="black" />
              ),
              //unmountOnBlur: true
          }}
        />

        <Tab.Screen
          name="Notification"
          component={Notification}
          options={{
            tabBarLabel: "Notification",
            tabBarLabelStyle: { color: "#008E97", fontSize: 12 },
            headerShown: false,
            tabBarBadge : notiNumber,
            tabBarIcon: ({ focused }) =>
              focused ? (
                <Ionicons name="notifications-sharp" size={24} color="#008E97" />
              ) : (
                <Ionicons name="notifications-outline" size={24} color="black" />
              ),
          }}
        />

        <Tab.Screen
          name="Cart"
          component={CartScreen}
          options={{
            tabBarLabel: "Cart",
            tabBarLabelStyle: { color: "#008E97", fontSize: 12 },
            headerShown: false,
            tabBarBadge: cartNumber,
            tabBarIcon: ({ focused }) =>
              focused ? (
                <Ionicons name="cart-sharp" size={24} color="#008E97" />
              ) : (
                <Ionicons name="cart-outline" size={24} color="black" />
              ),
          }}
        />

        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarLabel: "Profile",
            tabBarLabelStyle: { color: "#008E97", fontSize: 12 },
            tabBarIcon: ({ focused }) =>
              focused ? (
                <Ionicons name="person" size={24} color="#008E97" />
              ) : (
                <Ionicons name="person-outline" size={24} color="black" />
              ),
          }}
        />


      </Tab.Navigator>
    );
  }
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Main"
          component={BottomTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Info"
          component={ProductInfoScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Address"
          component={AddAddressScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Add"
          component={AddressScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EditAddress"
          component={EditAddressScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Confirmation"
          component={ConfirmationScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Order"
          component={OrderScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PersonalDetails"
          component={PersonalDetailScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MyOrders"
          component={MyOrders}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MyOrdersDetails"
          component={MyOrdersDetails}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AdminDashboard"
          component={AdminDashboard}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="ViewProductsScreen"
          component={ViewProductsScreen}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="ViewUsersScreen"
          component={ViewUsersScreen}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="ViewOrdersScreen"
          component={ViewOrdersScreen}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="AddProductsScreen"
          component={AddProductsScreen}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="FlatlistTemp"
          component={FlatlistTemp}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="ViewOrderDetailScreen"
          component={ViewOrderDetailScreen}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="UpdateProductsScreen"
          component={UpdateProductsScreen}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="ViewCategoriesScreen"
          component={ViewCategoriesScreen}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="AddCategoriesScreen"
          component={AddCategoriesScreen}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="UpdateCategoriesScreen"
          component={UpdateCategoriesScreen}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="UpdatePassword"
          component={UpdatePassword}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="Wishlist"
          component={MyFavorites}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="Feedback"
          component={FeedbackScreen}
          options={{ headerShown: true }}
        />
      <Stack.Screen
          name="ProductsSearch"
          component={ProductsSearch}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Low Stock"
          component={ViewLowStockScreen}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="Update Feedback"
          component={UpdateFeedBackScreen}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="View Product Feedback"
          component={ViewProductFeedbackScreen}
          options={{ headerShown: true }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigator;

const styles = StyleSheet.create({});