const Order = require('../models/order.model.js')
const OrderStatus = require('../models/status.model');
const Product = require('../models/product.model');
const User = require('../models/user.model.js');
const jwt = require('jsonwebtoken');

const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({});
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getOrdersByUser = async (req, res) => {
    try {
        const cookies = req.cookies;

        if (!cookies?.jwt) {
            return res.sendStatus(204);
        }

        const foundToken = cookies.jwt;

        const foundUser = await User.findOne({ refreshToken: foundToken });

        const orders = await Order.find({ user: foundUser });

        return res.status(200).json(orders);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getOrderByStatus = async (req, res) => {

}

const createOrder = async (req, res) => {
    const { products } = req.body;

    try {
        const cookies = req.cookies;

        if (!cookies?.jwt) {
            return res.sendStatus(204);
        }

        const foundToken = cookies.jwt;

        const foundUser = await User.findOne({ refreshToken: foundToken });
        status = await OrderStatus.findOne({ name: "PENDING" });
        const orderStatus = await OrderStatus.findById(status);
        if (!orderStatus) {
            return res.status(400).json({ message: "Invalid order status" });
        }

        let totalOrderPrice = 0;
        const validatedProducts = await Promise.all(
            products.map(async (item) => {
                const product = await Product.findById(item.product);
                if (!product) {
                    throw new Error(`Product with ID ${item.product} not found`);
                }

                if (item.quantity <= 0) {
                    throw new Error("Quantity must be greater than zero");
                }

                const itemTotalPrice = product.price * item.quantity;
                totalOrderPrice += itemTotalPrice;

                return {
                    product: product._id,
                    quantity: item.quantity,
                    price: product.price,
                };
            })
        );

        const newOrder = new Order({
            user: foundUser,
            status: status, // ZROBIC ZAWSZE PENDING
            products: validatedProducts,
        });

        await newOrder.save();

        res.status(201).json({
            message: "Order created successfully",
            order: newOrder,
            totalOrderPrice,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const updateOrderStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        const oldStatus = await OrderStatus.findById(order.status.toString());
        const orderStatus = await OrderStatus.findById(status);

        if (!orderStatus) {
            return res.status(404).json({ message: "Invalid status" });
        }

        if (oldStatus.name.toString() === "CANCELLED") {
            return res.status(400).json({ message: "Cannot complete a cancelled order" });
        }

        if (oldStatus.name.toString() === "COMPLETED") {
            return res.status(400).json({ message: "Order already completed" });
        }

        if (oldStatus.name.toString() === "APPROVED" && orderStatus.name.toString() === "PENDING") {
            return res.status(400).json({ message: "Order already approved" });
        }

        if (order.status.toString() === status) {
            return res.status(400).json({ message: "Cannot change to the same status" });
        }

        if (order.status.toString() === status) {
            return res.status(400).json({ message: "Cannot change to the same status" });
        }

        order.status = orderStatus;

        if (orderStatus.name.toString() === "APPROVED") {
            order.approvedAt = new Date();
        }

        await order.save();


        res.status(200).json({ message: "Order status updated successfully", order });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

}

const addReview = async(req, res) => {
    const { id } = req.params;
    const { rat, des } = req.body;
    const cookies = req.cookies;

    try{
        if (!cookies?.jwt) {
            return res.sendStatus(204);
        }

        const foundUser = await User.findOne({ refreshToken: cookies.jwt });

        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (foundUser._id.toString() != order.user.toString()){
            return res.status(404).json({ message: "Wrong user" });
        }

        const status = await OrderStatus.findById(order.status.toString());

        if( status.name.toString() === "PENDING" || status.name.toString() === "APPROVED" ){
            return res.status(400).json({ message: "Cannot rate not finished order" });
        }

        if(order.rating || order.review){
            return res.status(400).json({ message: "Review exists" });
        }

        order.rating = rat;
        order.review = des;

        await order.save();

        res.status(200).json({ message: "Order review added successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


module.exports = {
    getOrders,
    getOrdersByUser,
    getOrderById,
    createOrder,
    updateOrderStatus,
    addReview
}