import {
    getField,
    updateField,
} from 'vuex-map-fields';
import {
    createEducation,
} from '../../../models/Education';

import * as mutationTypes from '../../mutation-types';

import educationTypes from '../../../data/education-types.json';

export const DEFAULT_ROW = {
    category: {},
    completed: true,
    customType: '',
    description: '',
    end: null,
    focus: '',
    id: null,
    location: '',
    name: '',
    start: null,
    submitted: false,
    trainingCompany: null,
    title: '',
    type: {},
};

function getCategory(type) {
    let category = {};
    Object.keys(educationTypes).some((key) => {
        const subCategory = educationTypes[key].find(x => x.id === type);

        if (!subCategory) return false;

        category = {
            id: key,
            label: key,
        };

        return true;
    });
    return category;
}

const mutations = {
    updateField,
    [mutationTypes.CLEAR_NEW_ROWS](state) {
        // eslint-disable-next-line no-param-reassign
        state.rows = state.rows.map((education) => {
            if (!education.id) {
                return { ...DEFAULT_ROW };
            }

            return education;
        });
    },
    [mutationTypes.DELETE](state, id) {
        // eslint-disable-next-line no-param-reassign
        state.rows = state.rows.filter(x => x.id !== id);
    },
    [mutationTypes.RESET_STATE](state) {
        Object.keys(state.rows).forEach((key) => {
            state[key] = DEFAULT_ROW[key];
        });
    },
    [mutationTypes.UPDATE_FROM_QUERY](state, data) {
        // The default row is merged to make sure all necessary fields are initialized.
        // eslint-disable-next-line no-param-reassign
        state.rows = [
            ...data.map(education => ({
                ...DEFAULT_ROW,
                category: getCategory(education.type),
                completed: education.completed,
                customType: education.customType,
                description: education.description,
                end: education.end,
                focus: education.focus,
                id: education.id,
                location: education.location,
                name: education.name,
                start: education.start,
                title: education.title,
                trainingCompany: education.trainingCompany,
                type: education.type ? {
                    id: education.type,
                    label: education.typeLabel,
                } : {},
            })),
            ...state.rows
                .filter(({ id }) => !id)
                .map((education) => {
                    // eslint-disable-next-line no-param-reassign
                    education.submitted = false;

                    return education;
                }),
        ];
    },
};

const getters = {
    getField,
    count(state) {
        return state.rows.length - 1;
    },
    filled(state) {
        return state.rows[0].id !== null;
    },
    models(state) {
        return state.rows
            .filter(x => x.id || x.submitted)
            .map(x => createEducation(x));
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
    getCategory,
};
