import {
    getField,
    updateField,
} from 'vuex-map-fields';

import * as mutationTypes from '../../mutation-types';

const mutations = {
    updateField,
    [mutationTypes.UPDATE_FROM_QUERY](state, data) {
        // eslint-disable-next-line no-param-reassign
        state.companies = data.companies;
    },
};

const getters = {
    getField,
};

const state = () => ({
    companies: [],
});

export function blacklistAutocompleteAdapter(company) {
    return company;
}

export default {
    namespaced: true,
    mutations,
    getters,
    state,
};
