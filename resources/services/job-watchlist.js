import {
    BACKEND,
    apiEndpoint,
} from '../utils/api';

const endpoint = 'job-watchlist';
const api = BACKEND;
export const baseUrl = `${api}/${endpoint}`;

export const backendEndpoint = apiEndpoint({
    api,
    endpoint,
});

export function unwatch(id) {
    return backendEndpoint.delete(`${id}`);
}

export function watch(id) {
    return backendEndpoint.put(`${id}`);
}

export function latest() {
    return backendEndpoint.get('latest');
}
