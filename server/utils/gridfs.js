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

    writeStream.on('error', reject);
    writeStream.on('close', (file) => {
      resolve(file._id);
    });

    writeStream.write(file.buffer);
    writeStream.end();
  });
};

// Get file from GridFS
const getFileFromGridFS = (fileId) => {
  return gfs.createReadStream({ _id: fileId });
};

// Delete file from GridFS
const deleteFromGridFS = (fileId) => {
  return gfs.delete({ _id: fileId });
};

module.exports = {
  initGridFS,
  uploadToGridFS,
  getFileFromGridFS,
  deleteFromGridFS,
  gfs
}; 