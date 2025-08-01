const router = require("express").Router();
const multer = require("multer");

const Listing = require("../models/Listing");
const User = require("../models/User");

const { auth } = require("../middleware/auth");

/* Configuration Multer for Memory Storage */
const upload = multer({ storage: multer.memoryStorage() });

/* CREATE LISTING */
router.post("/create", upload.array("listingPhotos"), async (req, res) => {
  try {
    /* Take the information from the form */
    const {
      creator,
      category,
      type,
      streetAddress,
      aptSuite,
      city,
      province,
      country,
      guestCount,
      bedroomCount,
      bedCount,
      bathroomCount,
      amenities,
      title,
      description,
      highlight,
      highlightDesc,
      price,
    } = req.body;

    const listingPhotos = req.files

    if (!listingPhotos) {
      return res.status(400).send("No file uploaded.")
    }

    // Store all photos as Buffers
    const listingPhotoData = [];
    for (const file of listingPhotos) {
      listingPhotoData.push({
        data: file.buffer,
        contentType: file.mimetype
      });
    }

    const newListing = new Listing({
      creator,
      category,
      type,
      streetAddress,
      aptSuite,
      city,
      province,
      country,
      guestCount,
      bedroomCount,
      bedCount,
      bathroomCount,
      amenities,
      listingPhotos: listingPhotoData,
      title,
      description,
      highlight,
      highlightDesc,
      price,
    })

    await newListing.save()

    res.status(200).json(newListing)
  } catch (err) {
    res.status(409).json({ message: "Fail to create Listing", error: err.message })
    console.log(err)
  }
});

/* UPDATE LISTING IMAGES */
router.patch("/:listingId/images", auth, upload.array("listingPhotos"), async (req, res) => {
  try {
    const { listingId } = req.params;
    
    const listing = await Listing.findById(listingId).populate("creator");
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    // Check if user is the creator of the listing
    if (listing.creator._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only update your own listings" });
    }

    // Store new images as Buffers
    const newListingPhotoData = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        newListingPhotoData.push({
          data: file.buffer,
          contentType: file.mimetype
        });
      }
    }

    // Update listing with new images
    listing.listingPhotos = newListingPhotoData;
    await listing.save();

    res.status(200).json({ 
      message: "Listing images updated successfully", 
      listing: {
        _id: listing._id,
        title: listing.title,
        listingPhotos: listing.listingPhotos
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to update listing images", error: err.message });
  }
});

/* GET lISTINGS BY CATEGORY */
router.get("/", async (req, res) => {
  const qCategory = req.query.category

  try {
    let listings
    if (qCategory) {
      // Use case-insensitive matching for all categories
      listings = await Listing.find({ 
        category: { $regex: qCategory, $options: "i" } 
      }).populate("creator")
    } else {
      listings = await Listing.find().populate("creator")
    }

    res.status(200).json(listings)
  } catch (err) {
    res.status(404).json({ message: "Fail to fetch listings", error: err.message })
    console.log(err)
  }
})

/* GET LISTINGS BY SEARCH */
router.get("/search/:search", async (req, res) => {
  const { search } = req.params

  try {
    let listings = []

    if (search === "all") {
      listings = await Listing.find().populate("creator")
    } else {
      listings = await Listing.find({
        $or: [
          { category: {$regex: search, $options: "i" } },
          { title: {$regex: search, $options: "i" } },
        ]
      }).populate("creator")
    }

    res.status(200).json(listings)
  } catch (err) {
    res.status(404).json({ message: "Fail to fetch listings", error: err.message })
    console.log(err)
  }
})

/* LISTING DETAILS */
router.get("/:listingId", async (req, res) => {
  try {
    const { listingId } = req.params
    const listing = await Listing.findById(listingId).populate("creator")
    res.status(202).json(listing)
  } catch (err) {
    res.status(404).json({ message: "Listing can not found!", error: err.message })
  }
})

/* GET LISTING IMAGE */
router.get("/:listingId/images/:imageIndex", async (req, res) => {
  try {
    const { listingId, imageIndex } = req.params;
    const listing = await Listing.findById(listingId);
    
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    if (!listing.listingPhotos || !listing.listingPhotos[imageIndex]) {
      return res.status(404).json({ message: "Image not found" });
    }

    const image = listing.listingPhotos[imageIndex];
    
    // Set the appropriate content type
    res.set('Content-Type', image.contentType);
    res.send(image.data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get listing image", error: err.message });
  }
});

module.exports = router
