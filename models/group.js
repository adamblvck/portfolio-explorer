/*
  Author: Adam Blvck (adamblvck.com)
  Product: Blockchain Ecosystem Explorer
  Year: 2018
  Smartie.be
*/

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var GroupSchema = new Schema({ 
    name: String,
    sector: String,
    description: String,
    background: String,
    color: String,
    n_depth: { type: Number, min: 0, max: 3 }, // specifies group depth
    parent_groupId: String, // link to parent group
    bubble_id: String // link to upper bubble
});

module.exports = mongoose.model('Group', GroupSchema);