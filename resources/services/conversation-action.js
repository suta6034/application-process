import {
    backendEndpoint,
} from './conversation';

export async function send({ conversationId, data, type }) {
    const { data: response } = await backendEndpoint.post(`/${conversationId}/respond/${type}`, data);

    return response;
}

export async function opened({ data }) {
    await backendEndpoint.patch('/opened', { data });
}
