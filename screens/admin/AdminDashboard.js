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
import { Entypo } from "@expo/vector-icons";
import { FontAwesome5, Ionicons, FontAwesome } from "@expo/vector-icons";

import React, { useEffect, useContext, useState, useCallback } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { UserType } from "../../UserContext";
import axios from "axios";
const AdminDashboard = () => {
  const navigation = useNavigation();
  const [usersCount, setUsersCount] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);
  const [productsCount, setProductsCount] = useState(0);
  const [categoriesCount, setCategoriesCount] = useState(0);
  const [lowStock, setLowStock] =useState(0);
  const fetchCounts = async () => {
    try {
      // Lấy số lượng Users
      const usersResponse = await axios.get("http://10.0.2.2:8000/users");
      const usersCount = usersResponse.data.length;
      setUsersCount(usersCount);

      // Lấy số lượng Orders
      const ordersResponse = await axios.get("http://10.0.2.2:8000/orders");
      const ordersCount = ordersResponse.data.length;
      setOrdersCount(ordersCount);

      // Lấy số lượng Products
      const productsResponse = await axios.get(
        "http://10.0.2.2:8000/products"
      );
      const lowStockCount = productsResponse.data.filter((product) => product.storage <= 5).length;
      const productsCount = productsResponse.data.length;
      setProductsCount(productsCount);
      setLowStock(lowStockCount);

      // Lấy số lượng Categories
      const categoriesResponse = await axios.get(
        "http://10.0.2.2:8000/categories"
      );
      const categoriesCount = categoriesResponse.data.length;
      setCategoriesCount(categoriesCount);
    } catch (error) {
      console.error("Error:", error);
    }
  };


  useEffect(() => {
    fetchCounts();
  }, []);
  useFocusEffect(
    useCallback(() => {
      fetchCounts();
    }, [])
  );
  return (
    <SafeAreaView>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <View style={styles.statisticsSection}>
            <Text style={styles.contentTitle}>Welcome Admin</Text>
            <View style={styles.statisticsContainer}>
            
              <View
                style={[
                  styles.statisticsContent,
                  { backgroundColor: "orange" },
                ]}
              >
                <Pressable
                      onPress={() => navigation.navigate("ViewUsersScreen")}
                    >
                <FontAwesome5
                  name="user"
                  size={17}
                  color="#fff"
                  style={styles.statisticsIcon}
                />
                <View style={styles.statisticsCounter}>
                  <Text style={styles.statisticsValue}>{usersCount}</Text>
                  <Text style={styles.statisticsTitle}>Users</Text>
                </View>
                </Pressable>
              </View>
              
              <View
                style={[styles.statisticsContent, { backgroundColor: "blue" }]}
              >
                <Pressable
                      onPress={() => navigation.navigate("ViewOrdersScreen")}
                    >
                <FontAwesome5
                  name="shopping-cart"
                  size={17}
                  color="#fff"
                  style={styles.statisticsIcon}
                />
                <View style={styles.statisticsCounter}>
                  <Text style={styles.statisticsValue}>{ordersCount}</Text>
                  <Text style={styles.statisticsTitle}>Orders</Text>
                </View>
                </Pressable>
              </View>
              <View
                style={[
                  styles.statisticsContent,
                  { backgroundColor: "green" },
                ]}
              >
                <Pressable
                      onPress={() => navigation.navigate("ViewProductsScreen")}
                    >
                <FontAwesome5
                  name="boxes"
                  size={19}
                  color="#fff"
                  style={styles.statisticsIcon}
                />
                <View style={styles.statisticsCounter}>
                  <Text style={styles.statisticsValue}>{productsCount}</Text>
                  <Text style={styles.statisticsTitle}>Products</Text>
                </View>
                </Pressable>
              </View>
              <View
                style={[styles.statisticsContent, { backgroundColor: "grey" }]}
              >
                <Pressable
                      onPress={() => navigation.navigate("ViewCategoriesScreen")}
                    >
                                      <FontAwesome
                  name="list"
                  size={19}
                  color="#fff"
                  style={styles.statisticsIcon}
                />
                <View style={styles.statisticsCounter}>
                  <Text style={styles.statisticsValue}>{categoriesCount}</Text>
                  <Text style={styles.statisticsTitle}>Categories</Text>
                </View>
                </Pressable>
              </View>
              <View
                style={[/*styles.statisticsContent,*/ { backgroundColor: "brown", width: '100%',
                borderRadius: 10,
                height: 110,
                padding: 15,
                marginBottom: 15, }]}
              >
                <Pressable
                      onPress={() => navigation.navigate("Low Stock")}
                    >
                <FontAwesome
                  name="exclamation"
                  size={19}
                  color="#fff"
                  style={styles.statisticsIcon}
                />
                <View style={styles.statisticsCounter}>
                  <Text style={styles.statisticsValue}>{lowStock}</Text>
                  <Text style={styles.statisticsTitle}>Low in Stock</Text>
                </View>
                </Pressable>
              </View>
            </View>
          </View>
          <View style={styles.tasksSection}>
            <Text style={styles.contentTitle}>Actions</Text>
            <View style={styles.tasksBody}>
              <View style={styles.tasksList}>
                <View style={styles.chooseTask}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <FontAwesome5
                      name="user"
                      size={16}
                      color="blue"
                      style={[
                        styles.statisticsIcon,
                        { marginRight: 15, marginLeft: 4 },
                      ]}
                    />
                    <Text
                      style={{
                        fontWeight: "bold",
                        fontSize: 18,
                        color: "blue",
                      }}
                    >
                      Users
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Pressable
                      onPress={() => navigation.navigate("ViewUsersScreen")}
                    >
                      <FontAwesome5
                        name="eye"
                        size={16}
                        color="blue"
                        style={[styles.statisticsIcon]}
                      />
                    </Pressable>
                  </View>
                </View>
                <View style={styles.chooseTask}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <FontAwesome5
                      name="shopping-cart"
                      size={16}
                      color="blue"
                      style={[styles.statisticsIcon, { marginRight: 15 }]}
                    />
                    <Text
                      style={{
                        fontWeight: "bold",
                        fontSize: 18,
                        color: "blue",
                      }}
                    >
                      Orders
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Pressable
                      onPress={() => navigation.navigate("ViewOrdersScreen")}
                    >
                      <FontAwesome5 name="eye" size={16} color="blue" />
                    </Pressable>
                  </View>
                </View>
                <View style={styles.chooseTask}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <FontAwesome5
                      name="boxes"
                      size={16}
                      color="blue"
                      style={[styles.statisticsIcon, { marginRight: 15 }]}
                    />
                    <Text
                      style={{
                        fontWeight: "bold",
                        fontSize: 18,
                        color: "blue",
                      }}
                    >
                      Products
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Pressable
                      onPress={() => navigation.navigate("AddProductsScreen")}
                    >
                      <FontAwesome5
                        name="plus"
                        size={16}
                        color="blue"
                        style={[styles.statisticsIcon, { marginRight: 15 }]}
                      />
                    </Pressable>
                    <Pressable
                      onPress={() => navigation.navigate("ViewProductsScreen")}
                    >
                      <FontAwesome5 name="eye" size={16} color="blue" />
                    </Pressable>
                  </View>
                </View>
                <View style={styles.chooseTask}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <FontAwesome5
                      name="list"
                      size={16}
                      color="blue"
                      style={[styles.statisticsIcon, { marginRight: 15 }]}
                    />
                    <Text
                      style={{
                        fontWeight: "bold",
                        fontSize: 18,
                        color: "blue",
                      }}
                    >
                      Categories
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Pressable
                      onPress={()=>navigation.navigate("AddCategoriesScreen")}
                    >
                    <FontAwesome5
                      name="plus"
                      size={16}
                      color="blue"
                      style={[styles.statisticsIcon, { marginRight: 15 }]}
                    />
                    </Pressable>
                    <Pressable
                      onPress={()=>navigation.navigate("ViewCategoriesScreen")}
                    >
                    <FontAwesome5 name="eye" size={16} color="blue" />
                    </Pressable>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AdminDashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafa",
  },
  statisticsSection: {
    paddingTop: 20,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    //   borderBottomStartRadius: 15,
    //   borderBottomEndRadius: 15,
    paddingBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 1,
    elevation: 1,
  },
  contentTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 30,
  },
  statisticsContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statisticsContent: {
    width: "45%",
    borderRadius: 10,
    height: 100,
    padding: 15,
    marginBottom: 15,
  },
  statisticsIcon: {
    marginLeft: "auto",
  },
  statisticsCounter: {
    alignSelf: "center",
    display: "flex",
    alignItems: "center",
  },
  statisticsValue: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  statisticsTitle: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
  },
  tasksSection: {
    paddingHorizontal: 16,
    paddingTop: 30,
  },
  tasksLeftText: {
    marginRight: 7,
    fontWeight: "bold",
    fontSize: 15,
  },
  tasksBody: {
    height: 220,
  },
  tasksList: {
    marginBottom: 50,
  },
  chooseTask: {
    marginTop: 5,
    paddingTop: 10,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    borderRadius: 5,
    paddingBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 1,
    elevation: 1,
    flexDirection: "row",
    //alignSelf: 'flex-start',
    // display: 'flex',
    justifyContent: "space-between",
  },
});
