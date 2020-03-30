/*
  Author: Adam Blvck (adamblvck.com)
  Product: Data Board
  Year: 2020  Valion.company
*/

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var HolonSchema = new Schema({
	// id: String -- always stored as _id
	name: String,

	up_ids: [String],
	down_ids: [String],

	layout: [{
		name: String, // name of the layout
		layout: [[String]] 
	}],

	content: [{
		name: String,
		content: String
	}],



});

module.exports = mongoose.model('Holon', HolonSchema);