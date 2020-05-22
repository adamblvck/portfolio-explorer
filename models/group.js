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
    description: String, // rename to `markdown`

    // if `markdown`, only description is considered
    // if `header_with_icons`, name and sub-query 'concepts' are considered (sub-query part of graphQL)
    display_option: String, // `header_with_icons` or `markdown`

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
    type: String,
    // if scope is private
    // - have user logged in
    // - check user permission for this object, 
    //    if permission found, the object is allowed to perform the action
    //    else abort action
});

module.exports = mongoose.model('Group', GroupSchema);