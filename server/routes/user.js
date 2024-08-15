const router = require("express").Router()
const { auth, authorizeUser } = require("../middleware/auth")

const Booking = require("../models/Booking")
const User = require("../models/User")
const Listing = require("../models/Listing")

/* GET TRIP LIST */
router.get("/:userId/trips", auth, authorizeUser(), async (req, res) => {
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
router.patch("/:userId/:listingId", auth, authorizeUser(), async (req, res) => {
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
router.get("/:userId/properties", auth, authorizeUser(), async (req, res) => {
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
router.get("/:userId/wishlist", auth, authorizeUser(), async (req, res) => {
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
router.get("/:userId/reservations", auth, authorizeUser(), async (req, res) => {
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


module.exports = router
