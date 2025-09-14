//controllers/profileImageController.js

const User = require('../models/User');
const path = require('path');


exports.uploadImage = async (req, res) => {
    try {

      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      // File type check — allow only images
      const allowedExtensions = /\.(jpg|jpeg|png|gif)$/i;
      const ext = path.extname(req.file.originalname).toLowerCase();
      const mime = req.file.mimetype.toLowerCase();

      if (!allowedExtensions.test(ext)) {
        return res.status(400).json({ message: 'Invalid file type. Only images are allowed.' });
      }

      // Save image path to the user
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.profileImage = `uploads/${req.file.filename}`;
        await user.save();


      res.json({
        message: 'File uploaded successfully',
        file: {
          originalname: req.file.originalname,
          filename: req.file.filename,
          path: req.file.path,
          size: req.file.size,
          mimetype: req.file.mimetype,
          profileImage: user.profileImage,
        },
      });
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload profile image'});
  }
};
