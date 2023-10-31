const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../database/models/listing.js");
const Review = require("../database/models/review.js");

module.exports.createReview = wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);

    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    // console.log(listing);
    await listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","New review created");
    res.redirect(`/listings/${listing._id}`);
 });

 module.exports.deleteReview = wrapAsync(async (req, res) => {
    let {id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
    Review.findByIdAndDelete(reviewId);
    req.flash("success","Review successfully deleted");
    res.redirect(`/listings/${id}`);
 });