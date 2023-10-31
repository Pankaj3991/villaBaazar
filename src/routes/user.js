const express = require("express");
const passport = require("passport");
const { savedRedirectUrl } = require("../middleware/authentication.js");
const {renderSignUp, signUp, renderLogin,login,logout} = require("../controller/user.js");

const router = express.Router();

router
   .route("/signup")
   .get(renderSignUp)
   .post(signUp);

router
   .route("/login")
   .get(renderLogin)
   .post(savedRedirectUrl,
      passport.authenticate("local",
         {
            failureRedirect: '/login',
            failureFlash: true
         }),
      login);

router.get("/logout", logout);

module.exports = router;