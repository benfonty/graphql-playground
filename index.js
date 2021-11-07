const { ApolloServer, gql } = require('apollo-server');
const { GraphQLScalarType, Kind } = require('graphql');
const { loadSchema } = require('@graphql-tools/load');
const { GraphQLFileLoader } = require('@graphql-tools/graphql-file-loader');

// TODO:
// Get the def from external file
// connect Command to the real data
// search commands by the same parameters as the REST endpoint
// connect Workflow
// add a subquery to the command to get the workflow by operation
// add a runningWorkflow field to the command
// add somehow possibility to ask for a Datetime format on query (ISO 8601 or epoch)



loadSchema('./schema.graphql', { 
    loaders: [
        new GraphQLFileLoader()
    ]
}).then( typeDefs => {
    const checkStringCompatibleDateTime = (value) => {
        var date = new Date(Date.parse(value.replace("T", " ")));
        if (date === NaN) {
            throw new UserInputError("Provided value is not an IS8601 date");
        }
        return date.toISOString();
    };
    
    const dateTimeScalarResolver = new GraphQLScalarType({
        name: 'DateTime',
        description: 'DateTime custom scalar type',
        serialize(value) { // backend response => json value for query response
          return checkStringCompatibleDateTime(value); // the datetime is stored as a ISO 8601 string.
        },
        parseValue(value) { // as input in a var of the graphql query => backend representation
          return checkStringCompatibleDateTime(value); // the datetime is stored as a ISO 8601 string.
        },
        parseLiteral(ast) { // as input directly in the graphql query => backend representation
          if (ast.kind === Kind.STRING) {
            return checkStringCompatibleDateTime(ast.value); 
          }
          throw new UserInputError("Provided value is not an IS8601 date");
        },
      });
    
    const resolvers = {
        DateTime: dateTimeScalarResolver,
        Query: {
            commands: (obj, args, context, info) => {
                console.log(obj);
                console.log(args);
                console.log(context)
                //console.log(info);
                if (args.ownerId && args.ownerId === "titi") {
                    return [
                        {
                            ownerId: "toto",
                            id: "titi",
                            createdAt: new Date().toISOString()
                        }
                    ];
                } else {
                    return [];
                }
            }
        }
    };
    const server = new ApolloServer({ typeDefs, resolvers});

    return server.listen();
}).then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
});





