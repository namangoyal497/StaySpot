const mongoose = require('mongoose');
const { GridFSBucket } = require('mongodb');

let bucket;

// Initialize GridFS
const initGridFS = () => {
  try {
    if (!mongoose.connection.db) {
      console.error("MongoDB connection not established");
      throw new Error("MongoDB connection not established");
    }
    
    bucket = new GridFSBucket(mongoose.connection.db, {
      bucketName: 'uploads'
    });
    console.log("GridFS bucket initialized with collection 'uploads'");
    
    // Test the bucket
    console.log("Testing GridFS bucket...");
    const cursor = bucket.find({}).limit(1);
    cursor.toArray().then(files => {
      console.log("GridFS bucket test successful, found", files.length, "files");
    }).catch(err => {
      console.error("GridFS bucket test failed:", err);
    });
  } catch (error) {
    console.error("Error initializing GridFS:", error);
    throw error;
  }
};

// Upload file to GridFS
const uploadToGridFS = (file) => {
  return new Promise((resolve, reject) => {
    if (!bucket) {
      console.error('GridFS not initialized - bucket is null');
      reject(new Error('GridFS not initialized'));
      return;
    }

    if (!file || !file.buffer) {
      console.error('No file or file buffer provided');
      reject(new Error('No file or file buffer provided'));
      return;
    }

    console.log('Starting GridFS upload for file:', file.originalname);
    console.log('File buffer size:', file.buffer ? file.buffer.length : 'No buffer');

    try {
      const uploadStream = bucket.openUploadStream(file.originalname, {
        metadata: {
          contentType: file.mimetype,
          size: file.size
        }
      });

      uploadStream.on('error', (error) => {
        console.error('GridFS upload error:', error);
        reject(error);
      });

      uploadStream.on('finish', (file) => {
        console.log('File uploaded to GridFS:', file.filename);
        resolve(file);
      });

      uploadStream.end(file.buffer);
    } catch (error) {
      console.error('Error creating GridFS upload stream:', error);
      reject(error);
    }
  });
};

// Get file from GridFS by filename
const getFileByFilename = async (filename) => {
  try {
    const cursor = bucket.find({ filename });
    const files = await cursor.toArray();
    return files[0] || null;
  } catch (error) {
    console.error('Error finding file:', error);
    return null;
  }
};

// Get file stream from GridFS by filename
const getFileStream = (filename) => {
  return bucket.openDownloadStreamByName(filename);
};

// Delete file from GridFS by filename
const deleteFile = async (filename) => {
  try {
    const file = await getFileByFilename(filename);
    if (file) {
      await bucket.delete(file._id);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
};

module.exports = {
  initGridFS,
  uploadToGridFS,
  getFileByFilename,
  getFileStream,
  deleteFile
}; 