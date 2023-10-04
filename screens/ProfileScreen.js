import { View, Text } from 'react-native'

import { Pressable } from 'react-native'
import React, { useState, useEffect, useContext } from "react";
import { SafeAreaView } from 'react-native-safe-area-context'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { UserType } from '../UserContext';
const ProfileScreen = () => {
    //const [appUserConfig, setAppUserConfig] = useContext(UserType);
    const navigation = useNavigation();
    const logOut = async () => { 
        //setAppUserConfig({ accessToken: null, accessTokenName: null });
        navigation.replace("Login");
    }

  return (
    <SafeAreaView>
      <Pressable 
      onPress={() => logOut()}
      >
      <Text>log out</Text>  
      </Pressable>
    </SafeAreaView>
  )
}

export default ProfileScreen