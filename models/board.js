/*
  Author: Adam Blvck (adamblvck.com)
  Product: Data Board
  Year: 2020
  Valion.company
*/

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var BoardSchema = new Schema({ 
  name: String,
  board_id: String,
  background: String,
  description: String,

  group_layouts: [{
    name: String, // name of the layout
    layout: [[String]]
  }],

  scope: String, // scope: ['public', 'private']
});

module.exports = mongoose.model('Board', BoardSchema);