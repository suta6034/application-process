import {
    denormalizeResponse,
    makeDenormalizer,
    makeNormalizer,
    mapProperty,
} from '../utils/json-api-bridge';
import {
    apiEndpoint,
} from '../utils/api';

// Since it has been removed from utils/api.js in https://jira.karriereservice.at/browse/KSWAT-6370
// CANDIDATE_API = 'mockTestApi'; is only defined so that the existing unit tests do not fail.
// If this feature gets reviewed at a later time, once has to refactor it to use BFF endpoints for
// the requests and remove denormalizeResponse, makeDenormalizer and makeNormalizer as the structuring of
// data should only happen in BFF.
const CANDIDATE_API = 'mockTestApi';

export const DEFAULT_TEXT = 'Sehr geehrte Damen und Herren,\n\n'
    + 'ich bewerbe mich hiermit für die Position (ausgeschriebene Position). '
    + 'Im Anhang finden Sie meine Bewerbungsunterlagen.\n'
    + 'Sollten Sie noch weitere Dokumente benötigen, geben Sie mir bitte Bescheid.\n\n'
    + 'Ich freue mich, Sie bei einem persönlichen Gespräch kennenzulernen.\n\n'
    + 'Freundliche Grüße\n'
    + '(Vorname) (Nachname)';

const endpoint = 'profiles/motivation-letters';
const api = CANDIDATE_API;
export const baseUrl = `${api}/${endpoint}`;
const ENDPOINT_CANDIDATE_API = apiEndpoint({
    api,
    endpoint,
});

export const TYPE = 'motivationLetter';

export const SHAPE = () => ({
    type: TYPE,
    id: null,
    title: null,
    text: DEFAULT_TEXT,
    isDefault: false,
});

const MAP = {
    type: mapProperty({ defaultValue: TYPE, path: 'type' }),
    id: mapProperty({ defaultValue: null, path: 'id' }),
    title: mapProperty({ defaultValue: null, path: 'attributes.title' }),
    text: mapProperty({ defaultValue: null, path: 'attributes.text' }),
    isDefault: mapProperty({ defaultValue: false, path: 'attributes.isDefault' }),
};

export const denormalizeResource = makeDenormalizer({ map: MAP });

const normalizeResource = makeNormalizer({ map: MAP });

/**
 * @typedef {object} GetOptions
 * @property {string} id
 */

/**
 * Get a motivation letter.
 * @param {GetOptions} options
 */
export async function get({ id }) {
    const { data: response } = await ENDPOINT_CANDIDATE_API.get(`/${id}`);

    return denormalizeResponse({
        denormalizer: denormalizeResource,
        response,
    });
}

/**
 * Get a list of motivation letters.
 */
export async function getList() {
    const { data: response } = await ENDPOINT_CANDIDATE_API.get('');
    return denormalizeResponse({
        denormalizer: denormalizeResource,
        response,
    });
}

/**
 * @typedef {object} PostOptions
 * @property {object} data
 */

/**
 * Create the motivation letter using POST.
 * @param {PostOptions} options
 */
export async function post({ data }) {
    const normalizedResource = normalizeResource({
        resource: {
            ...data,
            type: TYPE,
        },
    });

    const { data: response } = await ENDPOINT_CANDIDATE_API.post('', {
        data: normalizedResource,
    });

    return denormalizeResponse({
        denormalizer: denormalizeResource,
        response,
    });
}

/**
 * @typedef {object} PutOptions
 * @property {object} data
 * @property {string} id
 */

/**
 * Update the motivation letter with the given `id` using PUT.
 * @param {PutOptions} options
 */
export async function patch({ id, data }) {
    const normalizedResource = normalizeResource({
        isPatchMode: true,
        resource: {
            ...data,
            type: TYPE,
            id,
        },
    });

    const { data: response } = await ENDPOINT_CANDIDATE_API.patch(`/${id}`, {
        data: normalizedResource,
    });

    return denormalizeResponse({
        denormalizer: denormalizeResource,
        response,
    });
}

/**
 * @typedef {object} RemoveOptions
 * @property {string} id
 */

/**
 * Remove the motivation letter with the given `id`.
 * @param {RemoveOptions} options
 */
export async function remove({ id }) {
    await ENDPOINT_CANDIDATE_API.delete(`/${id}`);

    return { data: null };
}
