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
import UpdateProductsScreen from "./UpdateProductsScreen";

export default function ViewProductsScreen() {
  const navigation = useNavigation();
  const [products, setProducts] = useState([]);
  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://10.0.2.2:8000/products");
      setProducts(response.data);
      console.log("all data", response.data);
    } catch (error) {
      console.log("error message", error);
    }
  };
  useEffect(() => {
    fetchProducts();
  }, []);
  const handleDelete= async (id)=>{
    try {
      console.log(id)
      const response = await axios.delete(
        `http://10.0.2.2:8000/products/${id}`, 
      );
      console.log("delete: ", response);
      fetchProducts();
    } catch (error) {
      console.log("error", error);
    }
  }
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.textTitle}>Products</Text>
        <Text style={styles.description}>View all products</Text>
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
          <TextInput placeholder="Find Product" />
        </Pressable>
        {products.map((item, index) => (
          <View style={styles.productListView} key={index}>
            <View style={{ flexDirection: "row" }}>
              <Image
                style={{
                  width: 120,
                  height: 120,
                  resizeMode: "contain",
                  marginRight: 15,
                }}
                source={{ uri: item?.image }}
              />
              <View
                style={{ flexDirection: "column", alignItems: "flex-start" }}
              >
                <Text
                  style={{ fontSize: 16, fontWeight: "bold", marginBottom: 5 }}
                >
                  {item.title.length > 18
                    ? item.title.slice(0, 18) + "..."
                    : item.title}
                </Text>
                <Text style={{ fontSize: 14, marginBottom: 3 }}>
                  {item.category}
                </Text>
                <Text style={{ fontSize: 14 }}>{item.price}</Text>
              </View>
            </View>
            <View style={{ flexDirection: "column", alignItems: "center" }}>
              <Pressable
                onPress={()=>navigation.navigate("UpdateProductsScreen",{
                    title: item.title,
                    price: item?.price,
                    description: item?.description,
                    category: item?.category,
                    image: item?.image,
                    offer: item?.offer,
                    sold: item?.sold,
                    storage: item?.storage,
                    item: item,
                })}
              >
              <FontAwesome5
                name="pen"
                size={16}
                color="white"
                style={{
                  marginBottom: 15,
                  backgroundColor: "blue",
                  padding: 8,
                  borderRadius: 5,
                }}
              />
              </Pressable>
              <Pressable
                onPress={()=>handleDelete(item._id)}
              >
              <FontAwesome5
                name="trash-alt"
                size={16}
                color="white"
                style={{ backgroundColor: "blue", padding: 8, borderRadius: 5 }}
              />
              </Pressable>
            </View>
          </View>
        ))}
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
