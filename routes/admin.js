const path = require('path');
const express = require('express');

const rootDir = require('../util/path');

const router = express.Router();

const products = [];

router.get('/add-product', (req, res, next) => {
  // res.send(
  //   '<form action="/admin/product" method="POST"><input type="text" name="title"><button type="submit">Add Product</button></form>'
  // );
  // res.sendFile(path.join(rootDir, 'views', 'add-product.html'));

  // PUG Files render
  // res.render('add-product', {
  //   prods: products,
  //   pageTitle: 'Add product',
  //   path: '/admin/add-product',
  // });

  // HBS Files render
  res.render('add-product', {
    prods: products,
    pageTitle: 'Add product',
    path: '/admin/add-product',
    activeProduct: true,
    formCSS: true,
    productCSS: true,
  });
});

router.post('/add-product', (req, res, next) => {
  // console.log(req.body);
  products.push({ title: req.body.title });
  res.redirect('/');
});

exports.routes = router;
exports.products = products;
