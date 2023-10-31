const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../database/models/listing.js");

module.exports.index = wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
});

module.exports.newList = wrapAsync(async (req, res) => {
    res.render("listings/new.ejs");
});

module.exports.showList = wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).
        populate("owner").       
        populate({ path: "reviews", populate: { path: "author" } });
    if (!listing) {
        req.flash("error", "Listing you requested doesn't exist");
        res.redirect("/listings");
    }else{
        console.log(listing);
    res.render("listings/show.ejs", { listing });
    }
});

module.exports.createList = wrapAsync(async (req, res) => {
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    await newListing.save();
    req.flash("success", "new listing created");
    res.redirect("/listings");
});

module.exports.editPage = wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested doesn't exist");
        res.redirect("/listings");
    } else {
        // To reduce preview image quality. 
        let originalImageUrl = listing.image.url;
        originalImageUrl = originalImageUrl.replace("/upload","/upload/w_250")
        res.render("listings/edit.ejs", { listing,originalImageUrl });
    }
});

module.exports.editList = wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if (typeof req.file !== 'undefined') {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }
    req.flash("success", "listing successfully updated");
    res.redirect(`/listings/${id}`);
});

module.exports.deleteList = wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "listing successfully deleted");
    res.redirect("/listings");
});