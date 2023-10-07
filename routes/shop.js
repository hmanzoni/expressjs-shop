const path = require('path');
const express = require('express');

const rootDir = require('../util/path');
const adminData = require('./admin');

const router = express.Router();

router.get('/', (req, res, next) => {
  // res.send('<h1>Hello from Express!</h1>');
  // console.log(adminData.products);
  // res.sendFile(path.join(rootDir, 'views', 'shop.html'));
  const products = adminData.products;

  // PUG Files render
  // res.render('shop', { prods: products, pageTitle: 'Shop', path: '/' });

  // HBS Files render
  res.render('shop', {
    prods: products,
    pageTitle: 'Shop',
    path: '/',
    hasProds: products.length > 0,
    activeShop: true,
    productCSS: true,
  });
});

module.exports = router;
