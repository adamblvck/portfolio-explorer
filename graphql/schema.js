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
    LayoutInputType,
    PermissionType
} = require('./Types');

// MUTATION RESOLVERS
const { addBoardResolver, updateBoardResolver, deleteBoardResolver, updateBoardLayoutResolver } = require('./board_resolvers');
const { addGroupResolver, updateGroupResolver, deleteGroupResolver, updateConceptLayoutResolver } = require('./group_resolvers');
const { addConceptResolver, updateConceptResolver, deleteConceptResolver } = require('./concept_resolvers');

const { addUserResolver, removeUserResolver } = require('./user_resolvers');

const { getUserObjects, checkPermission } = require ('./auth_resolvers');

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
            resolve(parent, args, {isAuthenticated, credentials}){

                let scope = args.scope == undefined ? 'public' : args.scope;

                if (!isAuthenticated) {
                    return Board.find({scope:"public"});
                } else {
                    // fetch boards that belong to current user

                    return new Promise((resolve, reject) => {

                        // fetch public ones
                        Board.find({scope:"public"})
                        .then( boards => {
                            
                            // fetch user's boards
                            getUserObjects(credentials, 'board')
                            .then( user_boards => {

                                // console.log(boards);
                                // console.log(user_boards);

                                // concatenate public boards with the user boards
                                resolve ( boards.concat(user_boards));
                            })
                            .catch(err => {
                                console.log(err);
                                reject(err);
                            })
                        })
                        .catch(err => {
                            console.log(err);
                            reject(err);
                        })
                    });
                    
                }
            }
        },

        board: { // get board from database
            type: BoardType,
            args: { id: {type: GraphQLID}, scope: {type: GraphQLString}},
            resolve(parent, args, {isAuthenticated, credentials}){
                // console.log("call!", args);

                switch (args.scope){
                    case "public":
                        return Board.findOne({board_id: args.id, scope: args.scope});

                    case "private":

                        // authentication check
                        if (!isAuthenticated) {
                            throw new Error('User needs to be authenticated to read a private board');
                        }
                
                        return new Promise((resolve, reject) => {

                            // gather which action is being asked for
                            checkPermission(credentials, 'admin', args.id).then( user => {
                                const { allowed } = user;
                                if ( !allowed == true ) reject( 'No permissions to read this group' );

                                Board.findById(args.id)
                                .then(board => {resolve(board)})
                                .catch(err=>reject(err));
                            });
                        });
                        // here we'll perform a security check
                        
                    default:
                        return Board.findOne({board_id: args.id, scope: 'public'});
                }
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
        },

        // return specific group
        permissions: {
            type: new GraphQLList(PermissionType),
            // args: { id: {type: GraphQLID}},
            resolve(parent, args){
                return Permission.find();
            }
        },
    }
})

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: { // store different kind of mutations we want to make

        // USER ADD/DELETE MUTATION
        addUser: addUserResolver,
        removeUser: removeUserResolver,

        // BOARD ADD/EDIT/DELETE MUTATION
        addBoard: addBoardResolver,
        updateBoard: updateBoardResolver,
        updateBoardLayout: updateBoardLayoutResolver,
        deleteBoard: deleteBoardResolver,

        // GROUP ADD/EDIT/DELETE MUTATION
        addGroup: addGroupResolver,
        updateGroup: updateGroupResolver,
        deleteGroup: deleteGroupResolver,
        updateConceptLayout: updateConceptLayoutResolver,

        // CONCEPT ADD/EDIT/DELETE MUTATION
        addConcept: addConceptResolver,
        updateConcept: updateConceptResolver,
        deleteConcept: deleteConceptResolver
        
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});
