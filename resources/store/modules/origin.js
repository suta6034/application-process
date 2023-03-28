import {
    getField,
    updateField,
} from 'vuex-map-fields';

import * as mutationTypes from '../mutation-types';

const mutations = {
    updateField,
    [mutationTypes.SET_ORIGIN](state, origin) {
        // eslint-disable-next-line no-param-reassign
        state.origin = origin;
    },
};

const getters = {
    getField,
};

const state = () => ({
    origin: 'ONE_PAGER_WORK_MANUAL',
});

export default {
    namespaced: true,
    mutations,
    getters,
    state,
};
