const { ApolloServer, gql } = require('apollo-server');
const { loadSchema } = require('@graphql-tools/load');
const { GraphQLFileLoader } = require('@graphql-tools/graphql-file-loader');
const { resolver: dateTimeResolver } = require('./resolvers/dateTimeResolver');
const { resolver: queryResolver } = require('./resolvers/queryResolver');
const merge =  require('lodash/merge');

// TODO:
// Get the def from external file
// connect Command to the real data
// search commands by the same parameters as the REST endpoint
// connect Workflow
// add a subquery to the command to get the workflow by operation
// add a runningWorkflow field to the command
// add somehow possibility to ask for a Datetime format on query (ISO 8601 or epoch)



loadSchema('./schemas/*.graphql', { 
    loaders: [
        new GraphQLFileLoader()
    ]
}).then( typeDefs => new ApolloServer({ typeDefs, resolvers: merge(dateTimeResolver, queryResolver)}).listen()
).then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
});





