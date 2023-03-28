import {
    BACKEND,
    apiEndpoint,
} from '../utils/api';

const endpoint = 'job-alarm';
const api = BACKEND;
export const baseUrl = `${api}/${endpoint}`;

export const backendEndpoint = apiEndpoint({
    api,
    endpoint,
});

export function latest() {
    return backendEndpoint.get('latest');
}
