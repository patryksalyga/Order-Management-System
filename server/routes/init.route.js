const express = require('express');
const router = express.Router();
const initController = require('../controllers/init.controller.js');

router.post('/', initController.fileInit);

module.exports = router;