const express = require("express");
const router = express.Router();
const { getFileByFilename, getFileStream } = require("../utils/gridfs");

// Serve files from GridFS
router.get("/:filename", async (req, res) => {
  try {
    const { filename } = req.params;
    
    // Check if file exists
    const file = await getFileByFilename(filename);
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    // Set appropriate headers
    res.set({
      'Content-Type': file.metadata.contentType,
      'Content-Length': file.metadata.size,
    });

    // Create read stream and pipe to response
    const readStream = getFileStream(filename);
    readStream.pipe(res);
  } catch (error) {
    console.error("Error serving file:", error);
    res.status(500).json({ message: "Error serving file" });
  }
});

module.exports = router; 