import {
    BACKEND,
    apiEndpoint,
} from '../utils/api';

const NUMBER_OF_LATEST_FOLLOWED_COMPANIES = 3;

const endpoint = 'company-follow';
const api = BACKEND;
export const baseUrl = `${api}/${endpoint}`;

const backendEndpoint = apiEndpoint({
    api,
    endpoint,
});

export function latest() {
    return backendEndpoint.get('latest', {
        params: {
            pageSize: NUMBER_OF_LATEST_FOLLOWED_COMPANIES,
        },
    });
}

export function watch(id) {
    return backendEndpoint.post(`${id}`);
}

export function unwatch(id) {
    return backendEndpoint.delete(`${id}`);
}
