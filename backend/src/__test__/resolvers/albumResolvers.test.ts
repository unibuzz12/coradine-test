import Server from "../../server";

const server = Server;

beforeAll(async () => {
    server.run();
});

describe('POST /api/v1, Album Resolver Test', () => {
    it('it should return errors without authorization header', async () => {
        const queryAlbums = `
            query {
                albums(
                    collection_id: "6126081f6c4d54248a2c23e6"
                    offset: 0
                    limit: 10
                ) {
                    id,
                    name,
                    description,
                    user
                }
            }
        `;

        const result = await server.apolloServer.executeOperation({
            query: queryAlbums
        });

        expect(result.errors).toBeDefined();
    }, 30000);
});