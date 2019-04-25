/*
  Author: Adam Blvck (adamblvck.com)
  Product: Data Bubble
  Year: 2019
  Smartie.be
*/

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var UserSchema = new Schema({ 
    email: String,
    email_confirmed: Boolean,
    display_name: String,
    role: String // admin, contributor, bubbleadmin
    // bubbles: [Bubble] // Personal bubbles of this user
});

module.exports = mongoose.model('User', UserSchema);