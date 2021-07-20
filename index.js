/*
  Author: Adam Blvck (adamblvck.com)
  Product: Blockchain Ecosystem Explorer
  Year: 2018 - 2020
  Smartie.be
*/

const hapi = require('hapi');
const mongoose = require('mongoose');

const { graphqlHapi, graphiqlHapi } = require('apollo-server-hapi');
const schema = require('./graphql/schema');

const hapiJWTAuth = require('hapi-auth-jwt2');
const jwksRSA = require('jwks-rsa');

// load env file (containing credentials)
require('dotenv').config();

const host = process.env.DB_HOST;
const usr = process.env.DB_USER;
const pwd = process.env.DB_PASS;
const MONGO_URI = `mongodb+srv://${usr}:${pwd}@${host}/concept-db?retryWrites=true&w=majority`

const Path = require('path');

const server = hapi.server({
    port: process.env.PORT || 4000
});

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

mongoose.connect(MONGO_URI);

mongoose.connection.once('open', () => {
    console.log('connected to mlab database');
})

// bring your own validation function
const validateUser = function (decoded, request) {

    if (decoded && decoded.email) {
        return { isValid: true };
    }

    return { isValid: false };
};

const init = async() => {

    // register JWT authorization / verification for HAPI
    await server.register(hapiJWTAuth);

    server.auth.strategy('jwt', 'jwt', {
        complete: true,
        key: jwksRSA.hapiJwt2KeyAsync({
            cache: true,
            rateLimit: true,
            jwksRequestsPerMinute: 5,
            jwksUri: 'https://blockchainexplorer.eu.auth0.com/.well-known/jwks.json' 
        }),
        validate: validateUser,
        verifyOptions: {
            audience: 'nmwFAcrQ4iKBlNNqjNuoFjzJwDMlkkJK', // Auth0 application ID
            issuer: 'https://blockchainexplorer.eu.auth0.com/', // Auth0 authentication endpoint
            algorithms: ['RS256']
        },
    });

    server.auth.default('jwt');

    // register GraphiQL, points to /graphql
    await server.register({
        plugin: graphiqlHapi,
        options: {
            path: '/graphiql',
            header: {Authorization: "FvRkxz6HXjfD-d61-Iiiv5OA9Nllwmfn",
                    'content-type': 'application/json'},
            graphiqlOptions: {
                endpointURL: '/graphql'
            },
            route: { cors: true, auth: { mode: 'optional' }  }
        }
    });

    // register GraphQL
    await server.register({
        plugin: graphqlHapi,
        options: {
            path: '/graphql',
            graphqlOptions: async (request) => {
                return {
                    schema,
                    context: request.auth
                }
            },
            // optional means that the request should have either a valid 
            // Authentication header, or none at all
            route: { cors: true, auth: { mode: 'optional' } } // put on optional!
        },
    });

    // register static file serving (for REACT)
    await server.register(require('inert'));

    await server.route({
        method: 'GET',
        path: '/{path*}',
        handler: {
          directory: {
            path: Path.join(__dirname, 'app'),
            listing: false,
            index: true
          }
        },
        options: {
            auth: false
        }
    })

    server.ext('onPreResponse', (request, reply) => {
        let response = request.response;

        // if 404 - serve React app
        if (response.isBoom &&
            response.output.statusCode === 404) {
            return reply.file('./app/index.html');
        }

        return reply.continue;
    });

    error => {
        if (error) return next(error);
        server.log(['register', 'graphql', 'graphiql'], 'graphql plugins loaded successfully! 🎉');
        next();
      },

    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
}

init();