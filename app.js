const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const mongoConnect = require('./util/database').mongoConnect;
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
// this indicate the folder for the views is "views", you can change it and rename the folder
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  // const hugo = new User('Hugo', 'hugo@test.com');
  // hugo.save();
  User.findById('6529bb7ca978657c01589dae')
    .then((usr) => {
      req.user = new User(usr.name, usr.email, usr.cart, usr._id);
      next();
    })
    .catch((err) => console.log(err));
});
app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoConnect(() => app.listen(3000));
