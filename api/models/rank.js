const mongoose = require("mongoose");

const rankSchema = new mongoose.Schema({
        productid: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
          },
        rate: {
          type: Number,
          default: 5,
        },
});

const Rank = mongoose.model("Rank", rankSchema);

module.exports = Rank