import {
    BACKEND,
    apiEndpoint,
} from '../utils/api';

const endpoint = 'conversations';
export const baseUrl = `${BACKEND}/${endpoint}`;
export const backendEndpoint = apiEndpoint({
    api: BACKEND,
    endpoint,
});

export const formatIsoPhp = 'YYYY-MM-DDTHH:mm:ssZ';
export const TYPE = 'conversation';

/**
 * @typedef {object} GetOptions
 * @property {string} id
 */

/**
 * Get a conversation.
 * @param {GetOptions} options
 */
export async function get({ id }) {
    const response = await backendEndpoint.get(`/${id}`);

    return response.data;
}

/**
 * @typedef {object} GetListOptions
 * @property {number} [page]
 * @property {number} [pageSize]
 * * @property {SORT_DIRECTION} [sortDirection]
 */

/**
 * Get a list of conversations.
 * @param {GetListOptions} options
 */
export async function getList({
    filter = undefined,
    page = 1,
    pageSize = undefined,
} = {}) {
    const { data: response } = await backendEndpoint.get('', {
        params: {
            pageNumber: page,
            pageSize,
            deleted: filter && filter.status === 'deleted' ? 1 : null,
        },
    });

    return response;
}

/**
 * @typedef {object} PatchOptions
 * @property {object} data
 * @property {string} id
 */

/**
 * Update the status for the conversation by using 'PATCH'.
 * Update the status for the notification of conversations by using 'PATCH'.
 * @param {PatchOptions} options
 */

export async function patch({ data, id }) {
    const { data: response } = await backendEndpoint.patch(`/${id}`, {
        data,
    });

    return response;
}

export async function remove({ id }) {
    await patch({ data: { deleted: true }, id });

    return { data: null };
}
