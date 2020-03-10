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

		return new Promise((resolve, reject) => {
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
							concept_layouts = verify_layout_structures(concept_layouts, 'concept_layout');
							
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
										// resolve if we're at the end of the array
										if ( i == (groupIds.length-1) )
											resolve(savedConcept);
									}
								}
							);
						}
					});
				}
			});
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