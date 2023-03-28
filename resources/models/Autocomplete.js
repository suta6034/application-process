const DEFAULT_FILTERS = {
    limit: 5,
};

export class Autocomplete {
    constructor({ filters }) {
        const allFilters = { ...DEFAULT_FILTERS, ...filters };

        this.params = Object.keys(allFilters).reduce((prev, filterKey) => {
            // eslint-disable-next-line no-param-reassign
            prev[`filter[${filterKey}]`] = allFilters[filterKey];
            return prev;
        }, {});
    }
}

export function createAutocomplete(data = {}) {
    return new Autocomplete(data);
}
