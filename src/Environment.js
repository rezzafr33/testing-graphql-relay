import {
  Environment,
  Network,
  RecordSource,
  Store,
} from 'relay-runtime';
import fetch from 'isomorphic-fetch';

const store = new Store(new RecordSource());

const network = Network.create((operation, variables) => fetch('/graphql', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    query: operation.text,
    variables,
  }),
}).then(response => response.json()));

const environment = new Environment({
  network,
  store,
});

export default environment;
