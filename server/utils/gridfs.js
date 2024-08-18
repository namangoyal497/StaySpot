const mongoose = require('mongoose');
const Grid = require('gridfs-stream');

let gfs;

// Initialize GridFS
const initGridFS = () => {
  try {
    gfs = Grid(mongoose.connection.db, mongoose.mongo);
    gfs.collection('uploads');
    console.log("GridFS initialized with collection 'uploads'");
  } catch (error) {
    console.error("Error initializing GridFS:", error);
    throw error;
  }
};

// Upload file to GridFS
const uploadToGridFS = (file) => {
  return new Promise((resolve, reject) => {
    if (!gfs) {
      reject(new Error('GridFS not initialized'));
      return;
    }

    const writeStream = gfs.createWriteStream({
      filename: file.originalname,
      metadata: {
        contentType: file.mimetype,
        size: file.size
      }
    });

    writeStream.on('error', (error) => {
      console.error('GridFS upload error:', error);
      reject(error);
    });

    writeStream.on('close', (file) => {
      console.log('File uploaded to GridFS:', file.filename);
      resolve(file);
    });

    writeStream.end(file.buffer);
  });
};

// Get file from GridFS by filename
const getFileByFilename = (filename) => {
  return gfs.files.findOne({ filename });
};

// Get file stream from GridFS by filename
const getFileStream = (filename) => {
  return gfs.createReadStream({ filename });
};

// Delete file from GridFS by filename
const deleteFile = (filename) => {
  return gfs.files.deleteOne({ filename });
};

module.exports = {
  initGridFS,
  uploadToGridFS,
  getFileByFilename,
  getFileStream,
  deleteFile
}; 