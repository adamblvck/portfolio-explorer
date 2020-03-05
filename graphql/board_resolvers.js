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

const addBoardResolver = {
	type: BoardType,
	args: {
		name: { type: GraphQLString },
		board_id: { type: GraphQLString },
		background: { type: GraphQLString },
		description: { type: GraphQLString },
	},
	resolve(parent, args, {isAuthenticated, credentials}){
		// authentication check
		if (!isAuthenticated) {
			throw new Error('User needs to be authenticated to make changes to the database');
		}

		const email = credentials.payload.email;
		console.log("Logged in email:", email);

		// check if user is allowed to create new board
		if (email != 'eragon.blizzard@gmail.com'){
			throw new Error('User has no permissions to add groups to the database');
		}

		// create new board
		let board = new Board({
			name: args.name,
			board_id: args.board_id,
			background: args.background,
			description: args.description,
		});

		// save to DB
		return board.save();
	}
};

const updateBoardResolver = {
	type: BoardType,
	args: {
		id: { type: new GraphQLNonNull(GraphQLID)},
		name: { type: GraphQLString},
		board_id:  { type: GraphQLString },
		background:  { type: GraphQLString },
		description: { type: GraphQLString },
		group_layouts: {type: new GraphQLList(LayoutInputType)},
	},
	resolve(parent, args, {isAuthenticated, credentials}){
		// authentication check
		if (!isAuthenticated) {
			throw new Error('User needs to be authenticated to make changes to the database');
		}

		console.log("Logged in email:", credentials.payload.email);

		// check if user is allowed to update the database
		if (credentials.payload.email != 'eragon.blizzard@gmail.com'){
			throw new Error('User has no permissions to update groups in the database');
		}

		// query resolve
		let mod = {}
		if (args.name) mod.name = args.name;
		if (args.board_id) mod.board_id = args.board_id;
		if (args.background) mod.background = args.background;
		if (args.description) mod.description = args.description;
		if (args.group_layouts) mod.group_layouts = args.group_layouts;

		return Board.findByIdAndUpdate(
			args.id,
			{ $set: mod},
			{ new: true}
		);
	}
};

const deleteBoardResolver = {
	type: BoardType,
	args: {
		id: { type: new GraphQLNonNull(GraphQLID)}
	},
	resolve(parent, args, {isAuthenticated, credentials}){
		// authentication check
		if (!isAuthenticated) {
			throw new Error('User needs to be authenticated to make changes to the database');
		}

		console.log("Logged in email:", credentials.payload.email);

		// check if authorized to delete board
		if (credentials.payload.email != 'eragon.blizzard@gmail.com'){
			throw new Error('User has no permissions to delete groups from the database');
		}

		// query resolve
		return Board.findByIdAndRemove(
			args.id
		);
	}
};

module.exports = {
	addBoardResolver,
	updateBoardResolver,
	deleteBoardResolver
};