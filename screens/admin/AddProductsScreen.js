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
  Alert,
} from "react-native";
import { FontAwesome5, Ionicons, FontAwesome } from "@expo/vector-icons";
import React, { useEffect, useContext, useState, useCallback } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import axios from "axios";
import { AntDesign } from "@expo/vector-icons";
import DropDownPicker from "react-native-dropdown-picker";

export default function AddProductsScreen() {
  const navigation = useNavigation();
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [offer, setOffer] = useState(0);
  const [sold, setSold] = useState(0);
  const [storage, setStorage] = useState(0);
  const [inputStates, setInputStates] = useState({});
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  //const [status, setStatus] = useState('');

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://10.0.2.2:8000/categories");
      const newItems = response.data.map((category) => ({
        label: category.name,
        value: category.name,
      }));
      setItems(newItems);
      //setCategory(newItems[0].value);
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
  const handleAddProduct = () => {
    const product = {
      title: title,
      price: price,
      category: category,
      image: image,
      description: description,
      offer: offer,
      sold: sold,
      storage: storage,
    };
    // send a POST  request to the backend API to add products
    axios
      .post("http://10.0.2.2:8000/products", product)
      .then((response) => {
        console.log(response);
        Alert.alert("Add product successful", "Your product has been added");
        setTitle("");
        setPrice("");
        setCategory("");
        setImage("");
        setDescription("");
        setOffer(0);
        setSold(0);
        setStorage(0);
      })
      .catch((error) => {
        Alert.alert(
          "Adding Product Error",
          "An error occurred while adding a product"
        );
        console.log("Adding product failed", error);
      });
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.textTitle}>Add Products</Text>
        <Text style={styles.description}>Title</Text>
        <TextInput
          style={[
            styles.textInputDefault,
            inputStates["textInput1"]
              ? styles.textInputOnFocus
              : styles.textInputDefault,
          ]}
          placeholder="Enter title of the product"
          value={title}
          onChangeText={(text) => setTitle(text)}
          onFocus={() => handleFocus("textInput1")}
          onBlur={() => handleBlur("textInput1")}
        />
        <Text style={styles.description}>Price</Text>
        <TextInput
          style={[
            styles.textInputDefault,
            inputStates["textInput2"]
              ? styles.textInputOnFocus
              : styles.textInputDefault,
          ]}
          placeholder="Enter price of the product"
          value={price}
          onChangeText={(text) => setPrice(text)}
          onFocus={() => handleFocus("textInput2")}
          onBlur={() => handleBlur("textInput2")}
        />

        <Text style={styles.description}>Category</Text>
        <DropDownPicker
          style={{ marginBottom: 25, borderColor: "grey", borderRadius: 10 }}
          textStyle={{
            fontSize: 16,
          }}
          containerStyle={{ width: "86%", marginLeft: 30 }}
          open={open}
          value={category} //genderValue
          items={items}
          setOpen={setOpen}
          setValue={setCategory}
          setItems={setItems}
          placeholder="Choose category"
          placeholderStyle={styles.placeholderStyles}
          zIndex={3000}
          zIndexInverse={1000}
        />
        <Text style={styles.description}>Description</Text>

        <TextInput
          style={[
            styles.textInputDefault,
            inputStates["textInput4"]
              ? styles.textInputOnFocus
              : styles.textInputDefault,
          ]}
          placeholder="Enter description of the product"
          value={description}
          onChangeText={(text) => setDescription(text)}
          onFocus={() => handleFocus("textInput4")}
          onBlur={() => handleBlur("textInput4")}
          multiline={true}
          numberOfLines={4}
        />
        <Text style={styles.description}>Image</Text>
        <TextInput
          style={[
            styles.textInputDefault,
            inputStates["textInput5"]
              ? styles.textInputOnFocus
              : styles.textInputDefault,
          ]}
          placeholder="Enter image of the product"
          value={image}
          onChangeText={(text) => setImage(text)}
          onFocus={() => handleFocus("textInput5")}
          onBlur={() => handleBlur("textInput5")}
        />
        <Text style={styles.description}>Offer</Text>
        <TextInput
          style={[
            styles.textInputDefault,
            inputStates["textInput6"]
              ? styles.textInputOnFocus
              : styles.textInputDefault,
          ]}
          placeholder="Enter offer of the product"
          value={offer}
          onChangeText={(text) => setOffer(text)}
          onFocus={() => handleFocus("textInput6")}
          onBlur={() => handleBlur("textInput6")}
        />
        <Text style={styles.description}>Sold</Text>
        <TextInput
          style={[
            styles.textInputDefault,
            inputStates["textInput7"]
              ? styles.textInputOnFocus
              : styles.textInputDefault,
          ]}
          placeholder="Enter sold of the product"
          value={sold}
          onChangeText={(text) => setSold(text)}
          onFocus={() => handleFocus("textInput7")}
          onBlur={() => handleBlur("textInput7")}
        />
        <Text style={styles.description}>Storage</Text>
        <TextInput
          style={[
            styles.textInputDefault,
            inputStates["textInput8"]
              ? styles.textInputOnFocus
              : styles.textInputDefault,
          ]}
          placeholder="Enter storage of the product"
          value={storage}
          onChangeText={(text) => setStorage(text)}
          onFocus={() => handleFocus("textInput8")}
          onBlur={() => handleBlur("textInput8")}
        />

        <Pressable
          style={{
            alignItems: "center",
            justifyContent: "center",
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
          onPress={handleAddProduct}
        >
          <Text
            style={{
              textAlign: "center",
              fontSize: 18,
              fontWeight: "bold",
              color: "white",
            }}
          >
            Add product
          </Text>
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
    paddingBottom: 20,
    textAlign: "center",
  },
  textInputDefault: {
    backgroundColor: "white",
    padding: 10,
    marginHorizontal: 30,
    marginBottom: 25,
    fontSize: 16,
    //height: 50,
    borderWidth: 1,
    borderColor: "grey",
    borderRadius: 10,
  },
  textInputOnFocus: {
    backgroundColor: "white",
    padding: 10,
    marginHorizontal: 30,
    marginBottom: 25,
    fontSize: 16,
    //height: 50,
    borderWidth: 1,
    borderColor: "blue",
  },

  description: {
    fontSize: 20,
    paddingHorizontal: 15,
    marginLeft: 20,
    fontWeight: "bold",
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
