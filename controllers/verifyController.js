// controllers/verifyController.js

const Verify = require('../models/verify');
const User = require('../models/User');


//POST Nafdac reg no

exports.createVerify = async (req, res, next) => {
	try {
		const { name, nafdacReg, expiry, authentic} = req.body;

		if(!name || !nafdacReg || !expiry || !authentic)
			return res.status(400).json({ message: 'All fields are required'});

		//validate nafdac reg
		if(!nafdacReg)
			return res.status(400).json({ message: 'Nafdac Reg is required'});

		//validate name
		if(!name)
			return res.status(400).json({ message: 'Name is required'});
		
		//check if name exists
		const eName = await Verify.findOne({ name: name });
		if(eName)
			return res.status(400).json({ message: 'Name already exist'});

		//check if nafdac reg exists
		const existsNafReg = await Verify.findOne({ nafdacReg: nafdacReg});
		if(existsNafReg)
			return res.status(400).json({ message: 'Nafdac Reg already exist'});


		//Handle image(if upload)
		let imagePath = '';
		if (req.file) {
			// save relative path (e.g /uploads/file.jpg)
			imagePath = `/uploads/${req.file.filename}`;
		}

		//create contents for verification
		const createVerify = await Verify.create({
			name,
			nafdacReg,
			expiry,
			authentic,
			image: imagePath,
			user: req.user._id 
		});


		res.status(201).json({
			message: 'Verification record created successfully',
			createVerify
		});

	} catch (err) {
		res.status(500).json({ message: err.message || 'Internal server error' });
	}
};

//GET verify nafdac Reg

exports.getByReg = async (req, res, next) => {
	try {
		const {nafdacReg} = req.params;

		const getReg = await Verify.findOne({nafdacReg});

		if(!getReg)
			return res.status(404).json({ message: 'Nafdac Reg not found'});

		res.json(getReg);

	} catch (err) {
		res.status(500).json({ message: 'Internal server error' });
	}
};

//GET get all verify datas
exports.getAll = async (req, res, next) => {
	try {
		const {page = 1, limit = 10, nafdacReg, authentic } = req.query;
		const query = {};   //for filtering

		if (nafdacReg) {
	      query.nafdacReg = nafdacReg; //  filtering
	    }

	    if (authentic) 
	    	query.authentic = authentic === "true"; // convert string to boolean

		const skip = (page - 1) * limit;

		const verifyAll = await Verify.find(query)
		 								.populate('user')
		 								.skip(skip)
		 								.limit(parseInt(limit))
		 								.sort({createdAt: -1});

		const totalVerify = await Verify.countDocuments(query);

		const totalPages = Math.ceil( totalVerify / limit);

		res.json({
			verifyAll,
			Page: parseInt(page),
			totalPages,
			totalVerify
		});
 

	} catch (err) {
		res.status(500).json({ message: err.message || 'Internal server error' });
	}
};

//GET verify nafdac Reg with id

exports.getById = async (req, res, next) => {
	try {
		const getReg = await Verify.findById(req.params.id);

		if(!getReg)
			return res.status(404).json({ message: 'Nafdac reg not found'});

		res.json(getReg);

	} catch (err) {
		res.status(500).json({ message: 'Internal server error' });
	}
};



//PUT  Update nafdac Reg with id
exports.updateReg = async (req, res, next) => {
	try {
		const getVeri = await Verify.findById(req.params.id);

		if(!getVeri)
			return res.status(404).json({ message: 'Nafdac reg not found'});

		const { name, nafdacReg, expiry, authentic} = req.body;

		//if (!name || !nafdacReg || !expiry || !authentic)
			//return res.status(400).json({ message: 'All fields are required for update'});

		if(name)
			getVeri.name = name;
		if(nafdacReg)
			getVeri.nafdacReg = nafdacReg;
		if(expiry)
			getVeri.expiry = expiry;
		if(authentic)
			getVeri.authentic = authentic;

		// update image if new one is uploaded
	    if (req.file) {
	      getVeri.image = `/uploads/${req.file.filename}`;
	    }

		await getVeri.save();

		res.status(200).json({
			message: 'Verification record updated successfully',
			getVeri
		});

	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};  


//DELETE  Delete Nafdac Reg id
exports.deleteReg = async (req, res, next) => {
	try {

		const getVeri = await Verify.findById(req.params.id);

		if(!getVeri)
			return res.status(404).json({ message: 'Nafdac reg not found'});

		//Delete naf reg
		await getVeri.deleteOne();
		res.status(200).json({ message: 'Nafdac Reg contents are deleted successfully'});

	} catch (err) {
		res.status(500).json({ message: err.message});
	}
};