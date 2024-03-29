/*
  Author: Adam Blvck (adamblvck.com)
  Product: Boards - A Blockchain Explorer
  Year: 2018-2020
  Valion.company
*/


const graphql = require('graphql');

// graphql components
const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLList, GraphQLInt, GraphQLID, GraphQLNonNull, GraphQLBoolean } = graphql;

// mongoose schemas
const Group = require('../models/group');
const Concept = require('../models/concept');
const Board = require('../models/board');
const User = require('../models/user');
const Permission = require('../models/permission');

// get the user id (as stored in database), given credential info
const getUser = (credentials) => {
	const { email } = credentials.payload;

	return new Promise((resolve, reject) => {
		User.find({email:email})
		.then((users) => {
			if (users.length >= 1){
				const user = users[0];
				user['allowed'] = true;
				resolve(user);
			}
			else
				resolve(undefined);
		})
		.catch((err)=>{
			console.log("Error when retrieving user id, error:", err);
			reject(undefined);
		})
	})
};

const getUserObjects = (credentials, object_type) => {
	return new Promise((resolve, reject) => {
		getUser(credentials)
		.then( user => {
			switch(object_type) {
				case 'board':
					Permission.find({subject: user._id, action:'admin', object_type:object_type})
					.then( permissions => {

						const object_ids = permissions.map( ({object}) => object);

						Board.find().where('_id').in(object_ids)
						.then( boards => {
							resolve(boards);
						})
						.catch( err => {
							console.log(err);
							reject(err);
						})

					})
					.catch( err => {
						console.log(err);
						reject(err)
					});

					break;
				default:
					break;
			}
		})
		.catch( err => {
			console.log(err);
			reject(err);
		})
	});
}

checkPermission_PublicReadAccess = (object) => {
	return new Promise((resolve, reject) => {
		Permission.find({subject: object, action: 'public', object: "*"})
		.then( permissions => {
			if ( permissions.length >= 1)
				resolve( {allowed:true} );
			else
				resolve( {allowed:false} );
		})
		.catch( err => {
			console.log(`Error when retrieving public rights for object ${object} with error ${err}`);
			reject(`Error when retrieving public rights for object ${object} with error ${err}`);
		});
	});
}

const checkPermission_AuthenticatedReadAccess = (credentials, object) => {
	return new Promise((resolve, reject) => {
		getUser(credentials)
		.then( user => {

			// console.log(user);
			if (user === undefined) reject("User not found");

			// console.log("Checking read permissions on the following parameters:");
			// console.log("\t"+`{subject: ${user._id}, action: 'admin', object: ${object}}`);
			// console.log("\t"+`{subject: ${object}, action: 'public', object: "*"}`);

			Permission.find({ $or: [ // one of both needs to hold
				{subject: user._id, action: 'admin', object: object}, // user can read action
				{subject: object, action: 'public', object: "*"} // 
			]})
			// Permission.find( {subject: user._id, action: action, object: object})
			.then( permissions => {
				if ( permissions.length >= 1)
					resolve( {...user._doc, allowed:true} );
				else
					resolve( {...user._doc, allowed:false} );
			})
			.catch( err => {
				console.log("Error when retrieving user permission for object", user_id, " with error:", err);
				reject(err);
			});

		})
		.catch(err => {
			console.log("Error when retrieving user id, error:", err);
			reject(err);
		});
	});
};

// see if login user (with credetials) is allowed to perform 'action' on 'object'
const checkPermission = (credentials, action, object) => {

	return new Promise((resolve, reject) => {
		getUser(credentials)
		.then( user => {

			// console.log(user);
			if (user === undefined) reject("User not found");

			console.log("retrieving the following permission:", {subject: user._id, action: action, object: object} );

			// check if document is gucci to get

			

			// Permission.find({ $or: [ // one of both needs to hold
			// 	{subject: user._id, action: action, object: object}, // user can perform action
			// 	{subject: object, action: 'read', object: "public"} // 
			// ]})
			Permission.find( {subject: user._id, action: action, object: object})
			.then( permissions => {
				if ( permissions.length >= 1)
					resolve( {...user._doc, allowed:true} );
				else
					resolve( {...user._doc, allowed:false} );
			})
			.catch( err => {
				console.log("Error when retrieving user permission for object", user_id, " with error:", err);
				reject(err);
			});

		})
		.catch(err => {
			console.log("Error when retrieving user id, error:", err);
			reject(err);
		});
	});
};

// gives admin access to a particular object
const giveAdminAccess = (user, object) => {

	console.log(user, object);

	// creates boards need in the object a type component, so that it can be filtered againsnt
	// after this complete the permission retrieval  on 'board', then find boards matching those retrieved ones

	return new Promise ( (resolve, reject) => {
		let permission = new Permission({
			subject: user._id,
			action: 'admin',
			object: object._id,
			object_type: object.type
		});

		permission.save().then(permission => resolve(permission)).catch(err => reject(err));
	});
}

module.exports = {
	getUser,
	checkPermission,
	checkPermission_AuthenticatedReadAccess,
	checkPermission_PublicReadAccess,
	giveAdminAccess,
	getUserObjects
};
