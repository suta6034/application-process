import {
    BACKEND,
    apiEndpoint,
} from '../utils/api';

export const backendEndpoint = apiEndpoint({
    api: BACKEND,
    endpoint: 'user',
});

export const TYPE = 'user';

export function get() {
    return backendEndpoint.get();
}
