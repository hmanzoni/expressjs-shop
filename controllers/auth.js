const bcryptjs = require('bcryptjs');
const User = require('../models/user');

exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMsg: req.flash('error'),
  });
};

exports.getSignup = (req, res, next) => {
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
  });
};

exports.postLogin = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .then((usr) => {
      if (!usr) {
        req.flash('error', 'Invalid email or password.');
        return res.redirect('/login');
      }
      bcryptjs
        .compare(password, usr.password)
        .then((doMatch) => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = usr;
            return req.session.save((err) => {
              console.log(err);
              req.flash('error', 'Invalid email or password.');
              res.redirect('/login');
            });
          }
          req.flash('error', 'Invalid email or password.');
          res.redirect('/login');
        })
        .catch((err) => {
          console.log(err);
          return res.redirect('/signup');
        });
    })
    .catch((err) => console.log(err));
};

exports.postSignup = (req, res, next) => {
  const { email, password, confirmPassword } = req.body;
  User.findOne({ email })
    .then((usr) => {
      if (usr) {
        return res.redirect('/login');
      }
      return bcryptjs
        .hash(password, 12)
        .then((hashedPass) => {
          const user = new User({
            email,
            password: hashedPass,
            cart: { items: [] },
          });
          return user.save();
        })
        .then(() => res.redirect('/login'));
    })
    .catch((err) => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect('/');
  });
};
