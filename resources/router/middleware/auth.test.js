import auth from './auth';
import * as authService from '../../services/auth';

jest.mock('../../services/auth');

describe('auth()', () => {
    test('It should be a function.', () => {
        expect(typeof auth).toBe('function');
    });

    test('It should call the next callback if the user is authenticated.', async () => {
        authService.isUserLoggedIn.mockResolvedValue({});
        const to = { path: '/profil/lebenslauf' };
        const next = jest.fn();
        await auth({ next, to });

        expect(next).toBeCalled();
    });

    test('It should redirect to the login page if the user is not authenticated.', async () => {
        authService.isUserLoggedIn.mockRejectedValue(new Error());
        const next = jest.fn();
        const to = { path: '/profil/lebenslauf' };
        await auth({ next, to });

        expect(authService.login).toBeCalledWith('/profil/lebenslauf');
    });
});
