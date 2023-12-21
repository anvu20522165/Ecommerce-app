import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { Provider } from "react-redux";
import StackNavigator from './navigation/StackNavigator';
import { ModalPortal } from "react-native-modals";
import store from "./store";
import { UserContext } from './UserContext';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
export default function App() {

        SplashScreen.preventAutoHideAsync();
        setTimeout(SplashScreen.hideAsync, 5000);

  return (
    <>
      <Provider store={store}>
        <UserContext>
        <StackNavigator/>
        <ModalPortal/>
        </UserContext>
      </Provider>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',

  },
});
