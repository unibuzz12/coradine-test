import faker from 'faker';
import Server from "../../server";

const server = Server;

beforeAll(async () => {
    server.run();
});

describe('POST /api/v1, SignUp & Login Test', () => {
    const profile = {
        email: faker.internet.email(),
        password: faker.internet.password(15, false, /^[A-Za-z]*$/, '164'),
        first_name: faker.name.firstName(),
        last_name: faker.name.lastName()
    };

    it('it should return errors with empty email', async () => {
        const querySignUp = `
            mutation {
                signup (
                    first_name: "${profile.first_name}",
                    last_name: "${profile.last_name}",
                    email: "",
                    password: "${profile.password}"
                )
            }
        `;

        const result = await server.apolloServer.executeOperation({
            query: querySignUp
        });

        expect(result.errors).toBeDefined();
    }, 30000);

    it('it should return errors with email in not email type', async () => {
        const querySignUp = `
            mutation {
                signup (
                    first_name: "${profile.first_name}",
                    last_name: "${profile.last_name}",
                    email: "abc@abc.com",
                    password: "${profile.password}"
                )
            }
        `;

        const result = await server.apolloServer.executeOperation({
            query: querySignUp
        });

        expect(result.errors).toBeDefined();
    }, 30000);

    it('it should return errors with password not consists with numbers and lower/uppercase letters', async () => {
        const password = faker.internet.password(15, false, /^[A-Z]*$/);
        const querySignUp = `
            mutation {
                signup (
                    first_name: "${profile.first_name}",
                    last_name: "${profile.last_name}",
                    email: "${profile.email}",
                    password: "${password}"
                )
            }
        `;

        const result = await server.apolloServer.executeOperation({
            query: querySignUp
        });

        expect(result.errors).toBeDefined();
    }, 30000);

    it('it should success with valid register parameters', async () => {
        const querySignUp = `
            mutation {
                signup (
                    first_name: "${profile.first_name}",
                    last_name: "${profile.last_name}",
                    email: "${profile.email}",
                    password: "${profile.password}"
                )
            }
        `;

        const result = await server.apolloServer.executeOperation({
            query: querySignUp
        });

        expect(result.errors).toBeUndefined();

        const data = JSON.parse(result.data?.signup);

        expect(data).toEqual({
            success: true,
            token: expect.any(String)
        });
    }, 30000);

    it('it should return errors in login with fake credentials', async () => {

        const email = faker.internet.email();
        const password = faker.internet.password(15, false, /^[A-Za-z]*$/, '164');

        const queryLogin = `
            mutation {
                login (
                    email: "${email}",
                    password: "${password}"
                )
            }
        `;

        const result = await server.apolloServer.executeOperation({
            query: queryLogin
        });

        expect(result.errors).toBeDefined();
    }, 30000);

    it('it should return errors in login with wrong password', async () => {

        const email = profile.email;
        const password = faker.internet.password(15, false, /^[A-Za-z]*$/, '164');

        const queryLogin = `
            mutation {
                login (
                    email: "${email}",
                    password: "${password}"
                )
            }
        `;

        const result = await server.apolloServer.executeOperation({
            query: queryLogin
        });

        expect(result.errors).toBeDefined();
    }, 30000);

    it('it should success with valid credentials', async () => {

        const queryLogin = `
            mutation {
                login (
                    email: "${profile.email}",
                    password: "${profile.password}"
                )
            }
        `;

        const result = await server.apolloServer.executeOperation({
            query: queryLogin
        });

        expect(result.errors).toBeUndefined();

        const data = JSON.parse(result.data?.login);

        expect(data).toEqual({
            success: true,
            token: expect.any(String)
        });
    }, 30000);
});