import bodyParser from 'body-parser';
import express from 'express';
import path from 'path';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { createServer } from 'http';
import {
  execute,
  subscribe,
} from 'graphql';
import {
  graphiqlExpress,
  graphqlExpress,
} from 'graphql-server-express';

import schema from './schema';
import models from './models';

const app = express();
const ws = createServer(app);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/graphql', bodyParser.json(), graphqlExpress({
  schema,
  context: { models },
}));

app.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql',
  subscriptionsEndpoint: 'ws://localhost:3000/subscriptions',
}));

app.use(express.static('public'));
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

models.sequelize.sync().then(() => ws.listen(3000, () => {
  new SubscriptionServer({
    execute, subscribe, schema,
  }, {
    server: ws,
    path: '/subscriptions',
  });
}));
