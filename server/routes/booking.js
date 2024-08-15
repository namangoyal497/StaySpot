const router = require("express").Router()
const { auth, authorizeUser, authorizeResource } = require("../middleware/auth")

const Booking = require("../models/Booking")

/* CREATE BOOKING */
router.post("/create", auth, async (req, res) => {
  try {
    const { listingId, checkIn, checkOut, totalPrice, guestCount } = req.body
    
    // Validate required fields
    if (!listingId || !checkIn || !checkOut || !totalPrice || !guestCount) {
      return res.status(400).json({ 
        message: "Missing required fields", 
        required: ["listingId", "checkIn", "checkOut", "totalPrice", "guestCount"] 
      })
    }

    const newBooking = new Booking({ 
      userId: req.user._id, 
      listingId, 
      checkIn: new Date(checkIn), 
      checkOut: new Date(checkOut), 
      totalPrice, 
      guestCount 
    })
    
    await newBooking.save()
    res.status(200).json(newBooking)
  } catch (err) {
    console.log(err)
    res.status(400).json({ message: "Fail to create a new Booking!", error: err.message })
  }
})

/* GET USER BOOKINGS */
router.get("/user/:userId", auth, authorizeUser(), async (req, res) => {
  try {
    const { userId } = req.params
    const bookings = await Booking.find({ userId }).populate("listingId")
    res.status(200).json(bookings)
  } catch (err) {
    console.log(err)
    res.status(400).json({ message: "Fail to get user bookings!", error: err.message })
  }
})

/* GET LISTING BOOKINGS */
router.get("/listing/:listingId", async (req, res) => {
  try {
    const { listingId } = req.params
    const bookings = await Booking.find({ listingId }).populate("userId")
    res.status(200).json(bookings)
  } catch (err) {
    console.log(err)
    res.status(400).json({ message: "Fail to get listing bookings!", error: err.message })
  }
})

/* UPDATE BOOKING STATUS */
router.patch("/:bookingId", auth, authorizeResource(Booking, "bookingId"), async (req, res) => {
  try {
    const { bookingId } = req.params
    const { status } = req.body
    
    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      { status },
      { new: true }
    )
    
    res.status(200).json(updatedBooking)
  } catch (err) {
    console.log(err)
    res.status(400).json({ message: "Fail to update booking!", error: err.message })
  }
})

/* DELETE BOOKING */
router.delete("/:bookingId", auth, authorizeResource(Booking, "bookingId"), async (req, res) => {
  try {
    const { bookingId } = req.params
    await Booking.findByIdAndDelete(bookingId)
    res.status(200).json({ message: "Booking deleted successfully!" })
  } catch (err) {
    console.log(err)
    res.status(400).json({ message: "Fail to delete booking!", error: err.message })
  }
})

module.exports = router