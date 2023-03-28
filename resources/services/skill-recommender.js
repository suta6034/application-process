import {
    BACKEND,
    apiEndpoint,
} from '../utils/api';

const endpoint = 'skill-recommend';
export const baseUrl = `${BACKEND}/${endpoint}`;
export const backendEndpoint = apiEndpoint({
    api: BACKEND,
    endpoint,
});

export async function get({ jobFields = null, objectives = null, skills }) {
    const response = await backendEndpoint.get(
        '',
        {
            jobFields,
            objectives,
            skills,
        },
    );

    return response.data.data.map(({ attributes }) => ({
        id: null,
        label: attributes.label,
        level: {
            id: 10,
            label: 'Basiswissen',
        },
    }));
}
