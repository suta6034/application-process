import {
    BACKEND,
    apiEndpoint,
} from '../utils/api';

const endpoint = 'content-platform-articles';
const api = BACKEND;
export const baseUrl = `${api}/${endpoint}`;

export const backendEndpoint = {
    articles: apiEndpoint({
        api,
        endpoint,
    }),
};

export function get({ type, limit }) {
    return backendEndpoint[type].get('', {
        params: {
            limit,
        },
    });
}
