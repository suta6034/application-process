import {
    apiEndpoint,
    BACKEND,
} from '../utils/api';

export {
    STATUS,
} from './application';

const endpoint = 'application';

export const baseUrl = `${BACKEND}/${endpoint}`;
const backendEndpoint = apiEndpoint({
    api: BACKEND,
    endpoint,
});

/**
 * @typedef {object} GetListOptions
 * @property {string} id
 */

/**
 * Get a list of application status.
 * @param {GetListOptions} options
 */
export async function getList({ id }) {
    const { data: response } = await backendEndpoint.get(`/${id}/status`);

    return response;
}

/**
 * @typedef {object} PatchOptions
 * @property {object} data
 * @property {string} id
 */

/**
 * Update the application status with the given `id` using PATCH.
 * @param {PatchOptions} options
 */
export async function patch({ data, id }) {
    const { status, statusDate } = data;

    const { data: response } = await backendEndpoint.patch(
        `/${id}/status`,
        {
            id,
            status,
            statusDate,
        },
    );

    return response;
}
