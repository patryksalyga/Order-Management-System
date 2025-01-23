const mongoose = require('mongoose');

const OrderStatusSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please enter an order status name"],
            unique: true
        }
    },
    {
        timestamps: true
    }
);

const OrderStatus = mongoose.model("OrderStatus", OrderStatusSchema);
module.exports = OrderStatus;
