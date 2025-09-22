// controllers/ awarenessController.js

const Awareness = require('../models/awareness');
const User = require('../models/User');


//POST    create an awareness
exports.createAwareness = async (req, res, next) => {
	try {

		const { title, description, category, type } = req.body;
		const user = req.user;

		if(!user)
			return res.status(401).json({ message: "Not authorized, user not found" });

		if(!title || !category || !type)
			return res.status(400).json({ message: 'Title, Category and Type are required'});

		const validCategory = ['beverages', 'drugs', 'cosmetics', 'chemical', 'devices'];
		const validType = ['awareness', 'approved', 'harmful', 'welcome', 'news', 'recalls'];

		if(!validCategory.includes(category))
			return res.status(400).json ({
				message: 'category must be one of the following : beverages, drugs, cosmetics, chemical or devices'
			});

		if(!validType.includes(type))
			return res.status(400).json({
				message: 'Type must be one of the following: awareness, approved, harmful, welcome, news or recalls'
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

		//crate awareness
		const createAwareness = await Awareness.create({
			title,
			description,
			category,
			type,
			image: imagePath,
			user: dbUser._id
		});

		res.status(201).json({
			message: 'Awareness record created successfully',
			createAwareness
		});

	} catch (err) {
		res.status(500).json({ message: err.message || 'Internal server error' });
	}
};


//GET  get all awareness
exports.allAwareness = async (req, res, next) => {
	try {

		const {page = 1, limit = 10, title} = req.query;
		const query = {};   //for filtering

	if (title) 
		query.title =  new RegExp(title, "i"); // case-insensitive search
  
		const skip = (parseInt(page) - 1) * parseInt(limit);

		const awareNess = await Awareness.find(query)
		 								.populate('user')
		 								.skip(skip)
		 								.limit(parseInt(limit))
		 								.sort({createdAt: -1});

		const totalAwareness = await Awareness.countDocuments(query);
		const totalPages = Math.ceil(totalAwareness / limit);

		res.json({
			awareNess,
			page: parseInt(page),
			totalPages,
			totalAwareness
		});

	} catch (err) {
		res.status(500).json({ message: err.message || 'Internal server error' });
	}
};


//GET get awareness by id
exports.getAwareness = async (req, res, next) => {
	try {

		const getAware = await Awareness.findById(req.params.id);

		if(!getAware)
			return res.status(404).json({ message: 'Awareness not found in report database'});

		res.json(getAware);

	} catch (err) {
		res.status(500).json({ message: err.message || 'Internal server error' });
	}
};


//UPDATE edit awarenes with id

exports.updateAwareness = async (req, res, next) => {
	try {
		const getAware = await Awareness.findById(req.params.id);

		if(!getAware)
			return res.status(404).json({ message: 'Awareness not found'});

		const { title, description, category, type } = req.body;

		if(title)
			getAware.title = title;
		if(description)
			getAware.description = description;
		if(category)
			getAware.category = category;
		if(type)
			getAware.type = type;

		// update image if new one is uploaded
	    if (req.file) {
	      getVeri.image = `/uploads/${req.file.filename}`;
	    }

		await getAware.save();

		res.status(200).json({
			message: 'Awareness record updated successfully',
			getAware
		});

	} catch (err) {
		res.status(500).json({ message: err.message || 'Internal server error' });
	}
};

//DELETE   Delete awareness
exports.deleteAwareness = async (req, res, next) =>{
	try {
		const getAware = await Awareness.findById(req.params.id);

		if(!getAware)
			return res.status(404).json({ message: 'Awareness not found'});

		//Delete awarenes using id
		await getAware.deleteOne();
		res.status(200).json({ message: 'Awareness is deleted successfully'});


	} catch (err) {
		res.status(500).json({ message: err.message || 'Internal server error' });
	}
}



// GET stats (total, recent, %)
exports.getAwarenessStats = async (req, res) => {
  try {
    const total = await Awareness.countDocuments();

    // recent = posts in last 30 days
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);

    const recent = await Awareness.countDocuments({
      createdAt: { $gte: last30Days }
    });

    const percentRecent = total > 0 ? ((recent / total) * 100).toFixed(1) : 0;

    res.json({
      total,
      recent,
      percentRecent
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
