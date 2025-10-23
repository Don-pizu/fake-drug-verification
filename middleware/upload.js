// middleware/upload.js
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

// Cloudinary Storage setup
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: 'fake-drug-verification', // folder name in Cloudinary
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'mp4', 'mov'],
      resource_type: 'auto', // handles both images and videos
      public_id: `${Date.now()}-${file.originalname.split('.')[0]}`, // unique ID
      transformation: [{ quality: 'auto', fetch_format: 'auto' }], // auto optimize
    };
  },
});

// Initialize multer with Cloudinary storage
const upload = multer({ storage });

module.exports = upload;




/*
// For local storage
const multer = require('multer');
const path = require('path');


// Set storage engine
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'uploads/');         //Save files to 'uploads' folder
	},

	filename: function (req, file, cb) {
		const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
		const ext = path.extname(file.originalname);
		cb(null, uniqueName + ext);                 // e.g., 1659988891234-123456789.jpg
	},
});


// File filter: only allow certain types
const fileFilter = (req, file, cb) => {
	const allowedTypes = /jpg|jpeg|png|gif|mp4|mov|avi|mkv/;

	const ext = path.extname(file.originalname).toLowerCase();
	const mime = file.mimetype.toLowerCase();

	if(allowedTypes.test(ext) && allowedTypes.test(mime)) {
		cb(null, true);
	} else {
		cb(new Error('Unsupported file type'), false);
	}
};


//Multer upload setup
const upload = multer({
	storage,
	limits: {
		fileSize: 200 * 1024 * 1024, // 20MB max 
	},
	fileFilter
});

module.exports = upload;

*/