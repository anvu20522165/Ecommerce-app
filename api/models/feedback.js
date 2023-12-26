const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
        userid: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        productid: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
          },
        rate: {
          type: Number,
          default: 5,
        },
        comment: {
          type: String,
        }
});

const Feedback = mongoose.model("Feedback", feedbackSchema);

module.exports = Feedback