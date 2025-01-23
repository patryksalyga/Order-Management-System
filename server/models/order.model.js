const mongoose = require('mongoose');
const OrderStatus = require('./status.model.js')

const OrderSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        approvedAt: {
            type: Date,
            default: null
        },
        status: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "OrderStatus",
            required: [true, "Please select an order status"]
        },
        products: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: [true, "Please select a product"]
                },
                quantity: {
                    type: Number,
                    required: [true, "Please specify the quantity"],
                    min: 1
                },
                price: {
                    type: Number,
                    required: true,
                    default: 0
                }
            }
        ],
        rating: {
            type: Number,
            required: false,  
            min: 1,
            max: 5
        },
        review: {
            type: String,
            required: false
        }
    },
    {
        timestamps: true
    }
);

const Order = mongoose.model("Order", OrderSchema);
module.exports = Order;
