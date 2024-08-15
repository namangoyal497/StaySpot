const jwt = require("jsonwebtoken");
const User = require("../models/User");

const auth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header("Authorization")?.replace("Bearer ", "");
    
    if (!token) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from token
    const user = await User.findById(decoded.id).select("-password");
    
    if (!user) {
      return res.status(401).json({ message: "Token is not valid" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.log(err);
    res.status(401).json({ message: "Token is not valid" });
  }
};

// Middleware to check if user can access their own data or is admin
const authorizeUser = (paramName = "userId") => {
  return (req, res, next) => {
    const requestedUserId = req.params[paramName];
    
    // Check if user is accessing their own data
    if (req.user._id.toString() !== requestedUserId) {
      return res.status(403).json({ 
        message: "Access denied. You can only access your own data." 
      });
    }
    
    next();
  };
};

// Middleware to check if user owns the resource (for listings, bookings, etc.)
const authorizeResource = (model, paramName = "id") => {
  return async (req, res, next) => {
    try {
      const resourceId = req.params[paramName];
      const resource = await model.findById(resourceId);
      
      if (!resource) {
        return res.status(404).json({ message: "Resource not found" });
      }
      
      // Check if user owns the resource
      const ownerField = model === require("../models/Listing") ? "creator" : "userId";
      if (resource[ownerField].toString() !== req.user._id.toString()) {
        return res.status(403).json({ 
          message: "Access denied. You can only modify your own resources." 
        });
      }
      
      req.resource = resource;
      next();
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Server error" });
    }
  };
};

module.exports = { auth, authorizeUser, authorizeResource }; 