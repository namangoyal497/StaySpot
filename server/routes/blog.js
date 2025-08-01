const express = require("express");
const Blog = require("../models/Blog");
const User = require("../models/User");
const multer = require("multer");
const path = require("path");
const { auth, authorizeUser } = require("../middleware/auth");


const router = express.Router();

// Multer configuration for memory storage
const upload = multer({ storage: multer.memoryStorage() });

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

    // Store images as Buffers
    const imageData = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        imageData.push({
          data: file.buffer,
          contentType: file.mimetype
        });
      }
    }
    const tagArray = tags ? tags.split(',').map(tag => tag.trim()) : [];

    const newBlog = new Blog({
      author: req.user._id,
      title,
      content,
      images: imageData,
      tags: tagArray,
      category: category || "travel",
      readTime: readTime || 5,
    });

    await newBlog.save();
    
    // Populate author info
    await newBlog.populate("author", "firstName lastName profileImage");
    
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
      .populate("author", "firstName lastName profileImage")
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
      .populate("author", "firstName lastName profileImage")
      .populate("comments.user", "firstName lastName profileImage");
    
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
      .populate("author", "firstName lastName profileImage")
      .sort({ createdAt: -1 });
    
    res.status(200).json(blogs);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Fail to get user's blog posts!", error: err.message });
  }
});

/* UPDATE BLOG IMAGES */
router.patch("/:id/images", auth, upload.array("blogImages"), async (req, res) => {
  try {
    const { id } = req.params;
    
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog post not found!" });
    }

    // Check if user is the author of the blog
    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only update your own blog posts" });
    }

    // Store new images as Buffers
    const newImageData = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        newImageData.push({
          data: file.buffer,
          contentType: file.mimetype
        });
      }
    }

    // Update blog with new images
    blog.images = newImageData;
    await blog.save();

    // Populate author info
    await blog.populate("author", "firstName lastName profileImage");

    res.status(200).json({ 
      message: "Blog images updated successfully", 
      blog: {
        _id: blog._id,
        title: blog.title,
        images: blog.images,
        author: blog.author
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to update blog images", error: err.message });
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
      const imageData = [];
      for (const file of req.files) {
        imageData.push({
          data: file.buffer,
          contentType: file.mimetype
        });
      }
      updateData.images = imageData;
    }
    
    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).populate("author", "firstName lastName profileImage");
    
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
    await blog.populate("comments.user", "firstName lastName profileImage");
    
    res.status(200).json(blog);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Fail to add comment!", error: err.message });
  }
});

/* GET BLOG IMAGE */
router.get("/:blogId/images/:imageIndex", async (req, res) => {
  try {
    const { blogId, imageIndex } = req.params;
    const blog = await Blog.findById(blogId);
    
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    if (!blog.images || !blog.images[imageIndex]) {
      return res.status(404).json({ message: "Image not found" });
    }

    const image = blog.images[imageIndex];
    
    // Set the appropriate content type
    res.set('Content-Type', image.contentType);
    res.send(image.data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get blog image", error: err.message });
  }
});

module.exports = router; 