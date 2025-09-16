//models/verify.js

const mongoose = require('mongoose');

//Verify Schema
const verifySchema = new mongoose.Schema({
	name: {
		type:String,
		required: true,
		unique: true,
	},
	nafdacReg: {
		type: String,
		required: true,
		unique: true,
	},
	category:{
		type: String,
		required: true,
		enum: [ 'beverages', 'drugs', 'cosmetics', 'chemical', 'devices']
	},
	expiry: {
		type: Date,
		required: true
	},
	authentic: {
		type: Boolean,
		required: true
	},
	image: {
		type: String,
		default: '', //to store file path or url
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	},
}, {timestamps: true} );

module.exports = mongoose.model('Verify', verifySchema);