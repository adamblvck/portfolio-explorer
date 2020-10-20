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
    GraphQLList,
    GraphQLInt,
    GraphQLID,
    GraphQLBoolean
} = graphql;

// mongoose schemas
const Group = require('../models/group');
const Concept = require('../models/concept');
const Board = require('../models/board');

const MetaType = new GraphQLObjectType({
    name: 'Meta',
    fields: () => ({
        color: { type: GraphQLString},
        symbol: { type: GraphQLString}
    })
});

const MetaInputType = new GraphQLInputObjectType({
    name: 'MetaInput',
    fields: () => ({
        color: { type: GraphQLString},
        symbol: { type: GraphQLString}
    })
});

const ConceptDetailType = new GraphQLObjectType({
    name: 'ConceptDetail',
    fields: () => ({
        summary: { type: GraphQLString},
        mindmap: { type: GraphQLString},
        short_copy: { type: GraphQLString},
        reference_links: { type: new GraphQLList(LinkType)},
        trade_off: { type: TradeOffType}
    })
});

const ConceptDetailInputType = new GraphQLInputObjectType({
    name: 'ConceptDetailInput',
    fields: () => ({
        summary: { type: GraphQLString},
        mindmap: { type: GraphQLString},
        short_copy: { type: GraphQLString},
        reference_links: { type: new GraphQLList(LinkInputType)},
        trade_off: { type: TradeOffInputType}
    })
});

const TradeOffType = new GraphQLObjectType({
    name: 'TradeOffType',
    fields: () => ({
        pros: { type: new GraphQLList(GraphQLString)},
        cons: { type: new GraphQLList(GraphQLString)},
    })
})

const TradeOffInputType = new GraphQLInputObjectType({
    name: 'TradeOffInputType',
    fields: () => ({
        pros: { type: new GraphQLList(GraphQLString)},
        cons: { type: new GraphQLList(GraphQLString)},
    })
})

const LinkType = new GraphQLObjectType({
    name: "Link",
    fields: () => ({
        name: { type: GraphQLString},
        url: { type: GraphQLString},
    })
});

const LinkInputType = new GraphQLInputObjectType({
    name: "LinkInput",
    fields: () => ({
        name: { type: GraphQLString},
        url: { type: GraphQLString},
    })
});

/* The Core */
const ConceptType = new GraphQLObjectType({
    name: 'Concept',
    fields: () => ({
        id: { type: GraphQLID},

        name : { type: GraphQLString },
        logo_url: { type: GraphQLString },
        meta : { type: MetaType},

        // WOOOOAAA
        markdown: { type: GraphQLString},

        // Concept details - to be replaced by markdown
        details: { type: ConceptDetailType },

        group: { type: GroupType,
            resolve(parent, args){
                // return Group with id=concept.id (= parent)
                return Group.findById(parent.groupIds[0]);
            }
        },

        scope: { type: GraphQLString},
        type: { type: GraphQLString},
        
        groupIds: { type: new GraphQLList(GraphQLID)}
    })
});

const LayoutInputType = new GraphQLInputObjectType({
    name: 'LayoutInput',
    fields: () => ({
        name: { type: GraphQLString },
        layout: { type: new GraphQLList(new GraphQLList(GraphQLString)) }
    })
});

const LayoutType = new GraphQLObjectType({
    name: 'Layout',
    fields: () => ({
        name: { type: GraphQLString },
        layout: { type: new GraphQLList(new GraphQLList(GraphQLString)) }
    })
});

const GroupLayout = new GraphQLObjectType({
    name: 'GroupLayout',
    fields: () => ({
        layouts: { type: new GraphQLList(LayoutType) },
        groups: {
            type: new GraphQLList(GroupType),
            resolve(parent, args){
                // return subgroups where parent_groupId equal current id and n_depth is 1 deeper
                return Group.find({parent_groupId: parent.id, n_depth: parent.n_depth+1});
            }
        }
    })
});

const GroupType = new GraphQLObjectType({
    name: 'Group',
    fields: () => ({
        // needed for ~GraphQL
        id: { type: GraphQLID },

        // Mongoose Scheme
        name: { type: GraphQLString },
        sector: { type: GraphQLString },
        description: { type: GraphQLString },
        display_option: { type: GraphQLString },
        background: { type: GraphQLString },
        color: { type: GraphQLString },
        n_depth: { type: GraphQLInt },
        parent_groupId: { type: GraphQLID },
        _boardId: { type: GraphQLID },
        board_id: { type: GraphQLID },

        // saved layouts for 1,2,3,4 (or even different columns)
        group_layouts: { type: new GraphQLList(LayoutType) }, // groups
        concept_layouts: { type: new GraphQLList(LayoutType) }, // concepts

        scope: { type: GraphQLString},

        // concepts belonging to this group
        concepts: {
            type: new GraphQLList(ConceptType),
            resolve(parent, args){
                // return CONCEPTS where groupId=group.id (= parent)
                //return Concept.find({groupId:parent.id});

                // Match where parent.id matches in the list of groupIds
                return Concept.find({groupIds: parent.id});
            }
        },

        // subgroups belonging to this group
        groups: {
            type: new GraphQLList(GroupType),
            resolve(parent, args){
                // return subgroups where parent_groupId equal current id and n_depth is 1 deeper
                return Group.find({parent_groupId: parent.id, n_depth: parent.n_depth+1});
            }
        },

        board: {
            type: BoardType,
            resolve(parent, args){
                // todo, board_id should be renamed to board_name, and the id of the board should become board_id
                return Board.findById(parent._boardId);
            }
        }, 

        parent_group: {
            type: BoardType,
            resolve(parent, args){
                // todo, board_id should be renamed to board_name, and the id of the board should become board_id
                return Group.findById(parent.parent_groupId);
            }
        }
    })
});

const BoardType = new GraphQLObjectType({
    name: 'Board',
    fields: () => ({
        // Graphql ID
        id: { type: GraphQLID },

        // Mongoose Schema
        name: { type: GraphQLString },
        board_id: { type: GraphQLString },
        background: { type: GraphQLString },
        description: { type: GraphQLString },

        // get layouts for below groups
        group_layouts: { type: new GraphQLList(LayoutType) },

        // Get "root groups" belonging to this board
        groups: {
            type: new GraphQLList(GroupType),
            resolve(parent, args){
                const p = {n_depth:0, _boardId:parent.id};
                console.log(p);
                return Group.find(p);
            }
        },

        icons: {
            type: new GraphQLList(GraphQLString),
            resolve(parent, args) {

                return new Promise((resolve, reject) => {
                    // arguments to find groups which have concept layouts beneath them (meaning they have icons).
                    const groups_with_concepts_args = {
                        n_depth:0,
                        board_id:parent.board_id,
                        // concept_layouts: { $exists: true, $not: {$size: 0} }
                    };

                    Group
                    .find(groups_with_concepts_args)
                    .then(groups_1 => {
                        let concept_icons = [];
                        groups_1.forEach(b => {
                            const group_1_id = b._id;
                            console.log(group_1_id);

                            // level 2 group search
                            return Group.find( {parent_groupId: group_1_id, concept_layouts: { $exists: true, $ne: []}} );
                        });
                    })
                    .then(groups_2 => {
                        groups_2.forEach(b2 => {
                            const group_2_id = b2._id;
                            console.log(group_2_id);

                            // Through all concepts in board_id
                            return Concept.find( {groupIds: group_2_id} ).then(cs =>{
                                
                                
                            });

                            resolve(concept_icons);
                        });
                    })
                    .then (css => {
                        // console.log(cs);
                        css.forEach(c => {
                            concept_icons.push(c.logo_url);
                        });
                    })
                    .catch(err => {
                        console.log(err);
                    });

                
                });
            }
        },

        scope: { type: GraphQLString}
    })
});

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        // Graphql ID
        id: { type: GraphQLID },

        // user insight
        email: { type: GraphQLString },
        email_verified: { type: GraphQLBoolean },
        username: { type: GraphQLString },
        role: { type: GraphQLString }
    })
});

const PermissionType = new GraphQLObjectType({
    name: 'Permission',
    fields: () => ({
        // Graphql ID
        id: { type: GraphQLID },

        // user insight
        subject: { type: GraphQLString },
        action: { type: GraphQLString },
        object: { type: GraphQLString },
        object_type: { type: GraphQLString },

    })
});

module.exports = {
    UserType,

    PermissionType,

    BoardType,
    GroupType,
    ConceptType,

    ConceptDetailType,
    ConceptDetailInputType,
    MetaInputType,
    MetaType,
    LinkType,
    
    LayoutType,
    LayoutInputType
};