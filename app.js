const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csurf = require('csurf');
const flash = require('connect-flash');

const errorController = require('./controllers/error');
const mongoConnect = require('./util/database');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const User = require('./models/user');

const app = express();

const store = new MongoDBStore({
  uri: mongoConnect.MONGODB_URI,
  collection: 'sessions',
});

const csrfProtection = csurf();

app.set('view engine', 'ejs');
// this indicate the folder for the views is "views", you can change it and rename the folder
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoConnect.mongoConnect(() => app.listen(3000));
