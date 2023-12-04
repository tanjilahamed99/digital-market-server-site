const { model, Schema } = require("mongoose");
const ProductsSchema = new Schema({
    productName: {
        type: String,
        required: true,
    },
    brand: {
        type: String,
        required: true,
    },
    details: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
    },
    price: {
        type: Number,
        required: true,
    },
    publishDate: {
        type: Date,
        required: true,
    },
})


const Products = model("Products", ProductsSchema, "Products")

module.exports = Products