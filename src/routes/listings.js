const express = require("express");
const {isLoggedIn,isOwner,validateListing} = require("../middleware/authentication.js");
const {index,newList,showList,createList, editPage, editList,deleteList } = require("../controller/listing.js");
const multer = require("multer");
const {storage} = require("../database/cloudConfig.js");
const upload = multer({storage}); 
const router = express.Router({ mergeParams: true });

// router.get("/", wrapAsync(async (req,res)=>{}));

router
    .route("/")
    .get(index)
    .post( isLoggedIn,
        upload.single('listing[image]'),
        createList
    );

router.get("/new",isLoggedIn, newList);
router.get("/:id/edit", isLoggedIn, isOwner, editPage );

router
    .route("/:id")
    .get(showList)
    .put(isLoggedIn, isOwner, upload.single('listing[image]'), validateListing, editList)
    .delete(isLoggedIn, isOwner, deleteList);

module.exports = router;