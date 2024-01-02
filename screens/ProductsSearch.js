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
  TextInput,
} from "react-native";
import { useNavigation, useFocusEffect, useRoute } from "@react-navigation/native";
import { AntDesign, Feather } from "@expo/vector-icons";
import axios from "axios";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5.js";

export default function ProductsSearch() {
  const navigation = useNavigation();
  const route = useRoute();
  const [input,setInput] = useState('');
  const [products, setProducts] = useState([]);
  const [sortCriteria, setSortCriteria] = useState("recommended");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [priceSortValue, setPriceSortValue] = useState(true);
  const [priceSortName, setPriceSortName] = useState("Price: Low to High");
  const [originalFiltered, setOriginalFiltered] = useState([]);
  const [ranks, setRanks] = useState([]);
  const fetchRanks = async () => {
    try {
      const response = await axios.get("http://10.0.2.2:8000/rank");
      setRanks(response.data);
    } catch (error) {
      console.log("error message", error);
    }
  };
  const fetchProducts = async () => {
    try {
      const response = await axios.get(`http://10.0.2.2:8000/products`);
      setProducts(response.data);
      setFilteredProducts(response.data);
      setOriginalFiltered(response.data);
      console.log("products: ", response.data);
    } catch (error) {
      console.log("error message", error);
    }
  };
  useEffect(() => {
    fetchProducts();
    fetchRanks();
  }, []);

 
  const handleSortCriteriaChange = (criteria) => {
    setSortCriteria(criteria);
    if (criteria === "recommended") {
      setFilteredProducts(originalFiltered);
    } else if (criteria === "rate") {
      const sortedProducts = [...filteredProducts].sort((a, b) => {
        // Tìm rank tương ứng cho sản phẩm a và b
        const rankA = ranks.find(
          (rank) => rank.productid.toString() === a._id.toString()
        );
        const rankB = ranks.find(
          (rank) => rank.productid.toString() === b._id.toString()
        );

        // So sánh rank và sắp xếp theo thứ tự giảm dần
        return rankB.rate - rankA.rate;
      });

      setFilteredProducts(sortedProducts);
    } else if (criteria === "sold") {
      // High to low
      const sortedProducts = [...filteredProducts].sort((a, b) => b.sold - a.sold);
      setFilteredProducts(sortedProducts);
    } else {
      handlePriceSort();
    }
  };
  const handlePriceSort = () => {
    if (priceSortValue) {
      // low to high
      const sortedProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
      setFilteredProducts(sortedProducts);
      setPriceSortValue(!priceSortValue);
      setPriceSortName('Price: Low to High');
    } else {
      // High to low
      const sortedProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
      setFilteredProducts(sortedProducts);
      setPriceSortValue(!priceSortValue);
      setPriceSortName('Price: High to Low');
    }
  };
  useFocusEffect(
    useCallback(() => {
      setPriceSortName("Price: Low to High");
      setSortCriteria("recommended");
    }, [])
  );
  const handleSearch=(text)=> {
    if(text){
      let filterList = originalFiltered.filter((product)=>product.title.toLowerCase().includes(text.toLowerCase()));
      console.log("filter", filteredProducts);
      setFilteredProducts(filterList);
    }
    else {
      setFilteredProducts(products);
    }

  }
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
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
          <TextInput placeholder="Search in Shein" autoFocus={true} 
          value={input}
          onChangeText={(text)=>{
            handleSearch(text);
            setInput(text);
            }} />
        </Pressable>

        {/* <Feather name="mic" size={24} color="black" /> */}
      </View>
      <ScrollView
        style={{ height: 70 }}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
      >
        {/* <View style = {{flexDirection: "row", justifyContent: "space-between"}}> */}
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          {/* <Text style={styles.filter}>Recommended</Text>
        <Text style={styles.filter}>Top Rated</Text>
          <Text style={styles.filter}>Top Sold</Text>
          <Text style={styles.filter}>Price: High to Low</Text> */}
          <Pressable
            onPress={() => handleSortCriteriaChange("recommended")}
            style={styles.filter}
          >
            <Text
              style={[
                styles.filterText,
                sortCriteria === "recommended" && styles.selectedFilter,
              ]}
            >
              Recommended
            </Text>
          </Pressable>
          <Pressable
            onPress={() => handleSortCriteriaChange("rate")}
            style={styles.filter}
          >
            <Text
              style={[
                styles.filterText,
                sortCriteria === "rate" && styles.selectedFilter,
              ]}
            >
              Top Rated
            </Text>
          </Pressable>
          <Pressable
            onPress={() => handleSortCriteriaChange("sold")}
            style={styles.filter}
          >
            <Text
              style={[
                styles.filterText,
                sortCriteria === "sold" && styles.selectedFilter,
              ]}
            >
              Top Sold
            </Text>
          </Pressable>
          <Pressable
            onPress={() => handleSortCriteriaChange("price")}
            style={styles.filter}
          >
            <Text
              style={[
                styles.filterText,
                sortCriteria === "price" && styles.selectedFilter,
              ]}
            >
              {priceSortName}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
      <FlatList
        data={/*products*/ filteredProducts}
        renderItem={({ item }) => (
          <View
            style={{
              flexDirection: "column",
              margin: 3,
              paddingVertical: 10,
              flex: 0.5,
              backgroundColor: "white",
              borderRadius: 5,
              alignItems: "center",
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

              <View style={{ alignItems: "flex-start", marginTop: 10 }}>
                <Text style={styles.itemTitle}>
                  {item.title.length > 38
                    ? item.title.slice(0, 38)
                    : item.title}
                </Text>
                <View style={{ width: "100%" }}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      paddingHorizontal: 5,
                    }}
                  >
                    <Text style={[styles.itemPrice, { color: "black" }]}>
                      {item?.price.toLocaleString("vi", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </Text>
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
  container: {
    flex: 1,
    //alignItems: 'center',
    //backgroundColor: "grey"
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  flatlist: {
    marginVertical: 15,
    alignItems: "center",
    //justifyContent: 'center',
    marginRight: 20,
  },
  categories: {
    fontSize: 18,
    //marginRight: 20,
  },
  categoryImage: {
    width: 50,
    height: 50,
  },
  exception: {
    flexDirection: "row",
    backgroundColor: "white",
    height: 143,
  },
  imageThumbnail: {
    //justifyContent: "center",
    // alignItems: "center",
    height: 200,
    width: 200,
    //width: '100%',
    // borderColor: "black",
    // borderWidth: 1
    // flex:1,
    //aspectRatio: 1,
  },
  itemTitle: {
    fontSize: 18,
    height: 70,
    paddingHorizontal: 5,
  },
  itemPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#AF3A5D",
  },
  itemStat: {
    fontSize: 18,
  },
  selectedCategory: {
    borderBottomColor: "blue",
    borderBottomWidth: 3,
  },
  selectedText: {
    color: "blue",
    marginBottom: 5,
  },
  filter: {
    marginVertical: 5,
    marginTop: 8,
    padding: 10,
    margin: 3,
    backgroundColor: "white",
    marginBottom: 10,
  },
  filterText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "grey",
  },
  selectedFilter: {
    color: "blue",
  },
});
