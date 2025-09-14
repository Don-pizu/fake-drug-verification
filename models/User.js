// models/User.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');  //For hashing password

//User schema
const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,                //it is needed
		unique: true,                  // must be unique for each users
		trim: true
	},
	email: {
		type: String,
		required: true,                //it is needed
		unique: true,                   // must be unique for each users
		trim: true
	},
	phoneNumber: {
		type: String,
		required:true,                 //it is needed
		unique: true,                  // must be unique for each users
		minlength: 11,                 
		maxLength: 11,
		validate: {
	    validator: function (v) {
		      return /^[0-9]{11}$/.test(v);  // only 11 digits allowed
		    },
		    message: "Phone number must be exactly 11 digits"
		  }
	},
	location: {
		type: String,
		required: true,                //it is needed
		trim: true,
	},
	password: {
		type: String,
		required: true,               //it is needed
		minlength: 6,                 // minimum of 6 letters
	},
	confirmPassword: {             // this field is just for validation, not stored
		type: String,
		//required: true,          //it is needed
		validate: {
	      validator: function (v) {         //to validate the fisrt password
	        return v === this.password;
	      },
	      message: "Passwords do not match"
	    }
	},
	role: { 
		type: String, 
		enum: ['user', 'admin'], 
		default: 'user' 
	},
	isVerified: { 
    type: Boolean, 
    default: false 
  },
	otp: {
    type: String 
   },
    otpExpires: { 
    type: Date 
  },
  profileImage: {
  	type: String,
  	default: '',   // will store file path or url
  },
  resetPasswordToken: { 
  	type: String 
  },   
  resetPasswordExpire: { 
  	type: Date 
  }, 
});


// Remove passwordConfirm before saving to DB
userSchema.pre("save", function (next) {
  this.confirmPassword = undefined;
  next();
});


//Password hashing before saving
userSchema.pre('save', async function (next) {
	if (!this.isModified('password'))
		return next();          /// If password is not change

	const salt = await bcrypt.genSalt(10);   //Generate salt

	this.password = await bcrypt.hash(this.password, salt);  //Hash password
	next();
});

// Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
	return await bcrypt.compare(enteredPassword, this.password);     //using bcrypt to compare passwords
};

module.exports = mongoose.model('User', userSchema);
