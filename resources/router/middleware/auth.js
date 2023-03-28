import * as authService from '../../services/auth';

export default async function auth({ next, to }) {
    try {
        if (await authService.isUserLoggedIn()) return next();
    } catch (error) {
        if (process.env.NODE_ENV === 'development') {
            // eslint-disable-next-line no-console
            console.error(error);
        }
    }

    return authService.login(to.path);
}
