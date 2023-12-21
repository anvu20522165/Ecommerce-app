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
  StatusBar,
  TextInput
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AntDesign, Feather } from "@expo/vector-icons";
import axios from "axios";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5.js';



export default function Products(){
    const navigation = useNavigation();
    const images = [
        "https://m.media-amazon.com/images/I/41EcYoIZhIL._AC_SY400_.jpg",
        "https://m.media-amazon.com/images/G/31/img20/Events/Jup21dealsgrid/blockbuster.jpg",
        "https://images-eu.ssl-images-amazon.com/images/I/31dXEvtxidL._AC_SX368_.jpg",
        "https://m.media-amazon.com/images/G/31/img20/Events/Jup21dealsgrid/All_Icons_Template_1_icons_01.jpg",
      ];
    const [categories,setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [products,setProducts] = useState([]);
    const fetchCategories = async () => {
        try {
          const response = await axios.get("http://10.0.2.2:8000/categories");
          setCategories(response.data);
          console.log("categories: ", response.data);
        } catch (error) {
          console.log("error message", error);
        }
      };
    const fetchCategory = async () => {
        try{
            const response = await axios.get(`http://10.0.2.2:8000/products/category/${selectedCategory}`)
            setProducts(response.data);
            console.log("category products: ", response.data);
        } 
        catch (error){
            console.log("error message", error);
        }
    }
    const fetchProducts = async () => {
        try{
            const response = await axios.get(`http://10.0.2.2:8000/products`)
            setProducts(response.data);
            console.log("products: ", response.data);
        } 
        catch (error){
            console.log("error message", error);
        }
    }
    useEffect(() => {
        fetchProducts();
        fetchCategories();
      }, []);

      const handleCategorySelect = (category) => {
        if(category==='')
        {
          setSelectedCategory(category);
        }
        else{
          setSelectedCategory(category);
        }
      };
      useEffect(() => {
        if (selectedCategory === '') {
          fetchProducts();
        } else {
          fetchCategory();
        }
      }, [selectedCategory]);
    return (
        <SafeAreaView style={styles.container}>
          <StatusBar barStyle="light-content"/>
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
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <ScrollView horizontal={true} style={styles.exception} showsHorizontalScrollIndicator={false}>
            <Pressable
            onPress={()=>handleCategorySelect('')}>
            <View style={[styles.flatlist, {marginLeft: 20}, selectedCategory === "" && styles.selectedCategory]}>
                <Image
                source={{uri: images[0]}}
                style={styles.categoryImage}
                />
                <Text style={[styles.categories, selectedCategory === "" && styles.selectedText]}>All</Text>
            </View>
            </Pressable>
            <FlatList
          data={categories}
          renderItem={({ item, index }) => (
            <Pressable
            onPress={()=>handleCategorySelect(item.name)}
            >
            <View style={[styles.flatlist,selectedCategory === item.name && styles.selectedCategory,]}>
                <Image
                source={{uri: images[index+1]}}
                style={styles.categoryImage}
                resizeMode="contain"
                />
                <Text style={[styles.categories,selectedCategory === item.name && styles.selectedText,]}>{item.name}</Text>
            </View>
            </Pressable>
          )}
          keyExtractor={(item, index) => index.toString()}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        />
        </ScrollView>
        </ScrollView>
        <FlatList
          data={products}
          renderItem={({ item }) => (
            <View
            style={{
              flexDirection: "column",
              margin: 3,
              paddingVertical: 10,
              flex: 0.5,
              backgroundColor: "white",
              borderRadius: 5,
              alignItems: 'center',
              //marginBottom: 20,
            }}
            >
              <Pressable
               onPress={() =>
                navigation.navigate("Info", {

                  title: item.title,
                  price: item?.price,

                  description: item?.description,
                  category: item?.category,
                  image: item?.image,
                  offer: item?.offer,

                  sold: item?.sold,
                  item: item,

                })
              }
              
              >
              <Image
                style={styles.imageThumbnail}
                source={{ uri: item.image }}
                resizeMode="contain"
              />
               
              <View style={{alignItems: "flex-start", marginTop: 10, }}>
             <Text style={styles.itemTitle}>{item.title.length > 38
                    ? item.title.slice(0, 38)
                    : item.title}</Text>
               <View style={{width:"100%"}}>  
              <View
                style={{
                    flexDirection:"row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingHorizontal: 5,
                }}
              >

                    <Text style={[styles.itemPrice,{color:"black"}]}>{item?.price.toLocaleString('vi', { style: 'currency', currency: 'VND' })}</Text>
                    <Text style={styles.itemPrice}>{item?.sold} sold</Text>
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
    container:{
        flex:1,
        //alignItems: 'center',
        //backgroundColor: "grey"
    },
    title:{
        fontSize: 20,
        fontWeight: 'bold',
    },
    flatlist:{
        marginVertical: 15,
        alignItems: 'center',
    //justifyContent: 'center',
        marginRight: 20,
    
    
    },
    categories:{
        fontSize: 18,
        //marginRight: 20,
    },
    categoryImage:{
        width: 50,
        height: 50,
    }, 
    exception:{
        flexDirection: 'row',
        backgroundColor: "white",
        height: 130,
    },
    imageThumbnail: {
        //justifyContent: "center",
        // alignItems: "center",
        height: 200,
        width:200,
        //width: '100%',
        // borderColor: "black",
        // borderWidth: 1
        // flex:1,
        //aspectRatio: 1,
      },
      itemTitle: {
        fontSize: 18,
        height: 70,
        paddingHorizontal:5,
      },
      itemPrice: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#AF3A5D',
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