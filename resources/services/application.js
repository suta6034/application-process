import {
    apiEndpoint,
    BACKEND,
} from '../utils/api';

const api = BACKEND;
export const baseUrl = `${api}/application`;

const BACKEND_ENDPOINT_APPLICATION = apiEndpoint({
    api,
    endpoint: 'application',
});

const BACKEND_ENDPOINT_MANUAL_APPLICATION = apiEndpoint({
    api,
    endpoint: 'application/manual',
});

export const TYPE = 'application';
export const STATUS = {
    applied: 'APPLIED',
    confirmed: 'CONFIRMED',
    invited: 'INVITED',
    rejected: 'REJECTED',
    archived: 'ARCHIVED',
};

const STATUS_ARRAY = Object.keys(STATUS).map(key => key);

/**
 * Sort direction.
 * @readonly
 * @enum {string}
 */
export const SORT_DIRECTION = {
    createDateAsc: 'createDate',
    createDateDesc: '-createDate',
};

export const formatIsoPhp = 'YYYY-MM-DDTHH:mm:ssZ';

/**
 * @typedef {object} Filter
 * @property {string} [status]
 */

/**
 * @typedef {object} GetOptions
 * @property {string} id
 */

/**
 * Get an application.
 * @param {GetOptions} options
 */
export async function get({ id }) {
    const { data: response } = await BACKEND_ENDPOINT_APPLICATION.get(`/${id}`);

    return response;
}

/**
 * Get an empty application.
 */
export async function getEmpty() {
    const { data: response } = await BACKEND_ENDPOINT_APPLICATION.get('/empty');

    return response;
}

/**
 * @typedef {object} GetListOptions
 * @property {Filter} [filter]
 * @property {number} [page]
 * @property {number} [pageSize]
 * @property {SORT_DIRECTION} [sortDirection]
 */

/**
 * Get a list of applications.
 * @param {GetListOptions} options
 */
export async function getList({
    filterString = '',
    page = 1,
    pageSize = undefined,
    sortDirection = SORT_DIRECTION.createDateDesc,
} = {}) {
    const { data: response } = await BACKEND_ENDPOINT_APPLICATION.get('', {
        params: {
            pageNumber: page,
            pageSize,
            sort: sortDirection,
            status: filterString
                .split(',')
                .reduce((acc, cur) => acc && STATUS_ARRAY.includes(cur), true)
                ? filterString.toUpperCase() : null,
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
 * Update the application with the given `id` using PATCH.
 * @param {PatchOptions} options
 */
export async function patch({ data, id }) {
    const properties = Object.keys(data);
    const hasOnlyMemo = properties.length === 1 && properties[0] === 'memo';
    const endpoint = hasOnlyMemo ? BACKEND_ENDPOINT_APPLICATION : BACKEND_ENDPOINT_MANUAL_APPLICATION;

    const { data: response } = await endpoint.patch(`/${id}`, data);

    return response;
}

/**
 * @typedef {object} PostOptions
 * @property {object} data
 */

/**
 * Create a new application using POST.
 * @param {PostOptions} options
 */
export async function post({ data }) {
    const { data: response } = await BACKEND_ENDPOINT_MANUAL_APPLICATION.post('', data);

    return response;
}

/**
 * @typedef {object} RemoveOptions
 * @property {string} id
 */

/**
 * Remove the application with the given `id`.
 * @param {RemoveOptions} options
 */
export async function remove({ id }) {
    await BACKEND_ENDPOINT_APPLICATION.delete(`/${id}`);

    return { data: null };
}
