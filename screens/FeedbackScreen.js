import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  TextInput,
  Image,
  Alert,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useContext, useState, useCallback } from "react";
import { Feather } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import DropDownPicker from "react-native-dropdown-picker";
import { UserType } from '../UserContext'
import axios from "axios";
import { useNavigation, useRoute } from "@react-navigation/native";
import moment from "moment";


const FeedBackScreen = () => {
  const route = useRoute();
  const { userId, setUserId } = useContext(UserType);
  const [orderId, setOrderId] = useState(route.params._id);
  const [defaultRating, setDefaultRating] = useState(2);
  const [maxRating, setMaxRating] = useState([1, 2, 3, 4, 5]);
  const [comment, setComment] = useState("");
  const starImgFilled = 'https://github.com/tranhonghan/images/blob/main/star_filled.png?raw=true'
  const starImgCorner = 'https://github.com/tranhonghan/images/blob/main/star_corner.png?raw=true'
  const navigation = useNavigation()
  const handleAddAddress = () => {
    // const feedback = {
    //   orderId,
    //   userId,
    //   comment,
    //   rate: defaultRating,
    // }
    const rate = defaultRating
    axios.post("http://10.0.2.2:8000/feedback",{orderId, userId, comment, rate}).then((response) => {
        Alert.alert("Success","Feedback added successfully");
        console.log(response.data)
        // setTimeout(() => {
        //   navigation.goBack();
        // },1000)
    }).catch((error) => {
        console.log("error",error)
    })
}

  const CustomRatingBar = () => {
    return (
      <View style={{ justifyContent: "center", flexDirection: "row", marginTop: 20 }}>
        {
          maxRating.map((item, key) => {
            return (
              <TouchableOpacity
                activeOpacity={0.7}
                key={item}
                onPress={() => setDefaultRating(item)}
              >
                <Image
                  style={{ width: 40, height: 40, resizeMode: "cover" }}
                  source={
                    item <= defaultRating
                      ? { uri: starImgFilled }
                      :
                      { uri: starImgCorner }
                  }
                />
              </TouchableOpacity>
            )
          })
        }
      </View>
    )
  }
  return (
    <ScrollView style={{ flex: 1, backgroundColor: "white" }}>
      <View style={{ marginTop: 5, marginBottom: 20, flex: 1, backgroundColor: "white", marginHorizontal: 20 }}>
        <Text style={{ fontSize: 15, fontWeight: "bold", marginVertical: 5 }}>
          Order #{orderId}
        </Text>
      </View>
      <Text style={{ fontSize: 15, fontWeight: "bold", marginVertical: 5, textAlign: "center" }}>
        How would you rate this order
      </Text>
      <CustomRatingBar />
      <Text style={{ fontSize: 15, fontWeight: "bold", marginVertical: 5, textAlign: "center" }}>
        {defaultRating + ' / ' + maxRating.length}
      </Text>
      <TextInput
                        value={comment}
                        onChangeText={(text) => setComment(text)}
                        placeholderTextColor={"black"}
                        style={{
                            padding: 10,
                            borderColor: "#D0D0D0",
                            borderWidth: 1,
                            marginVertical: 20,
                            borderRadius: 5,
                            marginHorizontal: 30
                        }}
                        placeholder="Enter your comment"
                    />
      <Pressable
        onPress={() => handleAddAddress()}
        style={{
          backgroundColor: "#FFC72C",
          borderRadius: 6,
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 10,
          width: 140,
          height: 30,
          borderRadius: 10,
          borderWidth: 1,
          borderColor: "#D0D0D0",
          right: -150
        }}
      >
        <Text style={{ fontWeight: "bold" }}>Send</Text>
      </Pressable>
    </ScrollView>
  )
}

export default FeedBackScreen

const styles = StyleSheet.create({})