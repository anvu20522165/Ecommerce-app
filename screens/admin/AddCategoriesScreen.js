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
    Alert
  } from "react-native";
  import { FontAwesome5, Ionicons, FontAwesome } from "@expo/vector-icons";
  import React, { useEffect, useContext, useState, useCallback } from "react";
  import { useFocusEffect, useNavigation } from "@react-navigation/native";
  import axios from "axios";
  import { AntDesign } from "@expo/vector-icons";

  
export default function AddCategoriesScreen() {
    const navigation = useNavigation();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [inputStates, setInputStates] = useState({});

  const handleFocus = (inputId) => {
    setInputStates((prevInputStates) => ({
      ...prevInputStates,
      [inputId]: true,
    }));
  };

  const handleBlur = (inputId) => {
    setInputStates((prevInputStates) => ({
      ...prevInputStates,
      [inputId]: false,
    }));
  };
    const handleAddCategory = () => {
        const category = {
          name: name,
          description: description,
        };
            // send a POST  request to the backend API to add products
            axios
            .post("http://10.0.2.2:8000/categories", category)
            .then((response) => {
              console.log(response);
              Alert.alert(
                "Add category successful",
                "Your category has been added"
              );
              setName("");
              setDescription("");
            })
            .catch((error) => {
              Alert.alert(
                "Adding Category Error",
                "An error occurred while adding a category"
              );
              console.log("Adding category failed", error);
            });
        };
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <Text style={styles.textTitle}>Add Categories</Text>
            <TextInput style={[styles.textInputDefault,inputStates['textInput1']? styles.textInputOnFocus:styles.textInputDefault]} 
            placeholder="Enter name of the category" 
            value={name} 
            onChangeText={(text)=>setName(text)} 
            onFocus={()=>handleFocus('textInput1')} 
            onBlur={()=>handleBlur('textInput1')}/>
            
            <TextInput style={[styles.textInputDefault,inputStates['textInput2']? styles.textInputOnFocus:styles.textInputDefault]} 
            placeholder="Enter description of the category" 
            value={description} 
            onChangeText={(text)=>setDescription(text)}
            onFocus={()=>handleFocus('textInput2')} 
            onBlur={()=>handleBlur('textInput2')}
            multiline = {true}
            numberOfLines={4}
            />

            <Pressable
            style={{
              alignItems: "center",
              justifyContent: 'center',
              gap: 10,
              backgroundColor: "blue",
              borderRadius: 10,
              height: 60,
              marginHorizontal: 50,
              shadowColor: "#000",
              shadowOffset: { width: 1, height: 1 },
              shadowOpacity: 0.5,
              shadowRadius: 1,
              elevation: 2,
              marginBottom: 20,
            }}
            onPress={handleAddCategory}
          >
            <Text style={{textAlign: 'center', fontSize: 18, fontWeight: 'bold', color: 'white'}}>Add category</Text>
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
      paddingBottom: 30,
      textAlign: 'center',
    },
    textInputDefault:{
      backgroundColor: 'white',
      padding: 10,
      marginHorizontal: 30,
      marginBottom: 25,
      fontSize: 16,
      //height: 50,
      borderWidth: 1,
      borderColor: 'grey',
      borderRadius: 10,
    },
    textInputOnFocus:{
      backgroundColor: 'white',
      padding: 10,
      marginHorizontal: 30,
      marginBottom: 25,
      fontSize: 16,
      //height: 50,
      borderWidth: 1,
      borderColor: 'blue',
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
  