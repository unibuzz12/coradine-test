import resolvers from './resolvers';

// Define our schema using the GraphQL schema language
const typeDefs = `
    type User {
        id: String!
        first_name: String!
        last_name: String!
        email: String!
    }

    type Album {
        id: String!
        user: String!
        collection_id: String!
        name: String!
        image: String!
        description: String!
    }

    type Collection {
        id: String!
        name: String!
    }

    type Query {
        me: User
        album(id: String!): Album
        albums(collection_id: String, offset: Int!, limit: Int!): [Album]
        collections: [Collection]
    }

    type Mutation {
        signup (first_name: String!, last_name: String!, email: String!, password: String!): String
        login (email: String!, password: String!): String
        create_collection (name: String!): String
        album_length(collection_id: String): String
        create_album (collection_id: String!, name: String!, image: String!, description: String!): String
        update_album (album_id: String!, collection_id: String!, name: String!, image: String!, description: String!): String
        delete_album (album_id: String!): String
    }
`
export default ({ typeDefs, resolvers })