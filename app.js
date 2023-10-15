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
  User.findOne().then((usr) => {
    if (!usr) {
      const firstUser = new User({
        name: 'Hugo',
        email: 'hugo@test.com',
        cart: { items: [] },
      });
      firstUser.save().then((newUsr) => (req.user = newUsr));
    } else {
      req.user = usr;
    }
    next();
  });
});
app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoConnect(() => app.listen(3000));
