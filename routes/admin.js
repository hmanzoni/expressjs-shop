const express = require('express');

const productsController = require('../controllers/products');

const router = express.Router();

router.get('/add-product', productsController.getAddProuct);

router.post('/add-product', productsController.postAddProuct);

module.exports = router;
