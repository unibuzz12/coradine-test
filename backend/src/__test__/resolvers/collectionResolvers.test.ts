import Server from "../../server";

const server = Server;

beforeAll(async () => {
    server.run();
});

describe('POST /api/v1, Collection Resolver Test', () => {
    it('it should return errors without authorization header', async () => {
        const queryCollections = `
            query {
                collections {
                    id,
                    name
                }
            }
        `;

        const result = await server.apolloServer.executeOperation({
            query: queryCollections
        });

        expect(result.errors).toBeDefined();
    }, 30000);
});