import { createSlice } from '@reduxjs/toolkit';
import getApolloClient from "../../graphql/apolloClient";
import { AlbumsQuery } from '../../graphql/queries/query';
import {
  createAlbumMutation,
  updateAlbumMutation,
  DeleteAlbumMutation,
  AlbumLengthMutation
} from '../../graphql/mutations/mutation';
import {
  IAlbum,
  IAlbumUpdate,
  IAlbumDelete,
} from '../../interfaces'

const initialState = {
  isLoading: false,
  error: false,
  albums: [],
  total: 0,
  hasMore: true
};

const pageSize = 12;

const slice = createSlice({
  name: 'album',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    // GET Collections Success
    getAlbumsSuccess(state, action) {
      state.isLoading = false;
      const page = action.payload.page;
      page > 0 ? 
        state.albums = state.albums.concat(action.payload.albums)
        : state.albums = action.payload.albums;
      state.total = action.payload.total;
      if(action.payload.albums.length < pageSize)
        state.hasMore = false;
      else state.hasMore = true;
    },
  }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getAlbums(collection_id: string, page: number) {
  return async (dispatch: any) => {
    try {
      dispatch(slice.actions.startLoading());
  
      const result_total = await getApolloClient().mutate({
        mutation: AlbumLengthMutation,
        variables: {
          collection_id: collection_id
        }
      });

      const result = await getApolloClient().query({
        query: AlbumsQuery,
        variables: {
          collection_id: collection_id,
          offset: page * pageSize,
          limit: pageSize
        },
        fetchPolicy: 'network-only'
      });

      dispatch(slice.actions.getAlbumsSuccess({
        albums: result.data.albums,
        total: JSON.parse(result_total.data.album_length).total,
        page: page
      }));
    } catch (error) {
      dispatch(slice.actions.hasError((error as Error).message));
    }
  };
}

export function createAlbum(albumArgs: IAlbum) {
  return async () => {
    try {
      await getApolloClient().mutate({
        mutation: createAlbumMutation,
        variables: {
          collection_id: albumArgs.collection_id,
          name: albumArgs.name,
          image: albumArgs.image,
          description: albumArgs.description
        }
      });

      return true;
    } catch (error) {
      throw error;
    }
  };
}

export function updateAlbum(albumArgs: IAlbumUpdate) {
  return async () => {
    try {
      await getApolloClient().mutate({
        mutation: updateAlbumMutation,
        variables: {
          album_id: albumArgs.id,
          collection_id: albumArgs.collection_id,
          name: albumArgs.name,
          image: albumArgs.image,
          description: albumArgs.description
        }
      });

      return true;
    } catch (error) {
      throw error;
    }
  };
}

export function deleteAlbum(albumArgs: IAlbumDelete) {
  return async () => {
    try {
      await getApolloClient().mutate({
        mutation: DeleteAlbumMutation, variables: {
          album_id: albumArgs.album_id
        }
      });

      return true;
    } catch (error) {
      throw error;
    }
  };
}
