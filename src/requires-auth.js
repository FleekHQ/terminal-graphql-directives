/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */
/* eslint-disable func-names */

// DEV NOTE: follows examples from this blog post
// https://blog.apollographql.com/reusable-graphql-schema-directives-131fb3a177d1
const { SchemaDirectiveVisitor } = require('graphql-tools');
const {
  defaultFieldResolver,
  GraphQLString,
  GraphQLDirective,
  DirectiveLocation,
} = require('graphql');

const DEFAULT_MESSAGE = 'hidden field';

class RequiresAuth extends SchemaDirectiveVisitor {
  static getDirectiveDeclaration(directiveName, _schema) {
    return new GraphQLDirective({
      name: directiveName,
      locations: [DirectiveLocation.FIELD, DirectiveLocation.FIELD_DEFINITION],
    });
  }

  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field;
    // TODO: fix this to work with argument message
    // for some reason is not working
    const { message } = this.args;
    let result;
    // eslint-disable-next-line no-param-reassign
    field.resolve = async function(
      source,
      { format, ...otherArgs },
      context,
      info
    ) {
      // TODO: @dmolina79 add check for security session support
      if (context.user && context.user.id) {
        return resolve.call(this, source, otherArgs, context, info);
      }
      // if field is required we need to change it to non required
      if (field.astNode.type.kind === 'NonNullType') {
        field.type = GraphQLString;
        // we return a default message if field is required
        return message || DEFAULT_MESSAGE;
      }

      return result;
    };
  }
}

module.exports = RequiresAuth;
