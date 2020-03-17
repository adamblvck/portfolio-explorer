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
    subject: String,

    // can do ...
    action: String, // can [ read | edit | delete | allow | forbid | publish | takedown ]

    // to this
    object: String, // object id of [board, group, concept, user]
    // or with this
    type: String // can be [ board, group, concept ]

});

module.exports = mongoose.model('Permission', PermissionSchema);