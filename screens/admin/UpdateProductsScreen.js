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

export default function UpdateProductsScreen(){
    const route = useRoute();
    const [title, setTitle] = useState(route.params.title);
    const [price, setPrice] = useState(route.params.price.toString());
    const [category, setCategory] = useState(route.params.category);
    const [image, setImage] = useState(route.params.image);
    const [description, setDescription] = useState(route.params.description);
    const [offer, setOffer] = useState(route.params.offer.toString());
    const [sold, setSold] = useState(route.params.sold.toString());
    const [storage, setStorage] = useState(route.params.storage.toString());
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
      const handleUpdateProduct = () => {
        const product = {
          title: title,
          price: parseInt(price),
          category: category,
          image: image,
          description: description,
          offer: parseInt(offer),
          sold: parseInt(sold),
          storage: parseInt(storage),
        };
            axios
            .put(`http://10.0.2.2:8000/products/${id}`, product)
            .then((response) => {
              console.log(response);
              Alert.alert(
                "Update product successful",
                "Your product has been updated"
              );
              setTitle(title);
              setPrice(price);
              setCategory(category);
              setImage(image);
              setDescription(description);
              setOffer(offer);
              setSold(sold);
              setStorage(storage);
            })
            .catch((error) => {
              Alert.alert(
                "Updating Product Error",
                "An error occurred while updating a product"
              );
              console.log("Updating product failed", error.response);
            });
        };
    return(
            <SafeAreaView style={styles.container}>
              <ScrollView>
                <Text style={styles.textTitle}>Update Products</Text>
                  <TextInput style={[styles.textInputDefault,inputStates['textInput1']? styles.textInputOnFocus:styles.textInputDefault]} 
                  placeholder="Enter title of the product" 
                  value={title} 
                  onChangeText={(text)=>setTitle(text)} 
                  onFocus={()=>handleFocus('textInput1')} 
                  onBlur={()=>handleBlur('textInput1')}/>
      
                  <TextInput style={[styles.textInputDefault,inputStates['textInput2']? styles.textInputOnFocus:styles.textInputDefault]} 
                  placeholder="Enter price of the product" 
                  value={price} 
                  onChangeText={(text)=>setPrice(text)}
                  onFocus={()=>handleFocus('textInput2')} 
                  onBlur={()=>handleBlur('textInput2')}/>
      
                  <TextInput style={[styles.textInputDefault,inputStates['textInput3']? styles.textInputOnFocus:styles.textInputDefault]} 
                  placeholder="Enter category of the product" 
                  value={category} 
                  onChangeText={(text)=>setCategory(text)} 
                  onFocus={()=>handleFocus('textInput3')} 
                  onBlur={()=>handleBlur('textInput3')}/>
      
                  <TextInput style={[styles.textInputDefault,inputStates['textInput4']? styles.textInputOnFocus:styles.textInputDefault]} 
                  placeholder="Enter description of the product" 
                  value={description} 
                  onChangeText={(text)=>setDescription(text)}
                  onFocus={()=>handleFocus('textInput4')} 
                  onBlur={()=>handleBlur('textInput4')}
                  multiline = {true}
                  numberOfLines={4}
                  />
      
                  <TextInput style={[styles.textInputDefault,inputStates['textInput5']? styles.textInputOnFocus:styles.textInputDefault]} 
                  placeholder="Enter image of the product" 
                  value={image} 
                  onChangeText={(text)=>setImage(text)} 
                  onFocus={()=>handleFocus('textInput5')} 
                  onBlur={()=>handleBlur('textInput5')}/>
      
                  <TextInput style={[styles.textInputDefault,inputStates['textInput6']? styles.textInputOnFocus:styles.textInputDefault]} 
                  placeholder="Enter offer of the product" 
                  value={offer} 
                  onChangeText={(text)=>setOffer(text)} 
                  onFocus={()=>handleFocus('textInput6')} 
                  onBlur={()=>handleBlur('textInput6')}/>
      
                  <TextInput style={[styles.textInputDefault,inputStates['textInput7']? styles.textInputOnFocus:styles.textInputDefault]} 
                  placeholder="Enter sold of the product" 
                  value={sold} 
                  onChangeText={(text)=>setSold(text)}
                  onFocus={()=>handleFocus('textInput7')} 
                  onBlur={()=>handleBlur('textInput7')} />
      
                  <TextInput style={[styles.textInputDefault,inputStates['textInput8']? styles.textInputOnFocus:styles.textInputDefault]} 
                  placeholder="Enter storage of the product" 
                  value={storage} 
                  onChangeText={(text)=>setStorage(text)} 
                  onFocus={()=>handleFocus('textInput8')} 
                  onBlur={()=>handleBlur('textInput8')}/>
      
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
                  onPress={()=>handleUpdateProduct()}
                >
                  <Text style={{textAlign: 'center', fontSize: 18, fontWeight: 'bold', color: 'white'}}>Update product</Text>
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
        
