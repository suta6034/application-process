import {
    BACKEND,
    apiEndpoint,
} from '../utils/api';

const endpoint = 'personality-traits';
const api = BACKEND;
export const baseUrl = `${api}/${endpoint}`;

const backendEndpoint = apiEndpoint({
    api,
    endpoint,
});

export const TYPE = 'personality-traits';

export async function getList() {
    return backendEndpoint.get();
}
