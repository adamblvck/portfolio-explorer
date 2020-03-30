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
const Permission = require('../models/permission');

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

const addUserResolver = {
	type: UserType,
	args: {
		username: { type: new GraphQLNonNull(GraphQLString)},
	},
	async resolve(parent, args, {isAuthenticated, credentials}){
		// authentication check
		if (!isAuthenticated) {
			throw new Error('User needs to be authenticated to make changes to the database');
		}

		// extract information
		const { email, email_verified} = credentials.payload;
		console.log("Logged in email:", email);

		// check if user already has matching user account (based on credentials)
		const user = await User.findOne({email: email});

		// if we found a user, return that one
		if (user !== null)
			return user;

		// if we didn't find a user, create a new one
		else{

			// Here we create a user

			// Create new user
			let user = new User({
				email: email,
				email_verified: email_verified,
				username: args.username,
				role: "user"
			});

			// save to DB, and create required permissions to the game
			return new Promise((resolve,reject) => {
				user.save()
				.then((user) => {
					let permission_board = new Permission({
						subject: user._id,
						action: 'create',
						object: 'board'
					});
					permission_board.save();

					return user;
				}).then((user)=>{
					let permission_group = new Permission({
						subject: user._id,
						action: 'create',
						object: 'group'
					});
					permission_group.save();

					return user;
				}).then((user)=>{
					let permission_concept = new Permission({
						subject: user._id,
						action: 'create',
						object: 'concept'
					});
					permission_concept.save();

					resolve(user);
				})
				.catch((err) => {
					console.log(err);
					reject(err);
				});
			}) 
		}

	}
};

const removeUserResolver = {
	type: UserType,
	args: {
		id: { type: new GraphQLNonNull(GraphQLID)}
	},
	resolve(parent, args, {isAuthenticated, credentials}){
		// authentication check
		if (!isAuthenticated) {
			throw new Error('User needs to be authenticated to make changes to the database');
		}

		console.log("Logged in email:", credentials.payload.email);

		// check if logged in user is owner of account (look-up)
		if (credentials.payload.email != 'eragon.blizzard@gmail.com'){
			throw new Error('User has no permissions to delete groups from the database');
		}

		// query resolve
		return User.findByIdAndRemove(
			args.id
		);
	}
};

module.exports = {
	addUserResolver,
	removeUserResolver
};