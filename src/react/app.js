import React from 'react';
import ReactDOM from 'react-dom';
import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  HttpLink,
  split,
} from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/link-ws';

import BeardGame from './components/beard-game';
import Chat from './components/chat';
import Effects from './components/effects';

const wsLink = new WebSocketLink({
  uri: `wss://api.streamblitz.com/graphql`,
  options: {
    reconnect: true,
  },
});

const httpLink = new HttpLink({
  uri: `https://api.streamblitz.com/graphql`,
});

const link = split(
  ({ query }) => {
    const definition = getMainDefinition(query);

    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <Effects />
    </ApolloProvider>
  </React.StrictMode>,
  document.querySelector('.effects'),
);

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <BeardGame />
    </ApolloProvider>
  </React.StrictMode>,
  document.querySelector('.beard-game'),
);

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <Chat />
    </ApolloProvider>
  </React.StrictMode>,
  document.querySelector('.chat'),
);
