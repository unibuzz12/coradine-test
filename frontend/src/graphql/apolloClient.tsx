import ApolloClient, { InMemoryCache } from 'apollo-boost';

const cache = new InMemoryCache({ freezeResults: false });

const getApolloClient = () => {
  const token = localStorage.getItem('jwtToken');
  return new ApolloClient({
    cache,
    uri: process.env.REACT_APP_GRAPH_URI,
    request: (operation) => {
      if (token) {
        operation.setContext({
          headers: {
            Authorization: token ? `Bearer ${token}` : ''
          }
        });
      }
    }
  });
};

export default getApolloClient;
