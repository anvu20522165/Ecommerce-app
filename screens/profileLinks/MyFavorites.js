// Họ tên: Ngô Võ Quang Minh
// MSSV: 21521129
import React, { useEffect, useContext, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  SafeAreaView,
  FlatList,
  Image,
  Dimensions,
  ScrollView,
  Pressable,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5.js";
import { UserType } from "../../UserContext";

export default function MyFavorites() {
  const navigation = useNavigation();
  const { userId } = useContext(UserType);
  const [favorites, setFavorites] = useState([]);
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await axios.get(
          `http://10.0.2.2:8000/favorites/${userId}`
        );
        //const { orderData } = response.data;
        //setOrderData(orderData);
        setFavorites(response.data);
        console.log(response.data);
      } catch (error) {
        console.log("error message", error);
      }
    };
    fetchFavorites();
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={favorites}
        renderItem={({ item }) => (
          <View
            style={{
              flexDirection: "column",
              margin: 3,
              flex: 0.5,
              backgroundColor: "white",
              borderRadius: 5,
              alignItems: "center",
              paddingVertical: 10,
            }}
          >
            <Pressable
              onPress={() =>
                navigation.navigate("Info", {
                  title: item.productid.title,
                  price: item?.productid.price,

                  description: item?.productid.description,
                  category: item?.productid.category,
                  image: item?.productid.image,
                  offer: item?.productid.offer,

                  sold: item?.productid.sold,
                  item: item.productid,
                })
              }
            >
              <Image
                style={styles.imageThumbnail}
                source={{ uri: item.productid.image }}
                resizeMode="contain"
              />

              <View style={{ alignItems: "flex-start", marginTop: 10,  }}>
                <Text style={styles.itemTitle}>
                  {item.productid.title.length > 38
                    ? item.productid.title.slice(0, 38)
                    : item.productid.title}
                </Text>
<View style={{width:"100%"}}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    //backgroundColor: "blue",
                    paddingHorizontal:5
                  }}
                >
                  <Text style={[styles.itemPrice, { color: "black" }]}>
                    {item?.productid.price.toLocaleString("vi", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </Text>
                  <Text style={styles.itemPrice}>
                    {item?.productid.sold} sold
                  </Text>
                </View>
</View>
              </View>
            </Pressable>
          </View>
        )}
        //Setting the number of column
        numColumns={2}
        keyExtractor={(item, index) => index}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  flatlist: {
    marginVertical: 15,
    alignItems: "center",
    //justifyContent: 'center',
    marginRight: 20,
  },
  categories: {
    fontSize: 18,
    //marginRight: 20,
  },
  categoryImage: {
    width: 35,
    height: 35,
  },
  exception: {
    flexDirection: "row",
  },
  imageThumbnail: {
    //justifyContent: "center",
    // alignItems: "center",
    height: 200,
    width: 200,
    // flex:1,
    //aspectRatio: 1,
  },
  itemTitle: {
    fontSize: 18,
    height: 70,
    paddingHorizontal: 5
  },
  itemPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#AF3A5D",
  },
  itemStat: {
    fontSize: 18,
  },
  selectedCategory: {
    borderBottomColor: "blue",
    borderBottomWidth: 2,
  },
  selectedText: {
    color: "blue",
  },
});
