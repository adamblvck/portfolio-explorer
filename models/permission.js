/*
  Author: Adam Blvck (adamblvck.com)
  Product: Data Board
  Year: 2019
  Smartie.be
*/

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var PermissionSchema = new Schema({ 
    // this user
    subject: String, // this user

    // can do ...
    action: String, // can [ read | edit | delete | allow | forbid | publish | takedown, admin]

    // to this id
    object: String, // object id of [board, group, concept, user
    object_type: String,
    
    depth: Number // depth of how 'deep' these rights go. 1=this object only (default), 0 is infinite depth (stopping at overview levels)
});

module.exports = mongoose.model('Permission', PermissionSchema);