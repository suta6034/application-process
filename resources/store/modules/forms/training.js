import {
    getField,
    updateField,
} from 'vuex-map-fields';
import {
    createTraining,
} from '../../../models/Training';

import * as mutationTypes from '../../mutation-types';

export const DEFAULT_ROW = {
    date: null,
    id: null,
    institute: '',
    submitted: false,
    title: '',
};

const mutations = {
    updateField,
    [mutationTypes.CLEAR_NEW_ROWS](state) {
        // eslint-disable-next-line no-param-reassign
        state.rows = state.rows.map((training) => {
            if (!training.id) {
                return { ...DEFAULT_ROW };
            }

            return training;
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
            ...data.map(training => ({
                ...DEFAULT_ROW,
                date: training.date,
                id: training.id,
                institute: training.institute,
                title: training.title,
            })),
            ...state.rows
                .filter(({ id }) => !id)
                .map((training) => {
                    // eslint-disable-next-line no-param-reassign
                    training.submitted = false;

                    return training;
                }),
        ];
    },
};

const getters = {
    getField,
    count(state) {
        return state.rows.filter(({ id }) => id).length;
    },
    filled(state) {
        return state.rows[0].id !== null;
    },
    models(state) {
        return state.rows
            .filter(x => x.id || x.submitted)
            .map(x => createTraining(x));
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
