import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Pressable,
    TextInput,
    FlatList,
} from "react-native";
import { LogBox } from 'react-native';
import React, { useEffect, useContext, useState, useCallback } from "react";
import { Feather } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import DropDownPicker from "react-native-dropdown-picker";
import { UserType } from '../../UserContext';
import axios from "axios";
import { useNavigation, useRoute } from "@react-navigation/native";

const FlatlistTemp = () => {
    const { userId, setUserId } = useContext(UserType);
    const navigation = useNavigation();

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

    const DataView = ( {item} ) => {
        <View>
            
            <Text style={{ fontWeight: "bold", fontSize: 20 }}>ok</Text>

        </View>
    }

    return (
        <View>
            <View>
                <Text>test</Text>
            <FlatList
                data={items}
                renderItem={({item}) => {
                    return (<Text style={{ fontWeight: "bold", fontSize: 20 }}>{item.label}</Text>)
                }}
                keyExtractor={(item, index) => index.toString()}
            //ItemSeparatorComponent={}
            />
            </View>
        </View>
    )
}

export default FlatlistTemp

const styles = StyleSheet.create({})