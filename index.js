import express from 'express';
import graphqlHTTP from 'express-graphql';

import schema from './schema';
import models from './models';
import root from './resolver';

const app = express();

app.use('/graphql', graphqlHTTP({
  schema,
  rootValue: root,
  graphiql: true,
  context: { models },
  pretty: true,
}));

models.sequelize.sync().then(
  () => app.listen(3000),
);
