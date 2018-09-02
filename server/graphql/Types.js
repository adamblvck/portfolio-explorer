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
        color: { type: GraphQLString}
    })
});

const MetaInputType = new GraphQLInputObjectType({
    name: 'MetaInput',
    fields: () => ({
        color: { type: GraphQLString}
    })
});

const ConceptDetailType = new GraphQLObjectType({
    name: 'ConceptDetail',
    fields: () => ({
        title: { type: GraphQLString},
        summary: { type: GraphQLString},
        reference_links: { type: new GraphQLList(LinkType)}
    })
});

const ConceptDetailInputType = new GraphQLInputObjectType({
    name: 'ConceptDetailInput',
    fields: () => ({
        title: { type: GraphQLString},
        summary: { type: GraphQLString},
        reference_links: { type: new GraphQLList(LinkInputType)}
    })
});

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
        }
    })
});

const GroupType = new GraphQLObjectType({
    name: 'Group',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        sector: { type: GraphQLString },
        description: { type: GraphQLString },
        concepts: {
            type: new GraphQLList(ConceptType),
            resolve(parent, args){
                // return CONCEPTS where groupId=group.id (= parent)
                return Concept.find({groupId:parent.id});
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