import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Pressable,
    TextInput,
    Alert,
    SafeAreaView
} from "react-native";

import React, { useEffect, useState, } from "react";
import { AntDesign, Feather } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";

export default function UpdateCategoriesScreen(){
    const route = useRoute();
    const [name, setName] = useState(route.params.name);
    const [description, setDescription] = useState(route.params.description);
    const [inputStates, setInputStates] = useState({});
    const [id,setId]=useState(route.params.item._id);
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
      const handleUpdateCategory = () => {
        const category = {
          name: name,
          description: description,
        };
            axios
            .put(`http://10.0.2.2:8000/categories/${id}`, category)
            .then((response) => {
              console.log(response);
              Alert.alert(
                "Update category successful",
                "Your category has been updated"
              );
              setName(name);
              setDescription(description);
            })
            .catch((error) => {
              Alert.alert(
                "Updating Category Error",
                "An error occurred while updating a category"
              );
              console.log("Updating category failed", error.response);
            });
        };
    return(
            <SafeAreaView style={styles.container}>
              <ScrollView>
                <Text style={styles.textTitle}>Update Categories</Text>
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
                  onPress={()=>handleUpdateCategory()}
                >
                  <Text style={{textAlign: 'center', fontSize: 18, fontWeight: 'bold', color: 'white'}}>Update category</Text>
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
        
