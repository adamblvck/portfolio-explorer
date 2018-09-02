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
    description: String
});

module.exports = mongoose.model('Group', GroupSchema);