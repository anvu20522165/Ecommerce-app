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
  } from "react-native";
  import { FontAwesome5, Ionicons, FontAwesome } from "@expo/vector-icons";
  import React, { useEffect, useContext, useState, useCallback } from "react";
  import { useFocusEffect, useNavigation } from "@react-navigation/native";
  import axios from "axios";
  import { AntDesign } from "@expo/vector-icons";

  
export default function AddProductsScreen() {
    const navigation = useNavigation();
    const [title, setTitle] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("");
    const [image, setImage] = useState("");
    const [offer, setOffer] = useState(0);
    const [sold, setSold] = useState(0);
    const [storage, setStorage] = useState(0);
    const handleAddProduct = () => {
        const product = {
          title: title,
          price: price,
          category: category,
          image: image,
          offer: offer,
          sold: sold,
          storage: storage,
        };
            // send a POST  request to the backend API to add products
            axios
            .post("http://10.0.2.2:8000/products", product)
            .then((response) => {
              console.log(response);
              Alert.alert(
                "Add product successful",
                "Your product has been added"
              );
              setTitle("");
              setPrice("");
              setCategory("");
              setImage("");
              setOffer(0);
              setSold(0);
              setStorage(0);
            })
            .catch((error) => {
              Alert.alert(
                "Adding Product Error",
                "An error occurred while adding a product"
              );
              console.log("registration failed", error);
            });
        };
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <Text style={styles.textTitle}>Add Products</Text>
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
            <TextInput style={{padding:10}} placeholder="Add Product" value={title} onChangeText={setTitle} />
          </Pressable>
        </ScrollView>
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
      textAlign: 'center',
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
  