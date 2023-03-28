import {
    getField,
    updateField,
} from 'vuex-map-fields';

import {
    createAdaptedFile,
} from '../../../utils/AdaptedFile';
import * as mutationTypes from '../../mutation-types';

const mutations = {
    updateField,
    [mutationTypes.UPDATE_FROM_QUERY](state, data) {
        // eslint-disable-next-line no-param-reassign
        state.rows = data.map(file => createAdaptedFile(file));
    },
};

const getters = {
    getField,
    count(state) {
        return state.rows.length;
    },
};

const state = () => ({
    rows: [],
});

export default {
    namespaced: true,
    mutations,
    getters,
    state,
};
