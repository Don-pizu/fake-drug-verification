//models/awareness.js

const mongoose = require('mongoose');

//Awareness Schrma 
const awarenessSchema = new mongoose.Schema({
	title: {
		type:String,
		required: true,
	},
	description: {
		type: String
	},
	category:{
		type: String,
		required: true,
		enum: [ 'beverages', 'drugs', 'cosmetics', 'chemical', 'devices']
	},
	type:{
		type: String,
		required: true,
		enum: [ 'awareness', 'approved', 'harmful', 'welcome', 'news', 'recalls']
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

module.exports = mongoose.model('Awareness', awarenessSchema);