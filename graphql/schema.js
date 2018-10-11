/*
  Author: Adam Blvck (adamblvck.com)
  Product: Blockchain Ecosystem Explorer
  Year: 2018
  Smartie.be
*/

const graphql = require('graphql');

const {
    GraphQLObjectType,
    GraphQLInputObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLList,
    GraphQLInt,
    GraphQLID,
    GraphQLNonNull
} = graphql;

// mongoose schemas
const Group = require('../models/group');
const Concept = require('../models/concept');

// GraphQL Schemas
const { 
    ConceptType, 
    ConceptDetailType, 
    ConceptDetailInputType, 
    MetaInputType, 
    MetaType, 
    GroupType
} = require('./Types');


const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        group: {
            type: GroupType,
            args: { id: {type: GraphQLID}},
            resolve(parent, args){
                return Group.findById(args.id);
            }
        },
        root_groups: { // returns group with n_depth = 0 (these are root groups)
            type: new GraphQLList(GroupType),
            resolve(parent, args, context){
                return Group.find({n_depth:0});
            }
        },
        groups: {
            type: new GraphQLList(GroupType),
            resolve(parent, args){
                return Group.find();
            }
        },
        concept: {
            type: ConceptType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args){
                return Concept.findById(args.id);
            }
        },
        concepts: {
            type: new GraphQLList(ConceptType),
            resolve(parent, args){
                return Concept.find();
            }
        }
    }
})

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: { // store different kind of mutations we want to make
        addGroup: {
            type: GroupType,
            args: {
                name: { type: GraphQLString },
                sector: { type: GraphQLString },
                description: { type: GraphQLString },
                n_depth: { type: GraphQLInt},
                parent_groupId: { type: GraphQLID}
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

                // query resolve

                let group = new Group({
                    name: args.name,
                    sector: args.sector,
                    description: args.description,
                    n_depth: args.n_depth,
                    parent_groupId: args.parent_groupId,
                });

                return group.save();
            }
        },
        addConcept: {
            type: ConceptType,
            args: {
                name: { type: GraphQLString },
                logo_url: { type: GraphQLString },
                meta: { type: MetaInputType },
                details: { type: ConceptDetailInputType },
                groupId: { type: GraphQLString },
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
                    details: args.details,
                    groupId: args.groupId,
                    groupIds: [args.groupId]
                });

                return concept.save();
            }
        },
        updateConcept: {
            type: ConceptType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
                name: { type: GraphQLString },
                logo_url: { type: GraphQLString },
                meta: { type: MetaInputType },
                details: { type: ConceptDetailInputType },
                groupId: {type: GraphQLString},
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
                if (args.details)   mods.details = args.details;
                if (args.groupId)   mods.groupId = args.groupId;
                if (args.groupIds)  mods.groupIds = args.groupIds;

                return Concept.findByIdAndUpdate(
                    args.id,
                    { $set: mods},
                    { new: true }
                ).catch(err => new Error(err));
            }
        },
        updateGroup: {
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

                return Group.findByIdAndUpdate(
                    args.id,
                    { $set: mod},
                    { new: true}
                )
            }
        },
        deleteConcept:{
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
        },
        deleteGroup:{
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

                // query resolve
                return Group.findByIdAndRemove(
                    args.id
                );
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});
