/*
  Author: Adam Blvck (adamblvck.com)
  Product: Data Board
  Year: 2019  Smartie.be
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
    _boardId: String, // mongoose id of board (GraphQLID)
    board_id: String, // url id to upper board

    group_layouts: [{
      name: String, // name of the layout
      layout: [[String]]
    }],
    
    concept_layouts: [{
      name: String, // name of the layout
      layout: [[String]]
    }],

    scope: String, // scope: ['public' or 'private']
    // if scope is private
    // - have user logged in
    // - check user permission for this object, 
    //    if permission found, the object is allowed to perform the action
    //    else abort action
});

module.exports = mongoose.model('Group', GroupSchema);