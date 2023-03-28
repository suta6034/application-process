import {
    apiEndpoint,
    BACKEND,
} from '../utils/api';

const endpoint = 'profile-views';
const api = BACKEND;

export const baseUrl = `${api}/${endpoint}`;
export const TYPE = 'profileView';
export const backendEndpoint = apiEndpoint({
    api,
    endpoint,
});

/**
 * @typedef {object} GetListOptions
 * @property {number} [page]
 * @property {number} [pageSize]
 */

/**
 * Get a list of profile views.
 * @param {GetListOptions} options
 */

export async function getList({
    page = 1,
    pageSize = 12,
} = {}) {
    const { data: response } = await backendEndpoint.get('', {
        params: {
            pageNumber: page,
            pageSize,
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
 * Update the profile view notification using 'PATCH'.
 * @param {PatchOptions} options
 */

export async function patch() {
    const { data: response } = await backendEndpoint.patch('/opened');

    return response;
}
