const Product = require('../models/product');
const { validationResult } = require('express-validator');
const { deleteFile } = require('../util/fileHandler');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    hasError: false,
    errorMsg: null,
    validationErrors: [],
  });
};

exports.postAddProduct = (req, res, next) => {
  const { title, price, description } = req.body;
  const imageFile = req.file;
  if (!imageFile) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false,
      hasError: true,
      errorMsg: 'Attached file is not an image',
      validationErrors: [],
      product: {
        title,
        price,
        description,
      },
    });
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false,
      hasError: true,
      errorMsg: errors.array()[0].msg,
      validationErrors: errors.array(),
      product: {
        title,
        price,
        description,
      },
    });
  }
  const product = new Product({
    title,
    price,
    description,
    image: imageFile.path,
    userId: req.user._id,
  });
  product
    .save()
    .then((res) => console.log(res))
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
  res.redirect('/admin/products');
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((product) => {
      if (!product) {
        return res.redirect('/');
      }
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: product,
        hasError: false,
        errorMsg: null,
        validationErrors: [],
      });
    })
    .catch((err) => {
      console.log(err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postEditProduct = (req, res, next) => {
  const { productId, title, price, description } = req.body;
  const imageFile = req.file;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: true,
      hasError: true,
      errorMsg: errors.array()[0].msg,
      validationErrors: errors.array(),
      product: {
        title,
        price,
        description,
        image: imageFile.path,
        _id: productId,
      },
    });
  }
  Product.findById(productId)
    .then((product) => {
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect('/');
      }
      product.title = title;
      if (imageFile) {
        deleteFile(product.image);
        product.image = imageFile.path;
      }
      product.price = price;
      product.description = description;
      return product.save().then((result) => {
        console.log('UPDATED PRODUCT!');
        res.redirect('/admin/products');
      });
    })
    .catch((err) => {
      console.log(err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getProducts = (req, res, next) => {
  Product.find({ userId: req.user._id })
    // .select('title price -_id')
    // .populate('userId', 'name')
    .then((products) => {
      // console.log(products);
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products',
      });
    })
    .catch((err) => {
      console.log(err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then((prod) => {
      if (!prod) {
        return next(new Error('Product not found.'));
      }
      deleteFile(prod.image);
      return Product.deleteOne({ _id: prodId, userId: req.user._id })
        .then(() => {
          req.user.deleteCartItem(prodId).then(() => {
            res.redirect('/');
          });
        })
        .catch((err) => {
          console.log(err);
          const error = new Error(err);
          error.httpStatusCode = 500;
          return next(error);
        });
    })
    .catch((err) => {
      console.log(err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.deleteProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((prod) => {
      if (!prod) {
        return next(new Error('Product not found.'));
      }
      deleteFile(prod.image);
      return Product.deleteOne({ _id: prodId, userId: req.user._id });
    })
    .then(() => {
      req.user
        .deleteCartItem(prodId)
        .then(() => {
          res.status(200).json({ message: 'Success!' });
        })
        .catch((err) => {
          res.status(500).json();
        });
    })
    .catch((err) => {
      res.status(500).json();
    });
};
