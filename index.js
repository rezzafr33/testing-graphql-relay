import express from 'express';
import graphqlHTTP from 'express-graphql';
import schema from './schema';
import models from './models';

const app = express();

app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true,
  context: { models },
  pretty: true,
}));

models.sequelize.sync().then(
  () => app.listen(3000),
);
