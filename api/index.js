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


// product methods

//get all products
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
    const limit = 4;
    const product = await Product.find().sort(sold).limit(limit);
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

//update


app.put("/products/:id", async (req, res) => {
  try {
    console.debug("Updating Product...");
    const updatedProduct = await Product.findByIdAndUpdate({_id:req.params.id,
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


//cart
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
    const { userId, cartItems, totalPrice, shippingAddress, paymentMethod, delivery } =
      req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    //create an array of product objects from the cart Items
    const products = cartItems.map((item) => ({
      name: item?.title,
      quantity: item.quantity,
      price: item.price,
      image: item?.image,
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
    });

    await order.save();

    res.status(200).json({ message: "Order created successfully!" });
  } catch (error) {
    console.log("error creating orders", error);
    res.status(500).json({ message: "Error creating orders" });
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

app.get("/orders/:userId",async(req,res) => {
  try{
    const userId = req.params.userId;

    const orders = await Order.find({user:userId}).populate("user");

    if(!orders || orders.length === 0){
      return res.status(404).json({message:"No orders found for this user"})
    }

    res.status(200).json({ orders });
  } catch(error){
    res.status(500).json({ message: "Error"});
  }
})