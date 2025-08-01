const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/auth.js")
const listingRoutes = require("./routes/listing.js")
const bookingRoutes = require("./routes/booking.js")
const userRoutes = require("./routes/user.js")
const blogRoutes = require("./routes/blog.js")
const filesRoutes = require("./routes/files.js")
const { initGridFS } = require("./utils/gridfs.js")

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// Production: Serve static files from the React app build
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
}

/* ROUTES */
app.use("/auth", authRoutes)
app.use("/properties", listingRoutes)
app.use("/bookings", bookingRoutes)
app.use("/users", userRoutes)
app.use("/blog", blogRoutes)
app.use("/files", filesRoutes)

// Production: Handle React routing
if (process.env.NODE_ENV === "production") {
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build", "index.html"));
  });
}

/* MONGOOSE SETUP */
const PORT = process.env.PORT;
const dirname = path.resolve();
mongoose
  .connect(process.env.MONGO_URL, {
    dbName: "StaySpot",
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected successfully");
    // Initialize GridFS after MongoDB connection
    try {
      initGridFS();
      console.log("GridFS initialized successfully");
    } catch (error) {
      console.error("Error initializing GridFS:", error);
      console.error("GridFS initialization failed, but continuing...");
    }
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
  })
  .catch((err) => console.log(`MongoDB connection failed: ${err}`));

  