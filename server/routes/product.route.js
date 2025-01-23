const express = require('express');
const Product = require('../models/product.model.js');
const router = express.Router();
const productController = require('../controllers/product.controller.js');

router.get('/', productController.getProducts);
router.get("/:id",productController.getProduct);
router.get("/:id/seo-description", productController.seoDescription)

router.post("/", productController.createProduct);

router.put("/:id", productController.updateProduct);

router.delete("/:id", productController.deleteProduct);

module.exports = router;
