import {
    getField,
    updateField,
} from 'vuex-map-fields';

import * as mutationTypes from '../../mutation-types';

const mutations = {
    updateField,
    [mutationTypes.UPDATE_FROM_QUERY](state, statement) {
        // eslint-disable-next-line no-param-reassign
        state.statement = statement;
    },
};

const getters = {
    getField,
    filled(state) {
        return typeof state.statement === 'string' && state.statement.length > 0;
    },
};

const state = () => ({
    statement: '',
});

export default {
    namespaced: true,
    mutations,
    getters,
    state,
};
