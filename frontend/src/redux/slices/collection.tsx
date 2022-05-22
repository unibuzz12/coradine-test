import { createSlice } from '@reduxjs/toolkit';
import getApolloClient from "../../graphql/apolloClient";
import { CollectionsQuery } from '../../graphql/queries/query';

const initialState = {
  isLoading: false,
  error: false,
  collections: []
};

const slice = createSlice({
  name: 'collection',
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
    getCollectionsSuccess(state, action) {
      state.isLoading = false;
      state.collections = action.payload;
    },
  }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getCollections() {
  return async (dispatch: any) => {
    try {
      dispatch(slice.actions.startLoading());

      const result = await getApolloClient().query({
        query: CollectionsQuery
      });

      dispatch(slice.actions.getCollectionsSuccess(result.data.collections));
    } catch (error) {
      dispatch(slice.actions.hasError((error as Error).message));
    }
  };
}