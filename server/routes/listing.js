const router = require("express").Router();
const multer = require("multer");

const Listing = require("../models/Listing");
const User = require("../models/User");
const { uploadToGridFS, deleteFile } = require("../utils/gridfs");
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

    // Upload all photos to GridFS
    const listingPhotoPaths = [];
    for (const file of listingPhotos) {
      const uploadedFile = await uploadToGridFS(file);
      listingPhotoPaths.push(uploadedFile.filename);
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
      listingPhotoPaths,
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

    // Delete old images if they exist
    if (listing.listingPhotoPaths && listing.listingPhotoPaths.length > 0) {
      for (const oldImagePath of listing.listingPhotoPaths) {
        try {
          await deleteFile(oldImagePath);
        } catch (error) {
          console.log("Error deleting old image:", error);
        }
      }
    }

    // Upload new images
    const newListingPhotoPaths = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const uploadedFile = await uploadToGridFS(file);
        newListingPhotoPaths.push(uploadedFile.filename);
      }
    }

    // Update listing with new images
    listing.listingPhotoPaths = newListingPhotoPaths;
    await listing.save();

    res.status(200).json({ 
      message: "Listing images updated successfully", 
      listing: {
        _id: listing._id,
        title: listing.title,
        listingPhotoPaths: listing.listingPhotoPaths
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
      listings = await Listing.find({ category: qCategory }).populate("creator")
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

module.exports = router
