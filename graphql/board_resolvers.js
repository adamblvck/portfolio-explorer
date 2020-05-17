/*
  Author: Adam Blvck (adamblvck.com)
  Product: Boards - A Blockchain Explorer
  Year: 2018-2020
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
const Board = require('../models/board');
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

const { verify_layout_structures } = require('./layout_helpers');
const { checkPermission, giveAdminAccess } = require('./auth_resolvers');

const addBoardResolver = {
	type: BoardType,
	args: {
		name: { type: GraphQLString },
		board_id: { type: GraphQLString },
		background: { type: GraphQLString },
		description: { type: GraphQLString },
		scope: { type: GraphQLString }
	},
	resolve(parent, args, {isAuthenticated, credentials}) {
		// authentication check
		if (!isAuthenticated) {
			throw new Error('User needs to be authenticated to make changes to the database');
		}

		return new Promise( (resolve, reject) => {

			// gather which action is being asked for
			checkPermission(credentials, 'create', 'board').then( user => {
				const { allowed } = user;
				console.log(user);
				if (!allowed == true) throw new Error('No permissions to add boards');

				// set default layout structures for app
				const group_layouts = verify_layout_structures([], 'board_layout');

				let board = new Board({
					name: args.name,
					board_id: args.board_id,
					background: args.background,
					description: args.description,
					scope: 'private', // boards are always created privately first
					type: 'board',
					group_layouts: group_layouts
				});

				board.save()
				.then( board => {
					// create admin permissions to this object
					giveAdminAccess(user, board)
					.then(resolve(board));
				})
				.catch( err => {
					console.log(err);
					reject(err);
				});

			})
			.catch(err => {
				console.log(err);
				reject(err);
			});

		});
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

		return new Promise((resolve, reject) => {
			// gather which action is being asked for
			checkPermission(credentials, 'admin', args.id).then( user => {
				const { allowed } = user;
				
				if (!allowed == true) throw new Error('No permissions to edit boards');

				// query resolve
				let mod = {}
				if (args.name) mod.name = args.name;
				if (args.board_id) mod.board_id = args.board_id;
				if (args.background) mod.background = args.background;
				if (args.description) mod.description = args.description;
				if (args.group_layouts) mod.group_layouts = args.group_layouts;

				Board.findByIdAndUpdate(
					args.id,
					{ $set: mod},
					{ new: true}
				)
				.then(board => {resolve(board)});

			})
			.catch( err => {
				console.log(err);
				reject(err);
			});
		});
	}
};

const updateBoardScopeResolver = {
	type: BoardType,
	args: {
		id: { type: new GraphQLNonNull(GraphQLID)},
		scope: { type: new GraphQLNonNull(GraphQLString)}
	},
	resolve(parent, args, {isAuthenticated, credentials}){

		// authentication check
		if (!isAuthenticated) {
			throw new Error('User needs to be authenticated to make changes to the database');
			return;
		}

		return new Promise((resolve, reject) => {
			// check if is allowed to edit
			checkPermission(credentials, 'admin', args.id).then( user => {
				const { allowed } = user;
				
				if (!allowed == true){
					throw new Error('No permissions to update publish settings of this board');
				}

				// retrieve matching PUBLIC PERMISSION for this board
				Permission.find( {subject: args.id, action: 'public', object: '*'})
				.then( permissions => {

					console.log(permissions);

					// if we found a PUBLIC PERMISION & the new scope = public -> just return
					if ( permissions.length >= 1 && args.scope == 'public') {

						console.log(permissions, 'public');

						let mod = {scope: args.scope}; // update board
						Board.findByIdAndUpdate( args.id, { $set: mod}, { new: true})
						.then(board => {resolve(board)});
					// if we found a PUBLIC PERMISSION & the new scope = private -> delete permission and update board
					} else if (permissions.length >= 1 && args.scope == 'private') {

						console.log('remove permission & go private');

						Permission.findByIdAndRemove(permissions[0].id) // remove PUBLIC PERMISSION
						.then(p => {
							let mod = {scope: args.scope}; // update board
							Board.findByIdAndUpdate( args.id, { $set: mod}, { new: true})
							.then(board => {resolve(board)});
						})
						.catch(err => reject(err));

					// if we NOT FOUND a PUBLIC PERMISION & the new scope = public -> create permission and update board
					} else if (permissions.length < 1 && args.scope == 'public') {

						console.log("new permission to be created", 'public');

						let new_permission = new Permission({ subject: args.id, action: 'public', object: '*', object_type: 'user' });
						new_permission.save()
						.then(p => {
							let mod = {scope: args.scope}; // update board
							Board.findByIdAndUpdate( args.id, { $set: mod}, { new: true})
							.then(board => {resolve(board)});
						})
						.catch(err => reject(err));

					// if we NOT FOUND a PUBLIC PERMISION & the new scope = private -> just return the board
					} else if (permissions.length < 1 && args.scope == 'private') {

						console.log("no permission exists and it's good", 'private');

						let mod = {scope: args.scope}; // update board
						Board.findByIdAndUpdate( args.id, { $set: mod}, { new: true})
						.then(board => {resolve(board)});
					}
				})
				.catch( err => {
					console.log("Error when retrieving user permission for object", user_id, " with error:", err);
					reject(err);
				});

				// Permission.find( {subject: args.id, action: 'scope', object: '*'})
				// .then( permissions => {
				// 	if ( permissions.length >= 1)
				// 		resolve( {...user._doc, allowed:true} );
				// 	else
				// 		resolve( {...user._doc, allowed:false} );
				// })
				// .catch( err => {
				// 	console.log("Error when retrieving user permission for object", user_id, " with error:", err);
				// 	reject(err);
				// });


				// update board scope
				// let mod = {scope: args.scope};
				// Board.findByIdAndUpdate( args.id, { $set: mod}, { new: true})
				// .then(board => {resolve(board)});
			})
			.catch( err => {
				console.log(err);
				reject(err);
			});
		});
	}
};

const updateBoardLayoutResolver = {
	type: BoardType,
	args: {
		id: { type: new GraphQLNonNull(GraphQLID)},
		group_layouts: {type: new GraphQLList(LayoutInputType)},
	},
	resolve(parent, args, {isAuthenticated, credentials}){
		// authentication check
		if (!isAuthenticated) {
			throw new Error('User needs to be authenticated to make changes to the database');
		}

		return new Promise((resolve, reject) => {
			// gather which action is being asked for
			checkPermission(credentials, 'admin', args.id).then( user => {
				const { allowed } = user;
				
				if (!allowed == true) throw new Error('No permissions to modify boards');

				// find board to update
				Board.findById( args.id, function (err, board) {
					if (err){
						console.log("Got an error when finding board to update its layout");
						reject(err);
					} else {
						// 1. fix this shit
						const { _id, group_layouts } = board;
						let new_group_layouts = [...group_layouts];
	
						// 2. intermediately update the layouts which match by name
						for (let i=0; i<new_group_layouts.length; i++) {
							for (let j=0; j<args.group_layouts.length; j++){
								if (new_group_layouts[i].name == args.group_layouts[j].name) {
									new_group_layouts[i].layout = [...args.group_layouts[j].layout];
								}
							}
						}
	
						// 3. Update the board layouts
						const mod = { group_layouts: new_group_layouts };
						Board.findByIdAndUpdate( args.id, { $set: mod}, { new: true}, function(err2, updatedBoard) {
							if (err2) {
								console.log("Got an error when updating board layouts", err2);
								reject(err2);
							} else {
								console.log("Updated board", updatedBoard);
								resolve(updatedBoard);
							}
						});
	
					}
				});

			})
			.catch( err => {
				console.log(err);
				reject(err);
			});
		});
	}
}

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

		return new Promise((resolve, reject) => {
			// gather which action is being asked for
			checkPermission(credentials, 'admin', args.id).then( user => {
				const { allowed } = user;
				
				if (!allowed == true) throw new Error('No permissions to add boards');

				// query resolve
				Board.findByIdAndRemove(args.id)
				.then(board => {
					resolve(board);
				})
				.catch( err => {
					console.log(err);
					reject(err);
				});

			})
			.catch( err => {
				console.log(err);
				reject(err);
			});
		});
		
	}
};

module.exports = {
	addBoardResolver,
	updateBoardResolver,
	updateBoardScopeResolver,
	updateBoardLayoutResolver,
	deleteBoardResolver
};