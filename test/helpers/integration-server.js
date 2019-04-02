import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import request from 'request-promise';
import schema from './schema';


export const start = (done, appPort) => {
  const PORT = appPort || 4001;
  const server = new ApolloServer({
    schema,
    context: ({ req, res, ...rest }, ...other) => {

      return {
        test: 'test',
      };
    },
  });

  const app = express();

  server.applyMiddleware({ app });
  return app.listen(PORT, () => done());
};

export const stop = async (app, done) => {
  await app.close();
  done();
};

export const graphqlQuery = (app, query, variables) => request({
  baseUrl: `http://localhost:${app.address().port}`,
  uri: '/graphql',
  method: 'POST',
  body: {
    query,
    variables,
  },
  resolveWithFullResponse: true,
  json: true,
});
