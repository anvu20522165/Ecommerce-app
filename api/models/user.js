const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: false,
    default: "https://th.bing.com/th/id/OIP.3IsXMskZyheEWqtE3Dr7JwHaGe?pid=ImgDet&rs=1"
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  verificationToken: String,
  addresses: [
    {
      name: String,
      mobileNo: String,
      houseNo: String,
      street: String,
      landmark: String,
      city: String,
      country: String,
      postalCode: String,
    },
  ],
  cart: [
    {
      productid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      quantity: Number,
      price: Number,
    }
  ],
  favorites: [
    {
      productid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      price: Number,
    }
  ],
  // orders: [
  //   {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "Order",
  //   },
  // ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User",userSchema);

module.exports = User