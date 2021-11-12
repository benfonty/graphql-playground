const { ApolloServer } = require('apollo-server');
const { loadSchema } = require('@graphql-tools/load');
const { GraphQLFileLoader } = require('@graphql-tools/graphql-file-loader');
const { resolver: dateTimeResolver } = require('./resolvers/dateTimeResolver');
const { resolver: jsonResolver } = require('./resolvers/jsonResolver');
const { resolver: queryResolver } = require('./resolvers/queryResolver');
const merge =  require('lodash/merge');

// TODO:
// add somehow possibility to ask for a Datetime format on query (ISO 8601 or epoch)
// replace running workflow by last workflow (running or next to run or last run)

const url = "http://localhost:7785/provisioner/";

loadSchema('./schemas/*.graphql', { 
    loaders: [
        new GraphQLFileLoader()
    ]
}).then( typeDefs => new ApolloServer({ typeDefs, resolvers: merge(dateTimeResolver, jsonResolver, queryResolver), context: {url}}).listen()
).then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
});





