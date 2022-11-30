const mongoose = require("mongoose");


const orderSchema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    product: {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
        require: true
    },
    quantity: {
        type: Number,
        default: 1
    }
}, {
    versionKey: false
});


const Order = mongoose.model("Order", orderSchema);


module.exports = Order;