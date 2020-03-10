/*
  Author: Adam Blvck (adamblvck.com)
  Product: Blockchain Ecosystem Explorer
  Year: 2018-2019
  Smartie.be
*/

const graphql = require('graphql');

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLList,
    GraphQLInt,
    GraphQLID,
    GraphQLNonNull,
    GraphQLBoolean
} = graphql;

// mongoose schemas
const Group = require('../models/group');
const Concept = require('../models/concept');
const Board = require('../models/board');
const User = require('../models/user');

// GraphQL Schemas
const {
    UserType,
    ConceptType, 
    ConceptDetailType, 
    ConceptDetailInputType, 
    MetaInputType, 
    MetaType, 
    GroupType,
    BoardType,
    LayoutType,
    LayoutInputType
} = require('./Types');

const { verify_layout_structures, add_id_to_layouts } = require('./layout_helpers');

const addGroupResolver = {
	type: GroupType,
	args: {
		name: { type: GraphQLString },
		description: { type: GraphQLString },
		n_depth: { type: GraphQLInt},
		parent_groupId: { type: GraphQLID},
		board_id: { type: GraphQLID},
		_boardId: { type: GraphQLID},
		color: {type: GraphQLString},
		background: {type: GraphQLString}
	},
	resolve(parent, args, {isAuthenticated, credentials}){
		// authentication check
		if (!isAuthenticated) {
			throw new Error('User needs to be authenticated to make changes to the database');
		}

		console.log("Logged in email:", credentials.payload.email);

		if (credentials.payload.email != 'eragon.blizzard@gmail.com'){
			throw new Error('User has no permissions to add groups to the database');
		}

		// create new group
		let group = new Group({
			name: args.name,
			description: args.description,
			n_depth: args.n_depth,
			parent_groupId: args.parent_groupId,
			board_id: args.board_id,
			_boardId: args._boardId,
			color: args.color,
			background: args.background
		});

		// Return new promise which will save new group, and add that gruop to the layouts, one tier up higher...

		return new Promise((resolve, reject) => {
			group.save().then(function (savedGroup) {
				// 1. get list of layouts of board in Board group
				// executes, name LIKE john and only selecting the "name" and "friends" fields

				// IF BOARD as PARENT
				if (args.parent_groupId === null && args._boardId  !== null) 
					Board.findById(args._boardId, function (err, board) {
						if (err) {
							console.log(err);
							reject(err);
						} else {
							console.log("board", board);
							// A: go through each board with board_id (should be only one)
							// 1. get group_layouts attached to _board_id

							const _board_id = board._id;
							const _new_group_id = savedGroup._id.toHexString() + '';
							let group_layouts = [ ...board.group_layouts ];

							group_layouts = verify_layout_structures(group_layouts, 'board_layout');

							// 2. add _new_group_id to every layout
							for(let j = 0; j<group_layouts.length;j++){
								let group_layout = group_layouts[j];

								// !!!! Add to first list, assumes 2D List
								if (group_layout.layout.length >= 1) {
									let a = group_layout.layout[0];
									let b = a.concat([_new_group_id]); // here we add, pushing gives weird behavior
									group_layout.layout[0] = b;
								}
								group_layouts[j] = group_layout;
							}

							// 3. push new layout to board
							let mod = { 'group_layouts': group_layouts }

							return Board.findByIdAndUpdate(
								_board_id,
								{ $set: mod},
								{ new: true}, function(err, results){
									if (err) {
										console.log("Error when updating board layout after adding new group", err);
										reject(err);
									} else {
										resolve(savedGroup);
									}
								}
							);

						} // if we have no issues finding a correct board;
					});

				// if GROUP as PARENT
				else if (args.parent_groupId !== null) { // if we have a group that belongs to a group
					Group.findById(args.parent_groupId, function (err, group) {
						if (err) {
							console.log(err);
							reject(err);
						} else {
							console.log("group", group);

							// 1. get group_layouts attached to _board_id
							const _group_id_of_layout = group._id;
							const _added_group_id = savedGroup._id.toHexString() + '';

							let group_layouts = [ ...group.group_layouts ];
							group_layouts = verify_layout_structures(group_layouts, 'group_layout'); // group level layout check

							// 2. add _added_group_id to every layout
							for(let j = 0; j<group_layouts.length;j++){
								let group_layout = group_layouts[j];

								// !!!! Add to first list, assumes 2D List
								if (group_layout.layout.length >= 1) {
									let a = group_layout.layout[0];
									let b = a.concat([_added_group_id]); // here we add, pushing gives weird behavior
									group_layout.layout[0] = b;
								}
								group_layouts[j] = group_layout;
							}

							// 3. push new layout to board
							let mod = { 'group_layouts': group_layouts }

							return Group.findByIdAndUpdate(
								_group_id_of_layout,
								{ $set: mod},
								{ new: true}, function(err, results){
									if (err) {
										console.log("Error when updating group layout after adding new group", err);
										reject(err);
									} else {
										resolve(savedGroup);
									}
								}
							);

						} // if we have no issues finding a correct board;
					});
				}
				
			}); // end of group save

		}); // end of returned promise
	}
};

const updateGroupResolver = {
	type: GroupType,
	args: {
		id: { type: new GraphQLNonNull(GraphQLID)},
		name: { type: GraphQLString},
		sector: { type: GraphQLString },
		color:  { type: GraphQLString },
		background:  { type: GraphQLString },
		description: { type: GraphQLString },
		n_depth: { type: GraphQLInt },
		parent_groupId: { type: GraphQLID },
		board_id: { type: GraphQLID },
		_boardId: { type: GraphQLID },
		group_layouts: {type: new GraphQLList(LayoutInputType)},
		concept_layouts: {type: new GraphQLList(LayoutInputType)}
	},
	resolve(parent, args, {isAuthenticated, credentials}){
		// authentication check
		if (!isAuthenticated) {
			throw new Error('User needs to be authenticated to make changes to the database');
		}

		console.log("Logged in email:", credentials.payload.email);

		if (credentials.payload.email != 'eragon.blizzard@gmail.com'){
			throw new Error('User has no permissions to update groups in the database');
		}

		// query resolve
		let mod = {}
		if (args.name) mod.name = args.name;
		if (args.sector) mod.sector = args.sector;
		if (args.color) mod.color = args.color;
		if (args.background) mod.background = args.background;
		if (args.description) mod.description = args.description;
		if (args.n_depth) mod.n_depth = args.n_depth;
		if (args.parent_groupId) mod.parent_groupId = args.parent_groupId;
		if (args.board_id) mod.board_id = args.board_id;
		if (args._boardId) mod._boardId = args._boardId;
		if (args.group_layouts) mod.group_layouts = args.group_layouts;
		if (args.concept_layouts) mod.concept_layouts = args.concept_layouts;

		console.log(mod);

		return Group.findByIdAndUpdate(
			args.id,
			{ $set: mod },
			{ new: true }
		);
	}
};

const deleteGroupResolver = {
	type: GroupType,
	args: {
		id: { type: new GraphQLNonNull(GraphQLID)}
	},
	resolve(parent, args, {isAuthenticated, credentials}){
		// authentication check
		if (!isAuthenticated) {
			throw new Error('User needs to be authenticated to make changes to the database');
		}

		console.log("Logged in email:", credentials.payload.email);

		if (credentials.payload.email != 'eragon.blizzard@gmail.com'){
			throw new Error('User has no permissions to delete groups from the database');
		}

		// Query resolve
		// a) Delete group
		// b) Delete groupid from all layouts in the board (or group) it belongs to
		return new Promise((resolve, reject) => {
			return Group.findByIdAndRemove(args.id, function(err, deletedGroup){
				if (err){
					console.log("Error when deleting group by id", args.id, ":", err);
					reject(err);
				} else {
					console.log("deletedGroup", deletedGroup);

					const _deletedId = deletedGroup._id;
					const _boardId = deletedGroup._boardId;
					const _parentGroupId = deletedGroup.parent_groupId;

					// If we have a _boardId, we have a board "parent", thus change the layout of board
					if ( _parentGroupId === null && _boardId !== null && _boardId !== undefined )
						Board.findById(_boardId, function (err, board) {
							if (err) {
								console.log("Error when finding board by id", _boardId, ":", err);
								reject(err);
							} else {
								let group_layouts = [ ...board.group_layouts];

								// 2. from EVERY LAYOUT in this BOARD
								for(let j = 0; j<group_layouts.length;j++){
									let group_layout = group_layouts[j];

									// filter out any instance of "_groupId" (args.id)
									for (let x = 0; x<group_layout.layout.length; x++){
										// remove new_col from every column
										let new_col = group_layout.layout[x].filter(item => item !== args.id);
										group_layout.layout[x] = new_col;
									}

									// re-assign group_layout to group_layouts[j];
									group_layouts[j] = group_layout;
								}

								// 3. push new layout to board
								let mod = { 'group_layouts': group_layouts }

								return Board.findByIdAndUpdate(_boardId, { $set: mod}, { new: true}, function(err, results){
									if (err) {
										console.log("Error when updating layout in board after REMOVING group", args.id, err);
										reject(err);
									} else {
										console.log("deletedGroup", deletedGroup, "results", results);
										resolve(deletedGroup);
									}
								});

							}
						});
					else if (_parentGroupId !== null) {
						Group.findById(_parentGroupId, function (err, group) {
							if (err) {
								console.log("Error when finding board by id", _parentGroupId, ":", err);
								reject(err);
							} else {
								let group_layouts = [ ...group.group_layouts];
								group_layouts = verify_layout_structures(group_layouts, 'group_layout'); // group level layout check
								
								console.log("group_layouts", group_layouts);

								// 2. from EVERY LAYOUT in this GROUP
								for(let j = 0; j<group_layouts.length;j++){
									let group_layout = group_layouts[j];

									// filter out any instance of "_groupId" (args.id)
									for (let x = 0; x<group_layout.layout.length; x++){
										// remove args.id from every column
										let new_col = group_layout.layout[x].filter(item => item !== args.id);
										group_layout.layout[x] = new_col;
									}

									// re-assign group_layout to group_layouts[j];
									group_layouts[j] = group_layout;
								}

								console.log("group_layouts", group_layouts);

								// 3. push new layout to group
								let mod = { 'group_layouts': group_layouts }

								return Group.findByIdAndUpdate(_parentGroupId, { $set: mod}, { new: true}, function(err, results){
									if (err) {
										console.log("Error when updating layout in group after REMOVING group", args.id, err);
										reject(err);
									} else {
										console.log("deletedGroup", deletedGroup, "results", results);
										resolve(deletedGroup);
									}
								});

							}
						});
					}
				}
			});
		});
	}
};

module.exports = {
	addGroupResolver,
	updateGroupResolver,
	deleteGroupResolver
};