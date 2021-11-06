const { ApolloServer, gql } = require('apollo-server');

const typeDefs = gql`

  type Command {
    ownerId: String!
    id: String!
    createdAt: String!
    cancelled: Boolean
    payload: String
    workflows: [Workflow!]!
  }

  type Workflow {
    commandId: String!
    id: String!
    startedAt: String
    endedAt: String
  }

  type Query {
    commands(ownerId: String): [Command]!
  }
`;
// TODO:
// graphql extension to visual code
// Get the def from external file
// create a script that runs the curl, taking the graphql data from external file.
// connect Command to the real data
// search commands by the same parameters as the REST endpoint
// connect Workflow
// add a subquery to the command to get the workflow by operation
// add a runningWorkflow field to the command

const resolvers = {
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
                        createdAt: new Date()
                    }
                ];
            } else {
                return [];
            }
        }
    },
    Command: {
        createdAt:  (obj, args, context, info) => {
            console.log(obj);
            console.log(args);
            console.log(context)
            return obj.createdAt.toISOString();
        }
    }
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
});