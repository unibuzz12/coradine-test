import gql from 'graphql-tag';

const MeQuery = gql`
    query {
        me {
            id
            first_name
            last_name
            email
        }
}`;

const AlbumQuery = gql`
    query($id: String!){
        album(id: $id) {
            id
            user
            collection_id
            name
            description
        }
}`;

const AlbumsQuery = gql`
    query($collection_id: String, $offset: Int!, $limit: Int!){
        albums(collection_id: $collection_id, offset: $offset, limit: $limit) {
            id
            user
            collection_id
            image
            name
            description
        }
}`;

const CollectionsQuery = gql`
{
    collections{
        id
        name
    }
}`;

export {
  MeQuery,
  AlbumQuery,
  AlbumsQuery,
  CollectionsQuery
};
