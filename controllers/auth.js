const crypto = require('crypto');
const { validationResult } = require('express-validator');

const bcryptjs = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const User = require('../models/user');

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key:
        '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',
    },
  })
);

exports.getLogin = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMsg: message,
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMsg: message,
  });
};

exports.postLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('auth/login', {
      path: '/login',
      pageTitle: 'login',
      errorMsg: errors.array()[0].msg,
    });
  }
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
  const { email, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      errorMsg: errors.array()[0].msg,
    });
  }
  bcryptjs
    .hash(password, 12)
    .then((hashedPass) => {
      const user = new User({
        email,
        password: hashedPass,
        cart: { items: [] },
      });
      return user.save();
    })
    .then(() => {
      res.redirect('/login');
      return transporter
        .sendMail({
          to: email,
          from: 'hugocmdesign@gmail.com',
          subject: 'Singup succeeded!',
          html: '<h1>You successfully signed up!</h1>',
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect('/');
  });
};

exports.getReset = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/reset', {
    path: '/reset',
    pageTitle: 'Reset Pass',
    errorMsg: message,
  });
};

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect('/reset');
    }
    const token = buffer.toString('hex');
    User.findOne({ email: req.body.email })
      .then((usr) => {
        if (!usr) {
          req.flash('error', 'No account with that email found.');
          return res.redirect('/reset');
        }
        usr.resetToken = token;
        usr.resetTokenExpiration = Date.now() + 3600000;
        return usr.save();
      })
      .then(() => {
        res.redirect('/');
        transporter
          .sendMail({
            to: req.body.email,
            from: 'hugocmdesign@gmail.com',
            subject: 'Password reset',
            html: `
          <h1>You requested a password reset</h1>
          <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new pass</p>
          `,
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  });
};

exports.getNewPass = (req, res, next) => {
  const token = req.params.token;
  User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
    .then((user) => {
      let message = req.flash('error');
      if (message.length > 0) {
        message = message[0];
      } else {
        message = null;
      }
      res.render('auth/new-pass', {
        path: '/new-pass',
        pageTitle: 'New Pass',
        errorMsg: message,
        passToken: token,
        userId: user._id.toString(),
      });
    })
    .catch((err) => console.log(err));
};

exports.postNewPass = (req, res, next) => {
  const newPass = req.body.password;
  const usrId = req.body.userId;
  const passToken = req.body.passToken;
  let resetUser;
  User.findOne({
    resetToken: passToken,
    resetTokenExpiration: { $gt: Date.now() },
    _id: usrId,
  })
    .then((usr) => {
      resetUser = usr;
      return bcryptjs
        .hash(newPass, 12)
        .then((hashedPass) => {
          resetUser.password = hashedPass;
          resetUser.resetToken = null;
          resetUser.resetTokenExpiration = null;
          return resetUser.save();
        })
        .then((result) => res.redirect('/login'));
    })
    .catch((err) => console.log(err));
};
