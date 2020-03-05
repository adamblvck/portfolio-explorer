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

const addConceptResolver = {
	type: ConceptType,
	args: {
		name: { type: GraphQLString },
		logo_url: { type: GraphQLString },
		meta: { type: MetaInputType },
		markdown: { type: GraphQLString },
		details: { type: ConceptDetailInputType },
		groupIds: { type: new GraphQLList(GraphQLString)}
	},
	resolve(parent, args, {isAuthenticated, credentials}){
		// authentication check
		if (!isAuthenticated) {
			throw new Error('User needs to be authenticated to make changes to the database');
		}

		console.log("Logged in email:", credentials.payload.email);

		if (credentials.payload.email != 'eragon.blizzard@gmail.com'){
			throw new Error('User has no permissions to add concepts to the database');
		}

		// query resolve
		let concept = new Concept({
			name: args.name,
			logo_url: args.logo_url,
			meta: args.meta,
			markdown: args.markdown,
			details: args.details,
			groupIds: args.groupIds
		});

		return concept.save();
	}
};

const updateConceptResolver = {
	type: ConceptType,
	args: {
		id: { type: new GraphQLNonNull(GraphQLID) },
		name: { type: GraphQLString },
		logo_url: { type: GraphQLString },
		meta: { type: MetaInputType },
		markdown: { type: GraphQLString },
		details: { type: ConceptDetailInputType },
		groupIds: { type: new GraphQLList(GraphQLString)}
	},
	resolve(parent, args, {isAuthenticated, credentials}){
		// authentication check
		if (!isAuthenticated) {
			throw new Error('User needs to be authenticated to make changes to the database');
		}

		console.log("Logged in email:", credentials.payload.email);

		if (credentials.payload.email != 'eragon.blizzard@gmail.com'){
			throw new Error('User has no permissions to update concepts in the database');
		}

		// query resolve
		let mods = {}

		if (args.name)      mods.name = args.name;
		if (args.logo_url)  mods.logo_url = args.logo_url;
		if (args.meta)      mods.meta = args.meta;
		if (args.markdown)   mods.markdown = args.markdown;
		if (args.details)   mods.details = args.details;
		if (args.groupIds)  mods.groupIds = args.groupIds;

		return Concept.findByIdAndUpdate(
			args.id,
			{ $set: mods},
			{ new: true }
		).catch(err => new Error(err));
	}
};

const deleteConceptResolver = {
	type: ConceptType,
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
			throw new Error('User has no permissions to delete concepts from the database');
		}

		// query resolve
		return Concept.findByIdAndRemove(
			args.id
		);
	}
}

module.exports = {
	addConceptResolver,
	updateConceptResolver,
	deleteConceptResolver
};