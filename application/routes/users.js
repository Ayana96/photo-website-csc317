var express = require('express');
var router = express.Router();
var db = require('../config/database');
const { successPrint, errorPrint } = require('../helpers/debug/debugprinters');
const UserError = require('../helpers/error/UserError');
var bcrypt = require('bcrypt');
const UserModel = require('../modules/Users');
const { rawListeners } = require('npmlog');
const { registerValidation } = require('../middleware/validation');


router.post('/register', registerValidation, (req, res, next) => {
  let username = req.body.username;
  let email = req.body.email;
  let password = req.body.password;
  let confirmpassword = req.body.confirmpassword;

  UserModel.usernameExists(username)
    .then((userDoesNameExist) => {
      if (userDoesNameExist) {
        throw new UserError(
          "Registration Failed: Username already exists",
          "/registration",
          200
        );
      } else {
        return UserModel.emailExists(email);
      }
    })
    .then((emailDoesExist) => {
      if (emailDoesExist) {
        throw new UserError(
          "Registration Failed: Email already exists",
          "/registration",
          200
        );
      } else {
        return UserModel.create(username, password, email);
      }
    })
    .then((createdUserId) => {
      if (createdUserId < 0) {
        throw new UserError(
          "Server Error, user could not be created",
          "/registration",
          500
        )
      } else {
        successPrint("User.js --> user was created!!");
        req.flash('success', 'User account has been made');
        req.session.save(err => {
          res.render("login");
      });
      }
    })
    .catch((err) => {
      errorPrint("user could not be made", err);
      if (err instanceof UserError) {
        errorPrint(err.getMessage());
        req.flash('error', getMessage());
        res.status(err.getStatus());
        res.redirect(err.getRedirectURL());
      } else {
        next(err);
      }
    });
});


router.post('/login', (req, res, next) => {
  let username = req.body.username;
  let password = req.body.password;

  UserModel.authenticate(username, password)
    .then((loggedUserId) => {
      if (loggedUserId > 0) {
        successPrint(`User ${username} is logged in`);
        req.session.username = username;
        req.session.userId = loggedUserId;
        res.locals.logged = true;
        req.flash('success', 'You have been successfully logged in');
        res.render('');
      } else {
        throw new UserError("Invalid username and/or password", 'login', 200);
      }
    })
    .catch((err) => {
      errorPrint("user login failed");
      if (err instanceof UserError) {
        errorPrint(err.getMessage());
        req.flash('error', err.getMessage());
        res.status(err.getStatus());
        res.render('login');
      } else {
        next(err);
      }
    });
});

router.post('/logout', (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      errorPrint('Session could not be destroyed');
      next(err);
    } else {
      successPrint('Session was destroyed');
      res.clearCookie('bonk');
      res.json({ status: "ok", message: "user is logged out" });
    }
  });
});
module.exports = router;
