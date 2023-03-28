import {
    apiEndpoint,
    BACKEND,
} from '../utils/api';

export function get() {
    return apiEndpoint({
        api: BACKEND,
        endpoint: 'notifications',
    }).get('');
}
