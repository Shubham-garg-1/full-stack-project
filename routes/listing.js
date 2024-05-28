const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });

router
    .route("/")
    .get(wrapAsync(listingController.index))
    .post(
        isLoggedIn,
        
        upload.single("listing[image]"),
        validateListing,
       wrapAsync(listingController.createListing)
    );

//New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

router
    .route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(
        isLoggedIn,
        isOwner,
        upload.single("listing[image]"),
        validateListing,
        wrapAsync(listingController.updateListing)
    )
    .delete(
        isLoggedIn,
        isOwner, 
        wrapAsync(listingController.destroyListing)
    );

//Edit Route
router.get(
    "/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.renderEditForm)
);



//bookings

/*router.get(
    ":id/booking",
    isLoggedIn,
    wrapAsync(async (req, res) =>{
        let {id} = req.params;
        const listing = await Listing.findById(id);
        res.render("listings/booking.ejs", {listing});
    })
);*/

module.exports = router;