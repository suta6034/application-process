import * as authService from '../../services/auth';

export default async function guest({ next, to }) {
    try {
        if (!await authService.isUserLoggedIn() && authService.isUserLoggedInRemote()) {
            return authService.login(to.path);
        }
    } catch (error) {
        if (process.env.NODE_ENV === 'development') {
            // eslint-disable-next-line no-console
            console.error(error);
        }
    }
    return next();
}
