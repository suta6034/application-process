import {
    getField,
    updateField,
} from 'vuex-map-fields';
import {
    createProject,
} from '../../../models/Project';

import * as mutationTypes from '../../mutation-types';

export const DEFAULT_ROW = {
    description: '',
    end: null,
    id: null,
    name: '',
    start: null,
    submitted: false,
    url: '',
};

const mutations = {
    updateField,
    [mutationTypes.CLEAR_NEW_ROWS](state) {
        // eslint-disable-next-line no-param-reassign
        state.rows = state.rows.map((project) => {
            if (!project.id) {
                return { ...DEFAULT_ROW };
            }

            return project;
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
            ...data.map(project => ({
                ...DEFAULT_ROW,
                description: project.description,
                end: project.end,
                id: project.id,
                name: project.name,
                start: project.start,
                url: project.url,
            })),
            ...state.rows
                .filter(({ id }) => !id)
                .map((project) => {
                    // eslint-disable-next-line no-param-reassign
                    project.submitted = false;

                    return project;
                }),
        ];
    },
};

const getters = {
    getField,
    models(state) {
        return state.rows
            .filter(x => x.id || x.submitted)
            .map(x => createProject(x));
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
