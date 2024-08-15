const express = require("express");
const Blog = require("../models/Blog");
const User = require("../models/User");
const multer = require("multer");
const path = require("path");
const { auth, authorizeUser } = require("../middleware/auth");

const router = express.Router();

// Multer configuration for blog images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

/* CREATE BLOG POST */
router.post("/create", auth, upload.array("blogImages"), async (req, res) => {
  try {
    const { title, content, tags, category, readTime } = req.body;
    
    // Validate required fields
    if (!title || !content) {
      return res.status(400).json({ 
        message: "Missing required fields", 
        required: ["title", "content"] 
      });
    }

    const imagePaths = req.files ? req.files.map(file => file.path) : [];
    const tagArray = tags ? tags.split(',').map(tag => tag.trim()) : [];

    const newBlog = new Blog({
      author: req.user._id,
      title,
      content,
      images: imagePaths,
      tags: tagArray,
      category: category || "travel",
      readTime: readTime || 5,
    });

    await newBlog.save();
    
    // Populate author info
    await newBlog.populate("author", "firstName lastName profileImagePath");
    
    res.status(200).json(newBlog);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Fail to create blog post!", error: err.message });
  }
});

/* GET ALL BLOG POSTS */
router.get("/", async (req, res) => {
  try {
    const { category, search, sort = "newest" } = req.query;
    
    let query = {};
    
    // Filter by category
    if (category && category !== "all") {
      query.category = category;
    }
    
    // Search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } }
      ];
    }
    
    // Sort options
    let sortOption = {};
    switch (sort) {
      case "newest":
        sortOption = { createdAt: -1 };
        break;
      case "oldest":
        sortOption = { createdAt: 1 };
        break;
      case "popular":
        sortOption = { "likes.length": -1 };
        break;
      case "featured":
        query.featured = true;
        sortOption = { createdAt: -1 };
        break;
    }
    
    const blogs = await Blog.find(query)
      .populate("author", "firstName lastName profileImagePath")
      .sort(sortOption);
    
    res.status(200).json(blogs);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Fail to get blog posts!", error: err.message });
  }
});

/* GET SINGLE BLOG POST */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id)
      .populate("author", "firstName lastName profileImagePath")
      .populate("comments.user", "firstName lastName profileImagePath");
    
    if (!blog) {
      return res.status(404).json({ message: "Blog post not found!" });
    }
    
    res.status(200).json(blog);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Fail to get blog post!", error: err.message });
  }
});

/* GET USER'S BLOG POSTS */
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const blogs = await Blog.find({ author: userId })
      .populate("author", "firstName lastName profileImagePath")
      .sort({ createdAt: -1 });
    
    res.status(200).json(blogs);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Fail to get user's blog posts!", error: err.message });
  }
});

/* UPDATE BLOG POST */
router.put("/:id", upload.array("blogImages"), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, tags, category, readTime } = req.body;
    
    const updateData = {
      title,
      content,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      category,
      readTime,
    };
    
    // Handle new images if uploaded
    if (req.files && req.files.length > 0) {
      const imagePaths = req.files.map(file => file.path);
      updateData.images = imagePaths;
    }
    
    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).populate("author", "firstName lastName profileImagePath");
    
    if (!updatedBlog) {
      return res.status(404).json({ message: "Blog post not found!" });
    }
    
    res.status(200).json(updatedBlog);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Fail to update blog post!", error: err.message });
  }
});

/* DELETE BLOG POST */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBlog = await Blog.findByIdAndDelete(id);
    
    if (!deletedBlog) {
      return res.status(404).json({ message: "Blog post not found!" });
    }
    
    res.status(200).json({ message: "Blog post deleted successfully!" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Fail to delete blog post!", error: err.message });
  }
});

/* LIKE/UNLIKE BLOG POST */
router.patch("/:id/like", async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog post not found!" });
    }
    
    const likeIndex = blog.likes.indexOf(userId);
    
    if (likeIndex === -1) {
      // Like the post
      blog.likes.push(userId);
    } else {
      // Unlike the post
      blog.likes.splice(likeIndex, 1);
    }
    
    await blog.save();
    res.status(200).json(blog);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Fail to update like!", error: err.message });
  }
});

/* ADD COMMENT TO BLOG POST */
router.post("/:id/comment", async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, content } = req.body;
    
    if (!content) {
      return res.status(400).json({ message: "Comment content is required!" });
    }
    
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog post not found!" });
    }
    
    blog.comments.push({
      user: userId,
      content,
    });
    
    await blog.save();
    
    // Populate the new comment's user info
    await blog.populate("comments.user", "firstName lastName profileImagePath");
    
    res.status(200).json(blog);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Fail to add comment!", error: err.message });
  }
});

module.exports = router; 