const { ApolloServer, gql } = require('apollo-server');
const { loadSchema } = require('@graphql-tools/load');
const { GraphQLFileLoader } = require('@graphql-tools/graphql-file-loader');
const { resolver: dateTimeResolver } = require('./resolvers/dateTimeResolver');
const { resolver: queryResolver } = require('./resolvers/queryResolver');
const merge =  require('lodash/merge');

// TODO:
// add a subquery to the command to get the workflow by operation
// add somehow possibility to ask for a Datetime format on query (ISO 8601 or epoch)
// add task and status
// replace running workflow by last workflow (running or next to run or last run)
// introduce json scalar type

const url = "http://localhost:7785/provisioner/";

loadSchema('./schemas/*.graphql', { 
    loaders: [
        new GraphQLFileLoader()
    ]
}).then( typeDefs => new ApolloServer({ typeDefs, resolvers: merge(dateTimeResolver, queryResolver), context: {url}}).listen()
).then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
});





