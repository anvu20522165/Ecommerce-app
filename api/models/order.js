const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    require: true,
  },
  products: [
    {
      productid: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      image: {
        type: String,
        required: true,
      },
    },
  ],
  totalPrice: {
    type: Number,
    required: true,
  },
  shippingAddress: {
    name: {
      type: String,
      required: true,
    },
    mobileNo: {
      type: String,
      required: true,
    },
    houseNo: {
      type: String,
      required: true,
    },
    street: {
      type: String,
      required: true,
    },
    landmark: {
      type: String,
      
    },
    postalCode: {
      type: String,
      required: true,
    },
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  delivery: {
    option: 
    {
      type: String,
      required: true,
    },
    fee: 
    {
      type: Number,
      required: true,
    }   
  },
  finalCost: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    defaul: "Pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


const Order = mongoose.model("Order",orderSchema);

module.exports = Order;