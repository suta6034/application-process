import {
    BACKEND,
    apiEndpoint,
} from '../utils/api';

import {
    createAutocomplete,
} from '../models/Autocomplete';

export const backendEndpoint = apiEndpoint({
    api: BACKEND,
    endpoint: 'autocomplete',
});

export async function autocomplete({ filters, type }) {
    const response = await backendEndpoint.get(type, createAutocomplete({ filters }));

    return response.data.data.map(({ attributes, id }) => ({
        id,
        label: attributes.label,
        attributes,
    }));
}
