import {
    BACKEND,
    apiEndpoint,
} from '../utils/api';

const endpoint = 'job-matching';
const api = BACKEND;
export const baseUrl = `${api}/${endpoint}`;

export const backendEndpoint = apiEndpoint({
    api,
    endpoint,
});

export function get() {
    return backendEndpoint.get();
}
