import { makeExecutableSchema } from 'graphql-tools';
import  { requiresAuth } from '../../index';

const persons = [
  {
    personID: 1,
    name: 'Dave',
    secretField: 'Dave secret',
    requiredSecretField: 'Dave required secret',
    requiredIntSecret: 1,
  },
  {
    personID: 2,
    name: 'Mike',
    secretField: 'Mike secret',
    requiredSecretField: 'Mike required secret',
    requiredIntSecret: 2,
  },
  {
    personID: 3,
    name: 'John',
    secretField: 'John secret',
    requiredSecretField: 'John required secret',
    requiredIntSecret: 3,
  },
];

const typeDefs = `
  directive @requiresAuth on FIELD | FIELD_DEFINITION

  type Query {
    people: [Person]
  }

  type Person  {
    personID: Int
    name: String
    secretField: String @requiresAuth
    requiredSecretField: String! @requiresAuth
    requiredSecretFieldWithMsg: String! @requiresAuth
    requiredIntSecret: Int! @requiresAuth
  }`;

const resolvers = {
  Query: {
    people: () => persons,
  },
};

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
  schemaDirectives: {
    requiresAuth,
  },
});

export default schema;
