const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    discount: Number,
    company: String,
    title: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        min: 1,
        required: true
    },
    availability: {
        type: String,
        enum: ["in-stock", "out-of-stock"],
        default: "in-stock"
    }

}, {
    timestamps: true,
}

);
//create model
const Product=mongoose.model("products",productSchema);

module.exports=Product;