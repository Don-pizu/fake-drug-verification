//controllers/profileImageController.js

const User = require('../models/User');
const cloudinary = require('../config/cloudinary');
const path = require('path');
const fs = require('fs');


exports.uploadImage = async (req, res) => {
    try {

      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      // File type check — allow only images
      const allowedExtensions = /\.(jpg|jpeg|png|gif)$/i;
      const ext = path.extname(req.file.originalname).toLowerCase();
      

      if (!allowedExtensions.test(ext)) {
        if (req.file && req.file.path && !req.file.path.startsWith('http')) {
        try {
          fs.unlinkSync(req.file.path);
        } catch (err) {
          console.warn("⚠️ Could not delete local temp file:", err.message);
        }
      } // delete invalid file
        return res.status(400).json({ message: 'Invalid file type. Only images are allowed.' });
      }

      // Upload file to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'fake-drug-verification',
        resource_type: 'image',
        transformation: [{ quality: 'auto', fetch_format: 'auto' }],
      });

      // Delete local file after upload
      if (req.file && req.file.path && !req.file.path.startsWith('http')) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (err) {
        console.warn("⚠️ Could not delete local temp file:", err.message);
      }
    }


      // Save Cloudinary URL to user record
      const user = await User.findById(req.user.id);
      if (!user) 
        return res.status(404).json({ message: 'User not found' });

      user.profileImage = result.secure_url;
      await user.save();

      res.json({
        message: 'File uploaded successfully',
        file: {
          url: result.secure_url,
          public_id: result.public_id,
          format: result.format,
          bytes: result.bytes,
          width: result.width,
          height: result.height,
        },
        user
      });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    res.status(500).json({ error: 'Failed to upload profile image', details: error.message});
  }
};
