import { getCollections } from './collection';
import { store } from '../../redux/store';

describe('Collection Slice Test', () => {
    it('Without authentication error, graphQL error shold return', async () => {
        await store.dispatch(getCollections());

        const state = store.getState().collection;

        expect(state.error).toEqual('GraphQL error: user not authenticated!');
    });
});