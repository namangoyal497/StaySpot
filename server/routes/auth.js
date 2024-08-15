const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");

const User = require("../models/User");
const { uploadToGridFS } = require("../utils/gridfs");

/* Configuration Multer for Memory Storage */
const upload = multer({ storage: multer.memoryStorage() });

/* USER REGISTER */
router.post("/register", upload.single("profileImage"), async (req, res) => {
  try {
    /* Take all information from the form */
    const { firstName, lastName, email, password } = req.body;

    /* The uploaded file is available as req.file */
    const profileImage = req.file;

    /* Upload to GridFS if file exists */
    let profileImagePath = "";
    if (profileImage) {
      const uploadedFile = await uploadToGridFS(profileImage);
      profileImagePath = uploadedFile.filename;
    }

    /* Check if user exists */
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists!" });
    }

    /* Hash the password */
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    /* Create a new User */
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      profileImagePath,
    });

    /* Save the new User */
    await newUser.save();

    /* Send a successful message */
    res
      .status(200)
      .json({ message: "User registered successfully!", user: newUser });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "Registration failed!", error: err.message });
  }
});

/* USER LOGIN*/
router.post("/login", async (req, res) => {
  try {
    /* Take the information from the form */
    const { email, password } = req.body
    console.log("Login attempt for email:", email);

    /* Check if user exists */
    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found:", email);
      return res.status(409).json({ message: "User doesn't exist!" });
    }

    console.log("User found, checking password");

    /* Compare the password with the hashed password */
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      console.log("Password mismatch for user:", email);
      return res.status(400).json({ message: "Invalid Credentials!"})
    }

    console.log("Password match, generating token");

    /* Generate JWT token */
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
    delete user.password

    console.log("Login successful for user:", email);
    res.status(200).json({ token, user })

  } catch (err) {
    console.log("Login error:", err)
    res.status(500).json({ error: err.message })
  }
  
})


module.exports = router