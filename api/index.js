const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const app = express();
const port = 8000;
const cors = require("cors");
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const jwt = require("jsonwebtoken");

app.listen(port, () => {
  console.log("Server is running on port 8000");
});



mongoose
  .connect("mongodb+srv://nguyenphuocanvu:12345@cluster0.usyffcd.mongodb.net/", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDb", err);
  });

//endpoint to register in the app

const User = require("./models/user");
const Order = require("./models/order");
const Product = require("./models/product");
const Category = require("./models/category");


// ------------users methods

//Get all users
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    if (!users) {
      throw "error";
    }
    return res.status(201).json(users);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});
//sendVerificationEmail
const sendVerificationEmail = async (email, verificationToken) => {
  // Create a Nodemailer transporter
  const transporter = nodemailer.createTransport({
    // Configure the email service or SMTP details here
    service: "gmail",
    auth: {
      user: "nguyenphuocanvu@gmail.com",
      pass: "bngjbwzkvfpnptrd",
    },
  });

  // Compose the email message
  const mailOptions = {
    from: "Shein.com",
    to: email,
    subject: "Email Verification",
    text: `Please click the following link to verify your email: http://localhost:8000/verify/${verificationToken}`,
  };

  // Send the email
  try {
    await transporter.sendMail(mailOptions);
    console.log("Verification email sent successfully");
  } catch (error) {
    console.error("Error sending verification email:", error);
  }
};

app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("Email already registered:", email); // Debugging statement
      return res.status(400).json({ message: "Email already registered" });
    }

    // Create a new user
    const newUser = new User({ name, email, password });

    // Generate and store the verification token
    newUser.verificationToken = crypto.randomBytes(20).toString("hex");

    // Save the user to the database
    await newUser.save();

    // Debugging statement to verify data
    console.log("New User Registered:", newUser);

    // Send verification email to the user
    // Use your preferred email service or library to send the email
    sendVerificationEmail(newUser.email, newUser.verificationToken);

    res.status(201).json({
      message:
        "Registration successful. Please check your email for verification.",
    });

  } catch (error) {
    console.log("Error during registration:", error); // Debugging statement
    res.status(500).json({ message: "Registration failed" });
  }
});

//user
app.get("/user/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    //find the user by the Userid
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    //find index of this address in the array
    
    //console.log("address needs looking", findAddress)

    //res.status(200).json({ message: "Address created Successfully" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error addding address" });
  }
});


app.put("/updateUser", async (req, res) => {
  try {

    const { userId,updatedUser } = req.body;
    //find the user by the Userid
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log(updatedUser);
    user.name = updatedUser.name;
    user.avatar = updatedUser.avatar;
    user.phone = updatedUser.phone;
    await user.save();
    //res.status(200).json({ message: "Address created Successfully" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error addding address" });
  }
});


//endpoint to verify email
app.get("/verify/:token", async (req, res) => {
  try {
    const token = req.params.token;

    //Find the user witht the given verification token
    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return res.status(404).json({ message: "Invalid verification token" });
    }

    //Mark the user as verified
    user.verified = true;
    user.verificationToken = undefined;

    await user.save();

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    res.status(500).json({ message: "Email Verificatioion Failed" });
  }
});



//login
const generateSecretKey = () => {
  const secretKey = crypto.randomBytes(32).toString("hex");

  return secretKey;
};

const secretKey = generateSecretKey();
//enpoint to login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;


    //check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    //check if the user has verified the account
    if (user.verified === false) {
      return res.status(401).json({ message: "not verified" });
    }
    //check if the password is correct
    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid password" });
    }

    //generate a token
    const token = jwt.sign({ userId: user._id }, secretKey);

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Login Failed" });
  }
});

//endpoint to store a new address
app.post("/addresses", async (req, res) => {
  try {
    const { userId, address } = req.body;

    //find the user by the Userid
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    //add the new address to the user's addresses array
    user.addresses.push(address);

    //save the updated user in te backend
    await user.save();

    res.status(200).json({ message: "Address created Successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error addding address" });
  }
});


//delete address
app.delete("/addresses/:userId/:addressId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const addressId = req.params.addressId
    //const {addressId} = req.body;
    console.log({userId})
    console.log({addressId})
    //find the user by the Userid
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    //find index of this address in the array
    console.log(user.addresses.filter((item)=> item?._id != addressId))
    const removeAddress = user.addresses.filter((item)=> item?._id != addressId)
    //console.log(removeAddress)
    user.addresses = removeAddress
    //delete wanted address in the user's addresses array
    //user.addresses.splice(address);

    //save the updated user in the backend
    await user.save();

    res.status(200).json({ message: "Address deleted Successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting address" });
  }
});

//get address by id
app.get("/addresses/:userId/:addressId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const addressId = req.params.addressId
    //const {addressId} = req.body;
    console.log({addressId})
    //find the user by the Userid
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    //find index of this address in the array
    const findAddress = user.addresses.filter((item)=> item?._id == addressId)
    console.log("address needs looking", findAddress)

    //res.status(200).json({ message: "Address created Successfully" });
    res.status(200).json({ findAddress });
  } catch (error) {
    res.status(500).json({ message: "Error finding address" });
  }
});
//endpoint to get all the addresses of a particular user
app.get("/addresses/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const addresses = user.addresses;
    res.status(200).json({ addresses });
  } catch (error) {
    res.status(500).json({ message: "Error retrieveing the addresses" });
  }
});

//get the user profile
app.get("/profile/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving the user profile" });
  }
});


// ------------product methods

//get all products
//add a new product
app.post("/products", async (req, res) => {
  try {
    console.debug("Adding a new product...");
    const product = new Product({ ...req.body });
    await product.save();
    return res.status(201).json(product);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});
app.get("/products", async (req, res) => {
  try {
    const product = await Product.find();
    if (!product) {
      throw "error";
    }
    return res.status(201).json(product);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

//get 4 most sold products
app.get("/trendingproducts", async (req, res) => {
  try {
    const sold = { sold: -1 };
    const limit = 5;
    const product = await Product.find().sort(sold).limit(limit);
    if (!product) {
      throw "error";
    }
    return res.status(201).json(product);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
})
//get top 5 new products
app.get("/newproducts", async (req, res) => {
  try {
    const _id = { _id: -1 };
    const limit = 5;
    const product = await Product.find().sort(_id).limit(limit);
    if (!product) {
      throw "error";
    }
    return res.status(201).json(product);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
})
//get top 4 highest sale products
app.get("/saleproducts", async (req, res) => {
  try {
    const offer = { offer: -1 };
    const limit = 6;
    const product = await Product.find().sort(offer).limit(limit);
    if (!product) {
      throw "error";
    }
    return res.status(201).json(product);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
})

//get product by id
app.get("/products/:id", async (req, res) => {
  try {
    const product = await Product.find({ _id: req.params.id });
    if (!product) res.status(404).send("Not found!");
    res.send(product);
  } catch (e) {
    res.status(500).send(e);
  }
});
//add a new product
app.post("/products", async (req, res) => {
  try {
    console.debug("Adding a new product...");
    const product = new Product({ ...req.body });
    await product.save();
    return res.status(201).json(product);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

app.put("/products/:id", async (req, res) => {
  try {
    console.debug("Updating Product...");
    const updatedProduct = await Product.findByIdAndUpdate({
      _id: req.params.id,
      new: true,
    });
    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found." });
    }
    return res.json(updatedProduct);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});
//delete
app.delete("/products/:id", async (req, res) => {
  try {
    console.debug("Deleting this product...");
    const deletetSProduct = await Product.findOneAndDelete({
      _id: req.params.id,
    });
    if (!deletetSProduct) {
      return res.status(404).json({ error: "Product not found." });
    }
    return res.json(deletetSProduct);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});


// ------------cart methods

//add new product into cart or increase quantity
app.post("/cart", async (req, res) => {
  try {
    const { userId, cart } = req.body;
    //find the user by the Userid
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log(cart.productid)
    //user.cart.push(cart);
    const existingProduct = user.cart.find((item)=> item.productid.toString() === cart.productid)
    //console.log(existingProduct)
    if(existingProduct){
      existingProduct.quantity++;
      // await existingProduct.save();
    }
    else{
      user.cart.push(cart);
    }
    //save the updated user in te backend
    await user.save();

    res.status(200).json({ message: "Product added to Cart Successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error addding into cart" });
  }
});


//get user info including cart with specific products's detail preference
app.get("/productsInCart/:userId", async (req, res) => {
  try {

    const userId = req.params.userId;
    const user = await User.findById(userId).populate('cart.productid');

    if (!user) {
      throw "error";
    }
    return res.status(201).json(user.cart);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});
// increase quantity of product in cart
app.put("/cartIncreasedQuanity/:userId/:productid", async (req, res) => {
  try {
    const userId = req.params.userId;
    const productId = req.params.productid
    //find the user by the Userid
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log(productId)
    //user.cart.push(cart);
    const checkedProduct = user.cart.find((item)=> item.productid.toString() === productId)
    //console.log(checkedProduct)
    if(checkedProduct){
      console.log(checkedProduct)
      checkedProduct.quantity++;
      // await existingProduct.save();
    }
    else{
      console.log("Fail to find product")
    }
    //save the updated user in te backend
    await user.save();

    //res.status(200).json({ checkedProduct });
    res.status(200).json({ message: "Product increase quantity from Cart Successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting" });
  }
});
//decrease 
app.put("/cartDecreasedQuanity/:userId/:productid", async (req, res) => {
  try {
    const userId = req.params.userId;
    const productId = req.params.productid
    //find the user by the Userid
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log(productId)
    //user.cart.push(cart);
    const checkedProduct = user.cart.find((item)=> item.productid.toString() === productId)
    //console.log(checkedProduct)
    if(checkedProduct){
      console.log(checkedProduct)
      checkedProduct.quantity--;
      // await existingProduct.save();
    }
    else{
      console.log("Fail to find product")
    }
    //save the updated user in te backend
    await user.save();

    //res.status(200).json({ checkedProduct });
    res.status(200).json({ message: "Product increase quantity from Cart Successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting" });
  }
});
//delete a product in cart 
app.delete("/cart/:userId/:productid", async (req, res) => {
  try {
    const userId = req.params.userId;
    const productId = req.params.productid
    //find the user by the Userid
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log(productId)
    //user.cart.push(cart);
    const checkedProduct = user.cart.filter((item)=> item.productid.toString() != productId)
    //console.log(checkedProduct)
    if(checkedProduct){
      //existingProduct.quantity++;
      console.log("left products:",checkedProduct)
      user.cart = checkedProduct
    }
    else{
      console.log("Fail to find deleted product")
    }
    //save the updated user in te backend
    await user.save();

    res.status(200).json({ checkedProduct });
    //res.status(200).json({ message: "Product deleted from Cart Successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting" });
  }
});
// ------------orders methods

//get all orders
app.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find();
    if (!orders) {
      throw "error";
    }
    return res.status(201).json(orders);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});
//create an array of product objects from the cart Items
app.post("/orders", async (req, res) => {
  try {
    const { userId, cartItems, totalPrice, shippingAddress, paymentMethod, delivery, status, finalCost } =
      req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    //create an array of product objects from the cart Items
    const products = cartItems.map((item) => ({
      productid: item?.productid._id,
      name: item?.productid.title,
      quantity: item.quantity,
      price: item.price,
      image: item?.productid.image,
    }));

    //const updateProduct = Product.findOne
    //create a new Order
    const order = new Order({
      user: userId,
      products: products,
      totalPrice: totalPrice,
      shippingAddress: shippingAddress,
      paymentMethod: paymentMethod,
      delivery: delivery,
      status: status,
      finalCost: finalCost,
    });
    
    await order.save();
    //delete products in cart
    user.cart.splice(0);
    await user.save();
    res.status(200).json({ message: "Order created successfully!" });
  } catch (error) {
    console.log("error creating orders", error);
    res.status(500).json({ message: "Error creating orders" });
  }
});


app.patch("/updateOrderStatus/:id", async (req, res) => {
  try {
    const _id = req.params.id;
    const updatedOrder = await Order.findByIdAndUpdate({
      _id,
    }, req.body);
    return res.status(201).json(updatedOrder);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

//get orders by ID
app.get("/findOrder/:id", async (req, res) => {
  try {
    const order = await Order.find({ _id: req.params.id });
    if (!order) res.status(404).send("Not found!");
    res.send(order);
  } catch (e) {
    res.status(500).send(e);
  }
});


//get order by user
app.get("/orders/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    //const orders = await Order.find({ user: userId }).populate("user");
    const orders = await Order.find({ user: userId });

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found for this user" })
    }
    
    res.status(200).json( orders );
  } catch (error) {
    res.status(500).json({ message: "Error" });
  }
});

//categories methods
//get all categories
app.get("/categories", async (req, res)=> {
  try{
    const categories = await Category.find();
    if (!categories) {
    throw "error";
    }
    res.status(200).json({message: "ok", data: categories});
  } catch(error){
    res.status(400).json({message: "Error"});
  }
});
//create category
app.post("/categories", async (req, res) => {
  try{
    const { name, description } = req.body;

    //check if the category exists
    const category = await Category.findOne({ name });
    if (category) {
      return res.status(400).json({ message: "Category already exists" });
    }

    // Create a new category
    const newCategory = new Category({
      name,
      description,
    });

    // Save the category to the database
    await newCategory.save();

    res.status(200).json({ message: "Category created successfully" });
  } catch(error){
    res.status(400).json({message: "Error"});
  }
});
//update categories
app.put("/categories", async(req, res) => {
  try{
    const { categoryId, name, description } = req.body;
    //find the category by the CategoryId
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    category.name = name;
    category.description = description;
    await category.save();
    res.status(200).json(category);
    // res.status(200).json({ message: "Category updated successfully" });
  }catch(e){res.status(400).json({message: "Error"});}
});
//delete categories
app.delete("/categories/:id", async(req, res) => {
  try{
    const deleteCategory = await Category.findOneAndDelete({
      _id: req.params.id,
    });
    if (!deleteCategory) {
      return res.status(404).json({ error: "Category not found." });
    }
    return res.status(200).json({ message: "Delete category successfully", data: deleteCategory });
  }catch(e){res.status(400).json({message: "Error"});}
});


