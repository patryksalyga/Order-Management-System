const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller.js');

router.get('/', orderController.getOrders);
router.get('/user', orderController.getOrdersByUser);
router.get('/:id', orderController.getOrderById);

router.post('/', orderController.createOrder);
router.post('/:id/opinions', orderController.addReview);

router.patch('/:id', orderController.updateOrderStatus);

module.exports = router;