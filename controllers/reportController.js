// controllers/reportController.js

const Report = require('../models/report');
const User = require('../models/User');

//POST make a report

exports.createReport = async (req, res, next) => {

	try {
		const { productName, location, category, description, nafdacReg, batchNo} = req.body;
		const user = req.user;

		if(!user)
			return res.status(401).json({ message: "Not authorized, user not found" });

		const validCategories = ['beverages', 'drugs', 'cosmetics', 'chemical', 'devices'];

		if(!productName || !location || !category || !nafdacReg)
			return res.status(400).json({ message: 'Product name, Location, category and Nafdac Number are required'});

		 if(!validCategories.includes(category))
		 	return res.status(400).json({ 
		 		message: 'category must be one of the following : beverages, drugs, cosmetics, chemical or devices'
		 	});

		//fetch user data
		const dbUser = await User.findById(user._id);
		if (!dbUser) {
			return res.status(400).json({ message: 'User not found'});
		}

		//Handle image(if upload)
		let imagePath = '';
		if (req.file) {
			// save relative path (e.g /uploads/file.jpg)
			imagePath = `/uploads/${req.file.filename}`;
		}

		 // create report

		 const createReport	= await Report.create({
		 	productName,
		 	location,
		 	category,
		 	description,
		 	nafdacReg,
		 	batchNo,
		 	image: imagePath,
		 	user: dbUser._id
		 });

		 res.status(201).json({
		 	message: 'Report record created successfully',
		 	createReport
		 });

	} catch (err) {
		res.status(500).json({ message: err.message || 'Internal server error' });
	}
};


//GET all reports

exports.allReports = async (req, res, next) => {
	try {

		const {page = 1, limit = 10, productName, location, nafdacReg} = req.query;
		const query = {};   //for filtering

	if (productName) 
		query.productName = new RegExp(productName, "i");
    if (location) 
    	query.location = new RegExp(location, "i");
    if (nafdacReg) 
    	query.nafdacReg = nafdacReg;

		const skip = (parseInt(page) - 1) * parseInt(limit);

		const reports = await Report.find(query)
		 								.populate('user')
		 								.skip(skip)
		 								.limit(parseInt(limit))
		 								.sort({createdAt: -1});

		const totalReports = await Report.countDocuments(query);
		const totalPages = Math.ceil(totalReports / limit);

		res.json({
			reports,
			page: parseInt(page),
			totalPages,
			totalReports
		});

	} catch (err) {
		res.status(500).json({ message: err.message || 'Internal server error' });
	}
};


//GET get a report by nafdacReg
exports.getReport = async (req, res, next) => {
	try {

		const {nafdacReg} = req.params;

		const getReport = await Report.findOne({nafdacReg});

		if(!getReport)
			return res.status(404).json({ message: 'Nafdac Reg not found in report database'});

		res.json(getReport);

	} catch (err) {
		res.status(500).json({ message: err.message || 'Internal server error' });
	}
};


//UPDATE edit report with id

exports.updateReport = async (req, res, next) => {
	try {
		const getRepo = await Report.findById(req.params.id);

	if(!getRepo)
			return res.status(404).json({ message: 'Report not found'});

		const { productName, location, category, description, nafdacReg, batchNo } = req.body;

		if(productName)
			getRepo.productName = productName;
		if(location)
			getRepo.location = location;
		if(category)
			getRepo.category = category;
		if(description)
			getRepo.description = description;
		if(nafdacReg)
			getRepo.nafdacReg = nafdacReg;
		if(batchNo)
			getRepo.batchNo = batchNo;

		// update image if new one is uploaded
	    if (req.file) {
	      getVeri.image = `/uploads/${req.file.filename}`;
	    }

		await getRepo.save();

		res.status(200).json({
			message: 'Report record updated successfully',
			getRepo
		});

	} catch (err) {
		res.status(500).json({ message: err.message || 'Internal server error' });
	}
};

//DELETE   Delete report
exports.deleteReport = async (req, res, next) =>{
	try {
		const getRepo = await Report.findById(req.params.id);

		if(!getRepo)
			return res.status(404).json({ message: 'Report not found'});

		//Delete report using id
		await getRepo.deleteOne();
		res.status(200).json({ message: 'Report is deleted successfully'});


	} catch (err) {
		res.status(500).json({ message: err.message || 'Internal server error' });
	}
}

