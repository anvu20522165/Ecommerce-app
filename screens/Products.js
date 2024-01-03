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
import ProductsSearch from "./ProductsSearch";

export default function Products() {
  const navigation = useNavigation();
  const images = [
    "https://m.media-amazon.com/images/I/41EcYoIZhIL._AC_SY400_.jpg",
    "https://m.media-amazon.com/images/G/31/img20/Events/Jup21dealsgrid/blockbuster.jpg",
    "https://images-eu.ssl-images-amazon.com/images/I/31dXEvtxidL._AC_SX368_.jpg",
    "https://m.media-amazon.com/images/G/31/img20/Events/Jup21dealsgrid/All_Icons_Template_1_icons_01.jpg",
    "https://th.bing.com/th/id/OIP.oQ9gioHYyztzuhHEVAu9OQHaHa?rs=1&pid=ImgDetMain",
    "https://i5.walmartimages.com/asr/618a647e-36db-47da-85d9-d449f283271b.734ddc164b4b2d29f9eb3d6ba8085450.jpeg",
  ];
  const route = useRoute();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
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
  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://10.0.2.2:8000/categories");
      setCategories(response.data);
      console.log("categories: ", response.data);
    } catch (error) {
      console.log("error message", error);
    }
  };
  const fetchCategory = async () => {
    try {
      const response = await axios.get(
        `http://10.0.2.2:8000/products/category/${selectedCategory}`
      );
      // setProducts(response.data);
      setFilteredProducts(response.data);
      setSortCriteria("recommended");
      setOriginalFiltered(response.data);
      console.log("category products: ", response.data);
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
    fetchCategories();
    fetchRanks();
  }, []);
  useEffect(() => {
    if(route.params?.category){
      
      setSelectedCategory(route.params?.category);
      console.log("useeff",selectedCategory);
    }
  }, [route.params?.category]);
  const handleCategorySelect = (category) => {
    if (category === "all") {
      setSelectedCategory(category);
    } else {
      setSelectedCategory(category);
    }
  };
  useEffect(() => {
    if (selectedCategory === "all") {
      //fetchProducts();
      setFilteredProducts(products);
      setOriginalFiltered(products);
      setSortCriteria("recommended");
    } else {
      fetchCategory();
    }
  }, [selectedCategory]);

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
        if (rankA && rankB) {
          // So sánh rank và sắp xếp theo thứ tự giảm dần
          return rankB.rate - rankA.rate;
        } else if (rankA) {
          // Nếu chỉ có rank của a, đặt a trước b
          return -1;
        } else if (rankB) {
          // Nếu chỉ có rank của b, đặt b trước a
          return 1;
        } else {
          // Nếu không có rank cho cả a và b, giữ nguyên thứ tự
          return 0;
        }
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
      
      // setPriceSortName("Price: Low to High");
      // if (selectedCategory === "all") {
      //   setFilteredProducts(products);
      //   setOriginalFiltered(products);
      //   setSortCriteria("recommended");
      // } else {
      //   console.log("callbackcate",selectedCategory);
      //   setSelectedCategory(selectedCategory);
      //   fetchCategory();
        
      // }

    },[])
  );
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
          onPress={()=>navigation.navigate("ProductsSearch")}
        >
          <AntDesign
            style={{ paddingLeft: 10 }}
            name="search1"
            size={22}
            color="black"
          />
          <TextInput placeholder="Search in Shein" editable={false} />
        </Pressable>

        {/* <Feather name="mic" size={24} color="black" /> */}
      </View>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        <ScrollView
          horizontal={true}
          style={styles.exception}
          showsHorizontalScrollIndicator={false}
        >
          <Pressable onPress={() => handleCategorySelect("all")}>
            <View
              style={[
                styles.flatlist,
                { marginLeft: 20 },
                selectedCategory === "all" && styles.selectedCategory,
              ]}
            >
              <Image source={{ uri: images[0] }} style={styles.categoryImage} />
              <Text
                style={[
                  styles.categories,
                  selectedCategory === "all" && styles.selectedText,
                ]}
              >
                All
              </Text>
            </View>
          </Pressable>
          <FlatList
            data={categories}
            renderItem={({ item, index }) => (
              <Pressable onPress={() => handleCategorySelect(item.name)}>
                <View
                  style={[
                    styles.flatlist,
                    selectedCategory === item.name && styles.selectedCategory,
                  ]}
                >
                  <Image
                    source={{ uri: images[index + 1] }}
                    style={styles.categoryImage}
                    resizeMode="contain"
                  />
                  <Text
                    style={[
                      styles.categories,
                      selectedCategory === item.name && styles.selectedText,
                    ]}
                  >
                    {item.name}
                  </Text>
                </View>
              </Pressable>
            )}
            keyExtractor={(item, index) => index.toString()}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
          />
        </ScrollView>
      </ScrollView>
      <ScrollView
        style={{ height: 90 }}
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
                  _id: item._id,
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
        keyExtractor={(item, index) => index.toString()}
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
