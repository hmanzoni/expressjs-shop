const products = [];

exports.getAddProuct = (req, res, next) => {
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
  products.push({ title: req.body.title });
  res.redirect('/');
};

exports.getProducts = (req, res, next) => {
  res.render('shop', {
    prods: products,
    pageTitle: 'Shop',
    path: '/',
    hasProds: products.length > 0,
    activeShop: true,
    productCSS: true,
  });
};
