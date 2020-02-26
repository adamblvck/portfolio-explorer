/*
  Author: Adam Blvck (adamblvck.com)
  Product: Data Bubble
  Year: 2019
  Smartie.be
*/

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var BubbleSchema = new Schema({ 
  name: String,
  bubble_id: String,
  background: String,
  description: String,

  group_layouts: [{
    name: String, // name of the layout
    layout: [[String]]
  }],

  scope: String, // scope: ['public', 'private']
});

module.exports = mongoose.model('Bubble', BubbleSchema);