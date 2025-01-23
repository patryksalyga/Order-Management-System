const mongoose = require('mongoose');

const ProductSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please enter a product name"]
        },
        description: {
            type: String,
            required: [true, "Please enter a product description"]
        },
        price: {
            type: Number,
            required: [true, "Please enter a product price"],
            min: 0.01
        },
        weight: {
            type: Number,
            required: [true, "Please enter a product weight"],
            min: 0.01
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: [true, "Please select a category"]
        },
        image: {
            type: String,
            required: false
        }
    },
    {
        timestamps: true
    }
);

const Product = mongoose.model("Product", ProductSchema);
module.exports = Product;
