const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  price: { type: Number, required: true },
  description: {
    type: String,
    require: true,
  },
  category: {
    type: String,
    require: true,
  },
  image: {
    type: String,
    require: true,
  },
  offer: { type: Number, required: false, default: 0 },
  sold: { type: Number, required: false, default: 0 },
  storage: {
    type: Number,
    default: 10,
  },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product