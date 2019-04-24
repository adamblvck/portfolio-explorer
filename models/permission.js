/*
  Author: Adam Blvck (adamblvck.com)
  Product: Data Bubble
  Year: 2019
  Smartie.be
*/

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var PermissionSchema = new Schema({ 
    user: String, // user id

    create: [ {// create 
        object_id: String,
        type: String
    }],

    read: [ {
        object_id: String,
        type: String
    }],

    modify: [ {
        object_id: String,
        type: String
    }]
});

module.exports = mongoose.model('Permission', PermissionSchema);