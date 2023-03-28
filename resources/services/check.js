import {
    BACKEND,
    apiEndpoint,
} from '../utils/api';

export function checkUserByEmail(email) {
    return apiEndpoint({
        api: BACKEND,
        endpoint: 'profile/check-user-by-email',
    }).get('', {
        params: {
            email,
        },
    });
}
