const mongoose = require('mongoose');
const Grid = require('gridfs-stream');

let gfs;

// Initialize GridFS
const initGridFS = () => {
  gfs = Grid(mongoose.connection.db, mongoose.mongo);
  gfs.collection('uploads');
};

// Upload file to GridFS
const uploadToGridFS = (file) => {
  return new Promise((resolve, reject) => {
    const writeStream = gfs.createWriteStream({
      filename: file.originalname,
      metadata: {
        contentType: file.mimetype,
        size: file.size
      }
    });

    writeStream.on('error', (error) => {
      reject(error);
    });

    writeStream.on('close', (file) => {
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