const { GraphQLScalarType, Kind } = require('graphql');

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

module.exports.resolver = { DateTime: dateTimeScalarResolver };