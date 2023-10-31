const dotenv = require("dotenv").config({path:"./.env"});
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./src/utils/ExpressError.js");
const listingRoute = require("./src/routes/listings.js");
const reviewRoute = require("./src/routes/reviews.js");
const userRoute = require("./src/routes/user.js");
const session = require("express-session");
const mongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./src/database/models/user.js");
const Connection = require("./src/database/config/config.js");



const app = express();
Connection();

// const MONGO_URL = "mongodb://127.0.0.1:27017/villaBazaar";

// main()
//   .then(() => {
//     console.log("connected to DB");
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// async function main() {
//   await mongoose.connect(MONGO_URL);
// }
const store = mongoStore.create({
  mongoUrl:`mongodb+srv://${process.env.db_username}:${process.env.db_password}@cluster0.9ca9gxg.mongodb.net/villaBazaar?retryWrites=true&w=majority`,
  crypto:{
    secret: process.env.SECRET
  },
  touchAfter:24 * 3600, 
});

store.on("error",(err)=>{
  console.log("error in mongo session store",err);
});

app.use(session({
  store:store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true
  }
}));

// for authentication and authorization: 
passport.initialize();
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(flash());
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.isLoggedIn = req.user;
  next();
});

app.set("view engine", "ejs");
app.set("views", path.join(path.resolve(), "src/views"));
app.use(express.static(path.join(path.resolve(), "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

app.get("/", (req, res) => {
  res.redirect("/listings");
});

app.use("/", userRoute);
app.use("/listings", listingRoute);
app.use("/listings/:id/reviews", reviewRoute);

// app.get("/registerUser", async (req, res) => {
//   let fakeUser = new User({
//     email: "student@gmail.com",
//     username: "Pankaj Kumar"
//   });
//   let registeredUser = await User.register(fakeUser, "password@123");
//   res.send(registeredUser);
// });

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "page not found"));
})

app.use((err, req, res, next) => {
  let { status = 500, message = "Something went wrong!" } = err;
  res.render("listings/error.ejs", { message });
  // res.status(status).send(message);
});

const port = 8080;
app.listen(port, () => {
  console.log("server is listening to port ", port);
});