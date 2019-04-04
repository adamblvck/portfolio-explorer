/*
  Author: Adam Blvck (adamblvck.com)
  Product: Blockchain Ecosystem Explorer
  Year: 2019
  Smartie.be
*/

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var BubbleSchema = new Schema({ 
    name: String,
    color: String,
    background: String,
    description: String
});

module.exports = mongoose.model('Bubble', BubbleSchema);