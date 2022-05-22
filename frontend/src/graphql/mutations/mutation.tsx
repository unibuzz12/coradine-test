import gql from 'graphql-tag';

const SignUpMutation = gql`
    mutation signup($first_name: String!, $last_name: String!, $email: String!, $password: String!) {
        signup(first_name: $first_name, last_name: $last_name, email: $email, password: $password)
}`;

const LoginMutation = gql`
    mutation login($email: String!, $password: String!) {
        login(email: $email, password: $password)
}`;

const CreateCollectionMutation = gql`
    mutation create_collection($name: String!) {
        create_collection(name: $name) 
}`;

const createAlbumMutation = gql`
    mutation create_album($collection_id: String!, $name: String!, $image: String!, $description: String!) {
        create_album(collection_id: $collection_id, name: $name, image: $image, description: $description) 
}`;

const updateAlbumMutation = gql`
    mutation update_album($album_id: String!, $collection_id: String!, $name: String!, $image: String!, $description: String!) {
        update_album(album_id: $album_id, collection_id: $collection_id, name: $name, image: $image, description: $description) 
}`;

const DeleteAlbumMutation = gql`
    mutation delete_album($album_id: String!) {
        delete_album(album_id: $album_id)
}`;

const AlbumLengthMutation = gql`
    mutation album_length($collection_id: String) {
        album_length(collection_id: $collection_id)
}`;

export {
  SignUpMutation,
  LoginMutation,
  CreateCollectionMutation,
  createAlbumMutation,
  updateAlbumMutation,
  DeleteAlbumMutation,
  AlbumLengthMutation
};
