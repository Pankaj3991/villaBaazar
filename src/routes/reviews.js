const express = require("express");
const {validateReviews, isLoggedIn, isReviewAuthor} = require("../middleware/authentication.js");
const { createReview, deleteReview } = require("../controller/reviews.js");

const router = express.Router({mergeParams:true});

router
    .route("/")
    .post( isLoggedIn,validateReviews, createReview);

router
    .route("/:reviewId")
    .delete(isLoggedIn, isReviewAuthor, deleteReview);

module.exports = router;