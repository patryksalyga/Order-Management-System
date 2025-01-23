const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller.js');


router.route('/')
    .get(categoryController.getCategories);

router.post('/', categoryController.createCategory);


module.exports = router;