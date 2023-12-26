const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
        orderid: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
          },
        isClicked: {
          type: Boolean,
          default: false,
        },
        time: {
            type: Date,
            default: Date.now,
        }
});

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification