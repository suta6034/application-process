import {
    createNamespacedHelpers,
} from 'vuex';
import {
    createHelpers,
} from 'vuex-map-fields';

import * as mutationTypes from '../mutation-types';
import {
    createProfile,
} from '../../models/Profile';
// eslint-disable-next-line import/no-cycle
import {
    commitAndShowModal,
} from '../../utils/error';
import {
    apiErrorShouldBeReported,
} from '../../utils/api';

import {
    checkUserByEmail,
} from '../../services/check';
import {
    educationCategoriesGet,
    educationTypesGet,
} from '../../services/education';

import basics from './forms/basics';
import desiredJob from './forms/desired-job';
import education from './forms/education';
import language from './forms/language';
import origin from './origin';
import skill from './forms/skill';
import work from './forms/work';

const DEFAULT_STATE = {
    steps: [],
    educationCategories: [],
    educationTypes: [],
    callNavigation: {},
    userWithEmailExists: false,
    profileExists: false,
    source: null,
};

const actions = {
    async fetchCheckUserByEmail({ commit }, email) {
        try {
            const response = await checkUserByEmail(email);
            commit(mutationTypes.SET_USER_WITH_EMAIL_EXISTS, response.data.meta.hasUser);
            commit(mutationTypes.SET_PROFILE_EXISTS, response.data.meta.hasProfile);
        } catch (error) {
            if (apiErrorShouldBeReported(error)) {
                commitAndShowModal(commit, error);
            }
        }
    },
    async fetchEducationCategories({ commit }) {
        try {
            const educationCategories = await educationCategoriesGet();
            commit(mutationTypes.SET_EDUCATION_CATEGORIES, { educationCategories });
        } catch (error) {
            if (apiErrorShouldBeReported(error)) {
                commitAndShowModal(commit, error);
            }
        }
    },
    async fetchEducationTypes({ commit }) {
        try {
            const educationTypes = await educationTypesGet();
            commit(mutationTypes.SET_EDUCATION_TYPES, { educationTypes });
        } catch (error) {
            if (apiErrorShouldBeReported(error)) {
                commitAndShowModal(commit, error);
            }
        }
    },
};

const mutations = {
    [mutationTypes.SET_EDUCATION_CATEGORIES](state, { educationCategories }) {
        state.educationCategories = educationCategories;
    },
    [mutationTypes.SET_USER_WITH_EMAIL_EXISTS](state, status) {
        state.userWithEmailExists = status;
    },
    [mutationTypes.SET_PROFILE_EXISTS](state, status) {
        state.profileExists = status;
    },
    [mutationTypes.SET_EDUCATION_TYPES](state, { educationTypes }) {
        state.educationTypes = educationTypes;
    },
    [mutationTypes.SET_SOURCE](state, source) {
        state.source = source;
    },
    [mutationTypes.DELETE_EDUCATION_ITEM](state, rowIndex) {
        state.education.rows.splice(rowIndex, 1);
    },
    [mutationTypes.DELETE_WORK_ITEM](state, rowIndex) {
        state.work.rows.splice(rowIndex, 1);
    },
    [mutationTypes.RESET_STATE](state) {
        Object.keys(state).forEach((key) => {
            state[key] = DEFAULT_STATE[key];
        });
    },
};

const getters = {
    model(state, instanceGetters) {
        return createProfile({
            basics: instanceGetters['basics/model'],
            desiredJob: instanceGetters['desiredJob/model'],
            educations: instanceGetters['education/models'],
            origin: state.origin.origin,
            skills: instanceGetters['skill/models'],
            work: instanceGetters['work/models'],
        });
    },
};

const state = DEFAULT_STATE;

const modules = {
    basics,
    desiredJob,
    education,
    language,
    origin,
    skill,
    work,
};

export const { mapFields: mapBasicsFields } = createHelpers({
    getterType: 'profileCreate/basics/getField',
    mutationType: 'profileCreate/basics/updateField',
});

export const { mapFields: mapDesiredJobFields } = createHelpers({
    getterType: 'profileCreate/desiredJob/getField',
    mutationType: 'profileCreate/desiredJob/updateField',
});

export const { mapMultiRowFields: mapEducationMultiRowFields } = createHelpers({
    getterType: 'profileCreate/education/getField',
    mutationType: 'profileCreate/education/updateField',
});

export const { mapMultiRowFields: mapWorkMultiRowFields } = createHelpers({
    getterType: 'profileCreate/work/getField',
    mutationType: 'profileCreate/work/updateField',
});

export const { mapFields: mapSkillFields } = createHelpers({
    getterType: 'profileCreate/skill/getField',
    mutationType: `profileCreate/skill/${mutationTypes.UPDATE}`,
});

export const {
    mapGetters: mapBasicsGetters,
    mapMutations: mapBasicsMutations,
} = createNamespacedHelpers('profileCreate/basics');

export const {
    mapGetters: mapDesiredJobGetters,
} = createNamespacedHelpers('profileCreate/desiredJob');

export const {
    mapGetters: mapEducationGetters,
} = createNamespacedHelpers('profileCreate/education');

export const {
    mapGetters: mapWorkGetters,
    mapMutations: mapWorkMutations,
} = createNamespacedHelpers('profileCreate/work');

export const {
    mapGetters: mapSkillGetters,
} = createNamespacedHelpers('profileCreate/skill');

export const {
    mapGetters: mapOriginGetters,
    mapMutations: mapOriginMutations,
} = createNamespacedHelpers('profileCreate/origin');

export const profileCreate = {
    namespaced: true,
    actions,
    mutations,
    getters,
    state,
    modules,
};
