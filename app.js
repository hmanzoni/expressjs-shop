const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
// this indicate the folder for the views is "views", you can change it and rename the folder
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findByPk(1)
    .then((usr) => {
      req.user = usr;
      next();
    })
    .catch((err) => console.log(err));
});
app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

Product.belongsTo(User, { constrains: true, onDelete: 'CASCADE' });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });

sequelize
  // .sync({ force: true }) // FOR DROP AND CREATE TABLES
  .sync()
  .then(() => {
    User.findByPk(1);
  })
  .then((user) => {
    if (!user) {
      return User.create({ name: 'Hugo', email: 'test@test.com' });
    }
    return user;
  })
  .then((user) => {
    return user.createCart();
  })
  .then((res) => {
    app.listen(3000);
  })
  .catch((err) => console.log(err));
