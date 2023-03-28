import {
    BACKEND,
    apiEndpoint,
} from '../utils/api';

const endpoint = 'mf-header';
const api = BACKEND;
export const baseUrl = `${api}/${endpoint}`;

export const backendEndpoint = apiEndpoint({
    api,
    endpoint,
});

export async function getHeader(model) {
    const response = await backendEndpoint.get('', { params: { vm: JSON.stringify(model) } });
    return response.data;
}
