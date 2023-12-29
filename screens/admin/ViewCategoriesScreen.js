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

  export default function ViewCategoriesScreen(){
    const navigation = useNavigation();
    const [categories, setCategories] = useState([]);
    const [categoryList,setCategoryList] = useState([]);
    const [input, setInput] = useState('');
    const fetchCategories = async () => {
        try {
          const response = await axios.get("http://10.0.2.2:8000/categories");
          setCategories(response.data);
          setCategoryList(response.data);
          console.log("all data", response.data);
        } catch (error) {
          console.log("error message", error);
        }
      };
      useEffect(() => {
        fetchCategories();
      }, []);
      useFocusEffect(
        useCallback(() => {
          fetchCategories();
        }, [])
      );
      const handleDelete= async (id)=>{
        try {
          console.log(id)
          const response = await axios.delete(
            `http://10.0.2.2:8000/categories/${id}`, 
          );
          console.log("delete: ", response);
          fetchCategories();
        } catch (error) {
          console.log("error", error);
        }
      }
      const handleFilter=(text)=> {
        if(text){
          let filterList = categories.filter((category)=>category.name.toLowerCase().includes(text.toLowerCase()));
          setCategoryList(filterList);
        }
        else {
          setCategoryList(categories);
        }
    
      }
      return (
        <SafeAreaView style={styles.container}>
          <ScrollView>
            <Text style={styles.textTitle}>Categories</Text>
            <Text style={styles.description}>View all categories</Text>
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
              <TextInput placeholder="Find Categories"
              onChangeText={(text)=>{
                setInput(text);
                handleFilter(text);
              }}
              />
            </Pressable>
            {categoryList.length > 0 ? (
            categoryList.map((item, index) => (
              <View style={styles.productListView} key={index}>
                <View style={{ flexDirection: "row" }}>
                  <View
                    style={{ flexDirection: "column", alignItems: "flex-start", marginLeft: 10 }}
                  >
                    <Text
                      style={{ fontSize: 16, fontWeight: "bold", marginBottom: 5, }}
                    >
                      {item.name.length > 18
                        ? item.name.slice(0, 18) + "..."
                        : item.name}
                    </Text>
                    <Text style={{ fontSize: 14, marginBottom: 3, }}>
                  {item.description}
                </Text>
                  </View>
                </View>
                <View style={{ flexDirection: "column", alignItems: "center" }}>
                  <Pressable
                    onPress={()=>navigation.navigate("UpdateCategoriesScreen",{
                        name: item.name,
                        description: item?.description,
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
            ))):
            (
                <Text style={styles.description}>No categories found.</Text>
              )}
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
    