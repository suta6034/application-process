import {
    getField,
    updateField,
} from 'vuex-map-fields';

import * as mutationTypes from '../../mutation-types';

const mutations = {
    updateField,
    [mutationTypes.UPDATE_FROM_QUERY](state, profileText) {
        // eslint-disable-next-line no-param-reassign
        state.profileText = profileText;
    },
};

const getters = {
    getField,
    filled(state) {
        return typeof state.profileText === 'string' && state.profileText.length > 0;
    },
};

const state = () => ({
    profileText: '',
});

export default {
    namespaced: true,
    mutations,
    getters,
    state,
};
