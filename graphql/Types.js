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
    GraphQLID
} = graphql;

// mongoose schemas
const Group = require('../models/group');
const Concept = require('../models/concept');

/* GraphQLObject hierarchy

    ConceptType
        MetaType
        ConceptDetailType
            LinkType

    GroupType
*/

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
        title: { type: GraphQLString},
        summary: { type: GraphQLString},
        short_copy: { type: GraphQLString},
        reference_links: { type: new GraphQLList(LinkType)},
        trade_off: { type: TradeOffType}
    })
});

const ConceptDetailInputType = new GraphQLInputObjectType({
    name: 'ConceptDetailInput',
    fields: () => ({
        title: { type: GraphQLString},
        summary: { type: GraphQLString},
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
        details: { type: ConceptDetailType },
        group: {
            type: GroupType,
            resolve(parent, args){
                // return Group with id=concept.id (= parent)
                return Group.findById(parent.groupId);
            }
        },
        groupId: { type: GraphQLID},
        groupIds: { type: new GraphQLList(GraphQLID)}
    })
});

const GroupType = new GraphQLObjectType({
    name: 'Group',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        sector: { type: GraphQLString },
        description: { type: GraphQLString },
        background: { type: GraphQLString },
        color: { type: GraphQLString },
        n_depth: { type: GraphQLInt },
        parent_groupId: { type: GraphQLID },
        concepts: {
            type: new GraphQLList(ConceptType),
            resolve(parent, args){
                // return CONCEPTS where groupId=group.id (= parent)
                //return Concept.find({groupId:parent.id});

                return Concept.find({groupIds: parent.id});
            }
        },
        groups: {
            type: new GraphQLList(GroupType),
            resolve(parent, args){
                // return subgroups where parent_groupId equal current id and n_depth is 1 deeper
                return Group.find({parent_groupId:parent.id, n_depth:parent.n_depth+1});
            }
        }
    })
});

module.exports = {
    GroupType,
    ConceptType,
    ConceptDetailType,
    ConceptDetailInputType,
    MetaInputType,
    MetaType,
    LinkType
};