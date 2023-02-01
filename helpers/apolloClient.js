import { ApolloClient, InMemoryCache } from "@apollo/client";
// import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
// import { createClient } from "graphql-ws";
import { split, HttpLink } from "@apollo/client";
// import { getMainDefinition } from "@apollo/client/utilities";
// import WebSocket from "ws";

const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_HTTP_URL,
});
// const wsLink = new GraphQLWsLink(
//   createClient({
//     url: "ws://localhost:8080/v1/graphql",
//     webSocketImpl: require("websocket").w3cwebsocket,
//   })
// );
// The split function takes three parameters:
//
// * A function that's called for each operation to execute
// * The Link to use for an operation if the function returns a "truthy" value
// * The Link to use for an operation if the function returns a "falsy" value
// const splitLink = split(
//   ({ query }) => {
//     const definition = getMainDefinition(query);
//     return (
//       definition.kind === "OperationDefinition" &&
//       definition.operation === "subscription"
//     );
//   },
//   wsLink,
//   httpLink
// );

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});
export const updatedClient = new ApolloClient({
  link: new HttpLink({
    uri: process.env.NEXT_PUBLIC_UPDATED_GRAPHQL_HTTP_URL,
  }),
  cache: new InMemoryCache(),
});

export default client;
