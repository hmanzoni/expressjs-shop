const Product = require('../models/product');

exports.getAddProuct = (req, res, next) => {
  const products = Product.fetchAll();
  res.render('add-product', {
    prods: products,
    pageTitle: 'Add product',
    path: '/admin/add-product',
    activeProduct: true,
    formCSS: true,
    productCSS: true,
  });
};

exports.postAddProuct = (req, res, next) => {
  const product = new Product(req.body.title);
  product.save();
  res.redirect('/');
};

exports.getProducts = (req, res, next) => {
  const products = Product.fetchAll();
  res.render('shop', {
    prods: products,
    pageTitle: 'Shop',
    path: '/',
    hasProds: products.length > 0,
    activeShop: true,
    productCSS: true,
  });
};
