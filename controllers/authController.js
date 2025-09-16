// controllers/authController.js

const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { sendOtpEmail } = require('../util/emailService');



//Generate JWT Token
const createToken = (user) => {
	return jwt.sign (
		{id: user._id, role: user.role},
		process.env.JWT_SECRET,
		{expiresIn: '1h'}
		);
};



//Register a new user
exports.register = async (req, res, next) => {
	try {

		const { username, email, phoneNumber, location, password, confirmPassword, role } = req.body;

		if ( !username  || !email  || !phoneNumber || !location|| !password || !confirmPassword) 
			return res.status(400).json({ message: 'All the fields are required'});


		//Check if passwords match
		if (password !== confirmPassword) {
			return res.status(400).json({ message: 'Passwords do not match' });
		}

		//check if username already exists
		const userExists = await User.findOne({ username: username});
		if(userExists)
			return res.status(400).json({ message: "Username already exists"});

		const eExists = await User.findOne({ email: email });
		if(eExists)
			return res.status(400).json({message: 'Email already exists'});


		//check if phone number is more that 11
		if (phoneNumber.length !== 11 )
			return res.status(400).json({ message: "Phone number must be 11 digits"});

		//check if phone number exist
		const ePhone = await User.findOne({ phoneNumber: phoneNumber});
		if(ePhone)
			return res.status(400).json({ message: "Phone number already exists"});

		//chech for location
		if(!location)
			return res.status(400).json({ message: "Location is required"});

		// Generate 4-digit OTP
		const otp = Math.floor(1000 + Math.random() * 9000).toString();
		const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 min



		const user = await User.create({
			username,
			email,
			phoneNumber,
			location,
			password,
			role: role === 'admin' ? 'admin' : 'user',
			otp,
     		otpExpires
		});

		await sendOtpEmail(email, otp);

		res.status(201).json({ 
	      message: 'User registered. Verify OTP sent to email',
	      _id: user._id,
	      email: user.email
       });


	} catch (err) {
		res.status(500).json({ message: 'Internal server error' });
	}
};


exports.verifyOtp = async (req, res) => {
  try {
    const { username, otp } = req.body;
    const user = await User.findOne({ username });

    if (!user) 
      return res.status(400).json({ message: 'User not found' });

    if (user.otp !== otp)
      return res.status(400).json({ message: 'Invalid OTP' });

    if(user.otpExpires < Date.now()) 
      return res.status(400).json({ message: 'Expired OTP' });


    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;

    await user.save();

    res.json({ 
      message: 'Account verified successfully',
      _id: user._id,
      username: user.username,
      email: user.email,
      phoneNumber: user.phoneNumber,
      location: user.location,
      role: user.role,
      token: createToken(user)
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Resend OTP
exports.resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if(!email)
      return res.status(400).json({ message: 'Email is required'});

  	const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) 
      return res.status(400).json({ message: "User not found" });

    if (user.isVerified) 
      return res.status(400).json({ message: "Account already verified" });

    // Generate new OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000) // 10 min

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    await sendOtpEmail(user.email, otp);

    res.json({ 
      message: "New OTP sent to email",
      email: user.email
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


//Login user 
exports.login = async (req, res, next) => {
	try{

		const { username, password } = req.body;

		//check for username 
		const user = await User.findOne({ username: username });
		if(!user)
			return res.status(401).json({message: 'Username is not found'});

		if (!user.isVerified) 
		  return res.status(401).json({ message: "Please verify your account first" });

		const userPassword = await user.matchPassword(password);
		if(!userPassword)
			return res.status(401).json({message: 'Incorrect password'});

		if ( user && userPassword ) {
			res.json({
				_id: user._id,
				username: user.username,
				email: user.email,
				phoneNumber: user.phoneNumber,
				location: user.location,
				role:user.role,
				token: createToken(user)
			});
		} else {
			return res.status(401).json({ message: 'Invalid Credentials'});
		}

	}catch (err) {
		res.status(500).json({ message: 'Internal server error' });
	}
};

//GET   Get all users

exports.getAllUsers = async (req, res, next) => {
	try {

		const {page = 1, limit = 10, username} = req.query;
		const query = {};   //for filtering

	if (username) 
		query.username = username;

		const skip = (parseInt(page) - 1) * parseInt(limit);

		const users = await User.find(query)
		 								.skip(skip)
		 								.limit(parseInt(limit))
		 								.sort({createdAt: -1});

		const totalUsers = await User.countDocuments(query);
		const totalPages = Math.ceil(totalUsers / limit);

		res.json({
			users,
			page: parseInt(page),
			totalPages,
			totalUsers
		});

	} catch {
		res.status(500).json({ message: 'Internal server error' });
	}
};


// forgotPassword
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) 
    	return res.status(400).json({ message: "User not found" });

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;    // 15 min

    await user.save();

    // Build reset URL
    const resetUrl = `https://medcheck-website.netlify.app//api/auth/reset-password/${resetToken}`; ///////change to frontend link

    // send via email
    await sendOtpEmail(user.email, `Reset your password using this link: ${resetUrl}`);

    res.json({ message: "Password reset link sent to email" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// Reset password
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Hash the token from URL to compare with DB
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");


    console.log("Raw token:", token); // ✅ Debug
    console.log("Hashed token:", hashedToken);


    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() } 
    });

    if (!user) 
    	return res.status(400).json({ message: "Invalid or expired token" });

    // Update password
    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.json({ message: "Password reset successful. You can now login." });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// UPDATE USER (including image)
exports.updateUser = async (req, res) => {
  try {
    const userId = req.user.id; 
    const { username, email, phoneNumber, location } = req.body;

    const updateFields = { username, email, phoneNumber, location };

    // If an image is uploaded
    if (req.file) {
      updateFields.profileImage =  `/uploads/${req.file.filename}`; 
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "User updated successfully",
      user: {
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        phoneNumber: updatedUser.phoneNumber,
        location: updatedUser.location,
        profileImage: updatedUser.profileImage,
        role: updatedUser.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// GET USER PROFILE
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      phoneNumber: user.phoneNumber,
      location: user.location,
      profileImage: user.profileImage,
      role: user.role,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
