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

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        // return user info currently logged in (contained in credentials param)
        user: {
            type: UserType,
            args: {},
            resolve(parent, args, {isAuthenticated, credentials}){
                
                // authentication check
                if (!isAuthenticated) {
                    throw new Error('User needs to be authenticated to make changes to the database');
                }

                // get out the mail information
                const { email } = credentials.payload;

                console.log("wow dude", email);

                //return User.find({email: email});
                return User.findOne({email:email});
            }
        },

        // check if a user exists
        usernameavailable: {
            type: GraphQLBoolean,
            args: { username: { type: new GraphQLNonNull(GraphQLString)}},
            async resolve(parent, args, {isAuthenticated, credentials}){
                // authentication check
                if (!isAuthenticated) {
                    throw new Error('User needs to be authenticated to make changes to the database');
                }

                const user = await User.findOne({username: args.username});

                // if we didn't find a user, we return true (available!)
                if (user === null)
                    return true;
                else
                    return false;
            }
        },

        // return specific group
        group: {
            type: GroupType,
            args: { id: {type: GraphQLID}},
            resolve(parent, args){
                return Group.findById(args.id);
            }
        },

        // returns root-level groups ( with n_depth = 0 )
        root_groups: { 
            type: new GraphQLList(GroupType),
            resolve(parent, args, context){
                return Group.find({n_depth:0});
            }
        },

        boards: { // all boards in the database
            type: new GraphQLList(BoardType),
            resolve(parent, args){
                return Board.find();
            }
        },

        board: { // get board from database
            type: BoardType,
            args: { board_id: {type: GraphQLString} },
            resolve(parent, args){
                console.log(args.board_id);
                return Board.findOne({board_id: args.board_id});
            }
        },

        // return root-level groups belonging 
        board_groups: {
            type: new GraphQLList(GroupType),
            args: { board_id: {type: GraphQLID} },
            resolve(parent, args){
                // return where n_depth=0 and board_id matches the one in arg
                return Group.find({n_depth:0, board_id:args.board_id});
            }
        },

        // return all groups
        groups: {
            type: new GraphQLList(GroupType),
            resolve(parent, args){
                return Group.find();
            }
        },

        // return specific concept
        concept: {
            type: ConceptType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args){
                return Concept.findById(args.id);
            }
        },

        // return all concepts
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

        // add new user
        addUser: {
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
                    // create new user
                    let user = new User({
                        email: email,
                        email_verified: email_verified,
                        username: args.username,
                        role: "user"
                    });

                    // save to DB
                    return user.save();
                }

            }
        },
        
        removeUser: {
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
        },

        // add new board
        addBoard: {
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
        },

        // add a new group
        addGroup: {
            type: GroupType,
            args: {
                name: { type: GraphQLString },
                description: { type: GraphQLString },
                n_depth: { type: GraphQLInt},
                parent_groupId: { type: GraphQLID},
                board_id: { type: GraphQLID},
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
                    color: args.color,
                    background: args.background
                });

                // save to DB
                return group.save();
            }
        },

        // add a new concept
        addConcept: {
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
        },

        updateBoard: {
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
        },
    
        // update group information
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
                board_id: { type: GraphQLID },
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
                if (args.group_layouts) mod.group_layouts = args.group_layouts;
                if (args.concept_layouts) mod.concept_layouts = args.concept_layouts;

                console.log(mod);

                return Group.findByIdAndUpdate(
                    args.id,
                    { $set: mod },
                    { new: true }
                );

                // return Group.findOneAndUpdate(
                //     { id: args.id},
                //     { $set: mod },
                //     { new: true }
                // );
            }
        },

        // update a concept
        updateConcept: {
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
        },

        // delete a concept
        deleteConcept: {
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

        // delete a group
        deleteGroup: {
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
        },

        deleteBoard: {
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
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});
