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
                description: { type: GraphQLString }
            },
            resolve(parent, args){
                let group = new Group({
                    name: args.name,
                    sector: args.sector,
                    description: args.description
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
                groupId: { type: GraphQLString } 
            },
            resolve(parent, args){
                let concept = new Concept({
                    name: args.name,
                    logo_url: args.logo_url,
                    meta: args.meta,
                    details: args.details,
                    groupId: args.groupId
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
                groupId: {type: GraphQLString}
            },
            resolve(parent, args){
                let mods = {}

                if (args.name) mods.name = args.name;
                if (args.logo_url) mods.logo_url = args.logo_url;
                if (args.meta) mods.meta = args.meta;
                if (args.details) mods.details = args.details;
                if (args.groupId) mods.groupId = args.groupId;

                return Concept.findByIdAndUpdate(
                    args.id,
                    { $set: mods},
                    { new: true }
                  )
                    .catch(err => new Error(err));
            }
        },
        updateGroup: {
            type: GroupType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID)},
                name: { type: GraphQLString},
                sector: { type: GraphQLString },
                description: { type: GraphQLString }
            },
            resolve(parent, args){
                let mod = {}
                if (args.name) mod.name = args.name;
                if (args.sector) mod.sector = args.sector;
                if (args.description) mod.description = args.description;

                return Group.findByIdAndUpdate(
                    args.id,
                    { $set: mod},
                    { new: true}
                )
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});

/*
add group query
mutation {
    addGroup(name:"Crypto", sector:"Finance", description:"Internet money") {
      name
      sector
      description
    }
}

{
  groups{
    name
    sector
    description
  }
}

add concept
mutation {
  addConcept(name:"IOTA",logo_url:"https://www.google.com",meta:{color:"#003d4d"},groupId:"5b898603fb1d5855aad156d2",details:{title:"mega title",summary:"#shortinterface", reference_links:[{name:"link1", url:"someurl"},{name:"link2", url:"someurl2"}]}){
    name
    logo_url
    meta {
      color
    }
    details {
      title
      summary
      reference_links {
        name
        url
      }
    }
  }
}

{
    concepts {
        name
            logo_url
            meta {
                color
            }
            details {
                title
                summary
                reference_links {
                    name
                    url
                }
            }
    }
}

query groups with concepts in them
{
  groups {
    id
    name
    sector
    concepts {
      name
      logo_url
      meta {
        color
      }
      details {
        title
        summary
        reference_links {
          name
          url
        }
      }
    }
  }
}

*/