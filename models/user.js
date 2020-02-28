/*
  Author: Adam Blvck (adamblvck.com)
  Product: Data Board
  Year: 2019
  Smartie.be
*/

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var UserSchema = new Schema({ 
    email: String,
    email_verified: Boolean,
    username: String,
    role: String // admin, contributor, boardadmin
    // boards: [Boards] // Personal boards of this user
});

module.exports = mongoose.model('User', UserSchema);