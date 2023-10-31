const User = require("../database/models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");

module.exports.renderSignUp = wrapAsync( async (req, res) => {
    res.render("listings/user/signup.ejs");

});

module.exports.signUp = wrapAsync(async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        req.flash("success", `Hello ${username}, I welcome you to villaBazaar`);
        // for automatically login as user signup
        req.login(registeredUser,(err) => {
            if(err) {
                return next(err);
            }
            req.flash("success", `Hello ${username}, Welcome to villaBazaar`);
            res.redirect("/listings");
        });
    } catch (error) {
        req.flash("error", error.message);
        res.redirect("/signup");
    }
});

module.exports.renderLogin = wrapAsync(async (req, res) => {
    res.render("listings/user/login.ejs");
});

module.exports.login = wrapAsync(async (req, res) => {
    req.flash("success", "Welcome back to villaBazaar")
    let redirectingUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectingUrl);
    // req.session.redirectUrl is created in authentication.js
});

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if(err) {
            return next(err);
        }
        req.flash("success", "logged you out!");
        res.redirect("/listings");
    });
}