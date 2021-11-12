const { UserInputError } = require('apollo-server');
const { GraphQLScalarType, Kind } = require('graphql');

const checkJson = (value) => {
  try {
    return new Date(Date.parse(value.replace("T", " "))).toISOString();
  }
  catch(error) { 
    throw new UserInputError("Provided value is not an IS8601 date");
  }
};

const jsonScalarResolver = new GraphQLScalarType({
    name: 'Json',
    description: 'Json custom scalar type',
    serialize(value) { // backend response => json value for query response
      return value; // the datetime is stored as a ISO 8601 string.
    },
    parseValue(value) { // as input in a var of the graphql query => backend representation
      return value; // the datetime is stored as a ISO 8601 string.
    },
    parseLiteral(ast) { // as input directly in the graphql query => backend representation
      if (ast.kind === Kind.STRING) {
        try {
          return JSON.parse(ast.value);
        }
        catch {

        }
      }
      throw new UserInputError("Provided value cannot be parsed into a json object");
    },
  });

module.exports.resolver = { Json: jsonScalarResolver };