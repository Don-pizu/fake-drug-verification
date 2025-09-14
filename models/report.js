//models/report.js

const mongoose = require('mongoose');

//Report Schema
const reportSchema = new mongoose.Schema({
	productName: {
		type:String,
		required: true,
	},
	location: {
		type: String,
		required: true
	},
	category:{
		type: String,
		required: true,
		enum: [ 'beverages', 'drugs', 'cosmetics', 'chemical', 'devices']
	},
	description: {
		type: String
	},
	nafdacReg: {
		type: String,
		required: true,
	},
	batchNo: {
		type: String
	},
	image: {
		type: String,
		default: '', //to store file path or url
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: false
	},
}, {timestamps: true} );

module.exports = mongoose.model('Report', reportSchema);