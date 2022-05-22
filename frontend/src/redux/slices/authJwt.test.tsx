import faker from 'faker';
import { register, login } from './authJwt'
import { store } from '../../redux/store';

describe('authJWT Slice Test', () => {
    const profile = {
        email: faker.internet.email(),
        password: faker.internet.password(15, false, /^[A-Za-z]*$/, '164'),
        first_name: faker.name.firstName(),
        last_name: faker.name.lastName()
    };

    it('Register should return error with empty email', async () => {
        try{
            await store.dispatch(register({
                first_name: profile.first_name,
                last_name: profile.last_name,
                email: '',
                password: profile.password
            }));
        } catch (err) {
            expect((err as Error).message).toBeDefined();
        }
    });

    it('Register should return error with email in not email type', async () => {
        try{
            await store.dispatch(register({
                first_name: profile.first_name,
                last_name: profile.last_name,
                email: 'abc@abc.com',
                password: profile.password
            }));
        } catch (err) {
            expect((err as Error).message).toBeDefined();
        }
    });

    it('Register should return error with invalid password', async () => {
        try{
            await store.dispatch(register({
                first_name: profile.first_name,
                last_name: profile.last_name,
                email: profile.email,
                password: faker.internet.password(15, false, /^[A-Z]*$/)
            }));
        } catch (err) {
            expect((err as Error).message).toBeDefined();
        }
    });

    it('Register should success with valid inputs', async () => {

        await store.dispatch(register(profile));

        const state = store.getState().authJwt;

        expect(state.isAuthenticated).toBe(true);
        expect(state.user).toBeDefined();
    });

    it('Login should return error with email in not email type', async () => {
        try{
            await store.dispatch(login({
                email: profile.email,
                password: faker.internet.password(15, false, /^[A-Za-z]*$/, '164')
            }));
        } catch (err) {
            expect((err as Error).message).toBeDefined();
        }
    });

    it('Login should sucess with valid credentials', async () => {
        await store.dispatch(login({
            email: profile.email,
            password: profile.password
        }));

        const state = store.getState().authJwt;

        expect(state.isAuthenticated).toBe(true);
        expect(state.user).toBeDefined();
    });
});