const mongoose = require("mongoose");
const colors = require("colors");

const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    price: Number,
    company: String,
    country: String,
    productImage: {
        type: String,
        require: true
    },
    productDate: {
        type: Date,
        default: new Date().toISOString()
    },
}, {
    versionKey: false
});


const Product = mongoose.model("Product", productSchema);


module.exports = Product;