const router = require("express").Router()
const { auth, authorizeUser } = require("../middleware/auth")
const multer = require("multer");
const User = require("../models/User");


// Multer configuration for memory storage
const upload = multer({ storage: multer.memoryStorage() });

const Booking = require("../models/Booking")
const Listing = require("../models/Listing")

/* UPDATE USER PROFILE IMAGE */
router.patch("/:userId/update-profile-image", auth, upload.single("profileImage"), async (req, res) => {
  try {
    const { userId } = req.params;
    
    console.log("Profile image update - Requested userId:", userId);
    console.log("Profile image update - Authenticated user ID:", req.user._id);
    console.log("Profile image update - User IDs match:", req.user._id.toString() === userId);

    // Manual authorization check
    if (req.user._id.toString() !== userId) {
      console.log("Profile image update - Authorization failed");
      return res.status(403).json({ message: "Access denied. You can only update your own profile." });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Store new profile image as Buffer
    if (req.file) {
      console.log("Updating profile image - File received:", req.file.originalname);
      console.log("Updating profile image - File size:", req.file.size);
      console.log("Updating profile image - File mimetype:", req.file.mimetype);
      
      user.profileImage = {
        data: req.file.buffer,
        contentType: req.file.mimetype
      };
      console.log("Updating profile image - Buffer size:", user.profileImage.data.length);
    } else {
      console.log("Updating profile image - No file received");
    }
    await user.save();
    console.log("Updating profile image - User saved successfully");

    res.status(200).json({ 
      message: "Profile image updated successfully", 
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        profileImage: user.profileImage,
        tripList: user.tripList,
        wishList: user.wishList,
        propertyList: user.propertyList,
        reservationList: user.reservationList
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to update profile image", error: err.message });
  }
});

/* GET TRIP LIST */
router.get("/:userId/trips", auth, authorizeUser("userId"), async (req, res) => {
  try {
    const { userId } = req.params
    const trips = await Booking.find({ userId }).populate("userId listingId")
    res.status(202).json(trips)
  } catch (err) {
    console.log(err)
    res.status(404).json({ message: "Can not find trips!", error: err.message })
  }
})

/* ADD LISTING TO WISHLIST */
router.patch("/:userId/:listingId", auth, authorizeUser("userId"), async (req, res) => {
  try {
    const { userId, listingId } = req.params
    const user = await User.findById(userId)
    const listing = await Listing.findById(listingId).populate("creator")

    const favoriteListing = user.wishList.find((item) => item._id.toString() === listingId)

    if (favoriteListing) {
      user.wishList = user.wishList.filter((item) => item._id.toString() !== listingId)
      await user.save()
      res.status(200).json({ message: "Listing is removed from wish list", wishList: user.wishList})
    } else {
      user.wishList.push(listing)
      await user.save()
      res.status(200).json({ message: "Listing is added to wish list", wishList: user.wishList})
    }
  } catch (err) {
    console.log(err)
    res.status(404).json({ error: err.message })
  }
})

/* GET USER LISTINGS */
router.get("/:userId/properties", auth, authorizeUser("userId"), async (req, res) => {
  try {
    const { userId } = req.params
    const properties = await Listing.find({ creator: userId }).populate("creator")
    res.status(202).json(properties)
  } catch (err) {
    console.log(err)
    res.status(404).json({ message: "Can not find properties!", error: err.message })
  }
})

/* GET USER WISHLIST */
router.get("/:userId/wishlist", auth, authorizeUser("userId"), async (req, res) => {
  try {
    const { userId } = req.params
    const user = await User.findById(userId).populate({
      path: "wishList",
      populate: {
        path: "creator"
      }
    })
    res.status(202).json(user.wishList)
  } catch (err) {
    console.log(err)
    res.status(404).json({ message: "Can not find wishlist!", error: err.message })
  }
})

/* GET RESERVATION LIST */
router.get("/:userId/reservations", auth, authorizeUser("userId"), async (req, res) => {
  try {
    const { userId } = req.params
    // Get all listings created by this user, then get bookings for those listings
    const userListings = await Listing.find({ creator: userId })
    const listingIds = userListings.map(listing => listing._id)
    const reservations = await Booking.find({ listingId: { $in: listingIds } }).populate("userId listingId")
    res.status(202).json(reservations)
  } catch (err) {
    console.log(err)
    res.status(404).json({ message: "Can not find reservations!", error: err.message })
  }
})

/* GET USER PROFILE IMAGE */
router.get("/:userId/profile-image", async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.profileImage || !user.profileImage.data) {
      return res.status(404).json({ message: "Profile image not found" });
    }

    // Set the appropriate content type
    res.set('Content-Type', user.profileImage.contentType);
    res.send(user.profileImage.data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get profile image", error: err.message });
  }
});

module.exports = router
