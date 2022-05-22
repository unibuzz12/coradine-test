import { getAlbums } from './album';
import { store } from '../../redux/store';

describe('Album Slice Test', () => {
    it('Without authentication error, graphQL error shold return', async () => {
        await store.dispatch(getAlbums('', 0));

        const state = store.getState().album;

        expect(state.error).toEqual('GraphQL error: user not authenticated!');
    });
});