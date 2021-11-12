const { UserInputError } = require('apollo-server');
const { GraphQLScalarType, Kind } = require('graphql');

const checkStringCompatibleDateTime = (value) => {
  try {
    return new Date(Date.parse(value.replace("T", " "))).toISOString();
  }
  catch(error) { 
    throw new UserInputError("Provided value is not an IS8601 date");
  }
};

const dateTimeScalarResolver = new GraphQLScalarType({
    name: 'DateTime',
    description: 'DateTime custom scalar type',
    serialize(value) { // backend response => json value for query response
      // the datetime is stored as a ISO 8601 string or epoch according to the argument
      if (typeof value === "number") {
        return value;
      }
      return checkStringCompatibleDateTime(value); 
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

module.exports = {
  resolver: { 
    DateTime: dateTimeScalarResolver 
  },
  formatResolver:  field => async (obj, args) => {
      if (args.format && args.format === 'EPOCH') {
        return Date.parse(obj[field]);
      }
      return obj[field];
    }
};