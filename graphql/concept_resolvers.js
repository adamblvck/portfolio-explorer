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

const { verify_layout_structures, add_id_to_layouts, verify_holon_layout_structures } = require('./layout_helpers');
const { checkPermission, giveAdminAccess } = require('./auth_resolvers');

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
	resolve(parent, args, {isAuthenticated, credentials}) {
		// authentication check
		if (!isAuthenticated) {
			throw new Error('User needs to be authenticated to make changes to the database');
		}

		// query resolve
		let concept = new Concept({
			name: args.name,
			logo_url: args.logo_url,
			meta: args.meta,
			markdown: args.markdown,
			details: args.details,
			groupIds: args.groupIds,

			scope: 'private',
			type: 'concept'
		});

		return new Promise((resolve, reject) => {

			// check if allowed
			// AUTH RULES
			// admin action to ... 
			target = args.groupIds[0]; // add to parent groups (layout and link)
			action = 'admin';

			// gather which action is being asked for
			checkPermission(credentials, action, target).then( user => {
				const { allowed } = user;
				if ( !allowed == true ) throw new Error( 'No permissions to add boards' );

				// then save the concept
				concept.save().then(function(savedConcept){

					const { groupIds } = savedConcept;

					// for every group this concept is in, add the concept to the layout
					for (let i=0; i< groupIds.length;i++){
						const groupId = groupIds[i];

						// Currently we only putting Concepts into subgroups.
						// Thus... Fetch the Group this concept points to, and add the id to the CONCEPT LAYOUT
						Group.findById(groupId, function (err, group) {
							if (err) {
								console.log(err);
								reject(err);
							} else {

								// 1. Get existing layout
								const _new_concept_id = savedConcept._id.toHexString() + '';
								let concept_layouts = [ ...group.concept_layouts ];

								// this steps create an empty layout to be added (TODO: this step can add prev not-added layouts too)
								verify_holon_layout_structures(group, concept_layouts, 'concept_layout')
								.then(concept_layouts => {
							
									// 2. Add concept to every present layout
									concept_layouts = add_id_to_layouts(concept_layouts, _new_concept_id);

									// 3. Save new layout for this particular group (groupId)
									let mod = { 'concept_layouts': concept_layouts }

									Group.findByIdAndUpdate(
										groupId,
										{ $set: mod},
										{ new: true}, function(err, results){
											if (err) {
												console.log("Error when updating group layout after adding new group", err);
												reject(err);
											} else {

												console.log("savedcConcept", savedConcept, "updatedGroup", results.concept_layouts[0].layout);

												// giveAdminAccess(user, savedConcept)
												// .then(resolve(savedConcept))
												// .catch(err => reject(err));
												
												// resolve if we're at the end of the array
												if ( i == (groupIds.length-1) ){
													console.log("giving admin access");
													giveAdminAccess(user, savedConcept)
													.then(resolve(savedConcept))
													.catch(err => reject(err));
												}
											}
										}
									);

								});
							}
						});
					}
				}); // end of save concept
			}); // end authenticated scope

		});
		
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

		return new Promise((resolve, reject) => {

			// check if allowed
			// AUTH RULES
			// admin action to ... 
			action = 'admin';
			target = args.id; // edit concept

			// gather which action is being asked for
			checkPermission(credentials, action, target).then( user => {
				const { allowed } = user;
				if ( !allowed == true ) reject('No permissions to update concept');

				// query resolve
				let mods = {}

				if (args.name)      mods.name = args.name;
				if (args.logo_url)  mods.logo_url = args.logo_url;
				if (args.meta)      mods.meta = args.meta;
				if (args.markdown)   mods.markdown = args.markdown;
				if (args.details)   mods.details = args.details;
				if (args.groupIds)  mods.groupIds = args.groupIds;

				Concept.findByIdAndUpdate( args.id, {$set:mods}, {new:true})
				.then(concept => resolve(concept))
				.catch( err => {console.log(err); reject(err)});

			});
		});

		
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

		// console.log("Logged in email:", credentials.payload.email);

		return new Promise((resolve, reject) => {

			// check if allowed
			// AUTH RULES
			// admin action to ... 
			action = 'admin';
			target = args.id; // edit concept

			// gather which action is being asked for
			checkPermission(credentials, action, target).then( user => { // authenticated scope
				const { allowed } = user;
				if ( !allowed == true ) throw new Error( 'No permissions to delete concept' );

				return Concept.findByIdAndRemove(args.id).then(removedConcept => {
					// if ( err ){
					// 	console.log("Error when finding concept and removing by ID", err);
					// 	reject(err);
					// } else {

						console.log(args.id, removedConcept);

						const groupIds = removedConcept.groupIds;

						// iterate through all 'attached' groupIds
						for(let i=0; i< groupIds.length; i++) {
							const groupId = groupIds[i];

							Group.findById(groupId, function(err, group){
								if (err) {
									console.log("Error when finding group to update it's layout after removing concept", err);
									reject(err);
								} else {
									// 1. make a copy of the layouts
									let concept_layouts = [ ...group.concept_layouts];

									// 2. from EVERY LAYOUT in this BOARD
									for(let j = 0; j<concept_layouts.length;j++){
										let concept_layout = concept_layouts[j];
										
										// filter out any instance of "_groupId" (args.id)
										for (let x = 0; x<concept_layout.layout.length; x++){
											// remove new_col from every column
											let new_col = concept_layout.layout[x].filter(item => item !== args.id);
											concept_layout.layout[x] = new_col;
										}

										// re-assign group_layout to group_layouts[j];
										concept_layouts[j] = concept_layout;
									}

									// 3. push new layout to board
									let mod = { 'concept_layouts': concept_layouts }

									Group.findByIdAndUpdate(groupId, { $set: mod}, { new: true}, function(err, results){
										if (err) {
											console.log("Error when updating concept_layout in parent group, after removing a concept", args.id, err);
											reject(err);
										} else {
											if (i == (groupIds.length-1))
												resolve(removedConcept);
										}
									});

								}
							});

						}
					// }
				})
				.catch( err => {
					console.log(err)
					reject(err);
				});; // end of concept delete
			}); // end of authenticated scope
		});
	}
}

module.exports = {
	addConceptResolver,
	updateConceptResolver,
	deleteConceptResolver
};
