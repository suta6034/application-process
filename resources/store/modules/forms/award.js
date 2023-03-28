import {
    getField,
    updateField,
} from 'vuex-map-fields';
import {
    createAward,
} from '../../../models/Award';

import * as mutationTypes from '../../mutation-types';

export const DEFAULT_ROW = {
    date: null,
    id: null,
    name: '',
    submitted: false,
    url: '',
};

const mutations = {
    updateField,
    [mutationTypes.CLEAR_NEW_ROWS](state) {
        // eslint-disable-next-line no-param-reassign
        state.rows = state.rows.map((award) => {
            if (!award.id) {
                return { ...DEFAULT_ROW };
            }

            return award;
        });
    },
    [mutationTypes.DELETE](state, id) {
        // eslint-disable-next-line no-param-reassign
        state.rows = state.rows.filter(x => x.id !== id);
    },
    [mutationTypes.UPDATE_FROM_QUERY](state, data) {
        // The default row is merged to make sure all necessary fields are initialized.
        // eslint-disable-next-line no-param-reassign
        state.rows = [
            ...data.map(award => ({
                ...DEFAULT_ROW,
                date: award.date,
                id: award.id,
                name: award.name,
                url: award.url,
            })),
            ...state.rows
                .filter(({ id }) => !id)
                .map((award) => {
                    // eslint-disable-next-line no-param-reassign
                    award.submitted = false;

                    return award;
                }),
        ];
    },
};

const getters = {
    getField,
    models(state) {
        return state.rows
            .filter(x => x.id || x.submitted)
            .map(x => createAward(x));
    },
    count(state) {
        return state.rows.filter(({ id }) => id).length;
    },
    filled(state) {
        return state.rows[0].id !== null;
    },
};

const state = () => ({
    rows: [{ ...DEFAULT_ROW }],
});

export default {
    namespaced: true,
    mutations,
    getters,
    state,
};
