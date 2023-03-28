import {
    getField,
    updateField,
} from 'vuex-map-fields';
import {
    createInterest,
} from '../../../models/Interest';

import * as mutationTypes from '../../mutation-types';

export const DEFAULT_ROW = {
    id: null,
    label: '',
};

const mutations = {
    updateField,
    [mutationTypes.UPDATE_FROM_QUERY](state, data) {
        // The default row is merged to make sure all necessary fields are initialized.
        // eslint-disable-next-line no-param-reassign
        state.rows = data.map(interest => ({
            ...DEFAULT_ROW,
            id: interest.id,
            label: interest.name,
        }));
    },
};

const getters = {
    getField,
    models(state) {
        return state.rows.map(x => createInterest(x));
    },
    count(state) {
        return state.rows.length;
    },
    filled(state) {
        return state.rows.length > 0;
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
