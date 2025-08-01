const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    images: [{
      data: Buffer,
      contentType: String
    }],
    tags: [{
      type: String,
      trim: true,
    }],
    category: {
      type: String,
      enum: ["travel", "review", "guide", "tips", "experience"],
      default: "travel",
    },
    likes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }],
    comments: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      content: {
        type: String,
        required: true,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    }],
    featured: {
      type: Boolean,
      default: false,
    },
    readTime: {
      type: Number,
      default: 5, // minutes
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blog", blogSchema); 