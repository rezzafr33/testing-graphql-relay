import path from 'path';
import express from 'express';
import graphqlHTTP from 'express-graphql';
import schema from './schema';
import models from './models';

const app = express();

app.use(express.static('public'));

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true,
  context: { models },
  pretty: true,
}));

models.sequelize.sync().then(
  () => app.listen(3000),
);
