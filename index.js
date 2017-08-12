import express from 'express';
import graphqlHTTP from 'express-graphql';
import {
  graphql,
  introspectionQuery,
} from 'graphql';

import schema from './schema';
import models from './models';

const fs = require('fs');
const path = require('path');

const app = express();

app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true,
  context: { models },
  pretty: true,
}));

graphql(schema, introspectionQuery)
  .then((result) => {
    fs.writeFileSync(
      path.join(__dirname, 'cache/schema.json'),
      JSON.stringify(result, null, 2),
    );
    console.log('Generate cached schema.json file.');
  })
  .catch(console.error());

models.sequelize.sync().then(
  () => app.listen(3000),
);
