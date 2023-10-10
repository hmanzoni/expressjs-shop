const path = require('path');
const fileHandler = require('../util/fileHandler');

const p = path.join(path.dirname(require.main.filename), 'data', 'cart.json');

module.exports = class Cart {
  static addProduct(id, productPrice) {
    // fetch the previous cart
    fileHandler.getFile(p, (err, fileContent) => {
      let cart = { products: [], totalPrice: 0 };
      if (!err) {
        cart = JSON.parse(fileContent);
      }
      // analyze the cart => find existing prod
      const existingProdIndex = cart.products.findIndex(
        (prod) => prod.id === id
      );
      const existingProds = cart.products[existingProdIndex];
      let updatedProd;
      // add new prods / increase quantity
      if (existingProds) {
        updatedProd = { ...existingProds };
        updatedProd.qty += 1;
        cart.products = [...cart.products];
        cart.products[existingProdIndex] = updatedProd;
      } else {
        updatedProd = { id: id, qty: 1 };
        cart.products = [...cart.products, updatedProd];
      }
      cart.totalPrice = cart.totalPrice + +productPrice;
      fileHandler.saveFile(p, cart);
    });
  }

  static deleteProduct(id, productPrice) {
    fileHandler.getFile(p, (err, fileContent) => {
      if (err) return;

      const updatedCart = { ...JSON.parse(fileContent) };
      const product = updatedCart.products.find((prod) => prod.id === id);

      if (!product) return;

      const productQty = product.qty;
      updatedCart.products = updatedCart.products.filter(
        (prod) => prod.id !== id
      );
      updatedCart.totalPrice -= productPrice * productQty;
      fileHandler.saveFile(p, updatedCart);
    });
  }

  static getCart(cb) {
    fileHandler.getFile(p, (err, fileContent) => {
      const cart = JSON.parse(fileContent);
      if (err) {
        cb(null);
      } else {
        cb(cart);
      }
    });
  }
};
