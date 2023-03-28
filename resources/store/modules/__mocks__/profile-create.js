import cloneDeep from 'lodash/cloneDeep';
import merge from 'lodash/merge';
import {
    createNamespacedHelpers,
} from 'vuex';
import {
    createHelpers,
} from 'vuex-map-fields';

import * as mutationTypes from '../../mutation-types';

import basics from '../forms/basics';
import desiredJob from '../forms/desired-job';
import education from '../forms/education';
import language from '../forms/language';
import origin from '../origin';
import skill from '../forms/skill';
import work from '../forms/work';

const actions = {
    fetchEducationCategories: jest.fn(),
    fetchEducationTypes: jest.fn(),
    fetchCheckUserByEmail: jest.fn(),
};

const mutations = {
    SET_PROFILE_EXISTS: jest.fn(),
    SET_STEPS: jest.fn(),
    SET_USER_WITH_EMAIL_EXISTS: jest.fn(),
    RESET_STATE: jest.fn(),
};

const getters = {
    model: jest.fn(),
};

const state = {
    steps: [
        {
            name: 'Step 1',
            sections: [],
            key: 'one',
            routerName: 'form-foo',
        },
        {
            name: 'Step 2',
            sections: [],
            key: 'two',
            routerName: 'form-bar',
        },
        {
            name: 'Step 3',
            sections: [],
            key: 'three',
            routerName: 'form-qux',
        },
    ],
    educationCategories: [],
    educationTypes: [
        {
            label: 'Foo',
            parentId: 1,
        },
        {
            label: 'Bar',
            parentId: 1,
        },
        {
            label: 'Baz',
            parentId: 2,
        },
    ],
    userWithEmailExists: false,
    profileExists: false,
};

const modules = {
    basics,
    desiredJob,
    education,
    language,
    origin,
    skill,
    work,
};

// eslint-disable-next-line no-underscore-dangle
export function __createMocks(custom = { actions: {}, mutations: {}, getters: {}, state: {}, modules: {} }) {
    const mockActions = merge({}, cloneDeep(actions), custom.actions);
    const mockMutations = merge({}, cloneDeep(mutations), custom.mutations);
    const mockGetters = merge({}, cloneDeep(getters), custom.getters);
    const mockState = merge({}, cloneDeep(state), custom.state);
    const mockModules = merge({}, cloneDeep(modules), custom.modules);

    return {
        namespaced: true,
        actions: mockActions,
        mutations: mockMutations,
        getters: mockGetters,
        state: mockState,
        modules: mockModules,
    };
}

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
    mapGetters: mapSkillGetters,
} = createNamespacedHelpers('profileCreate/skill');

export const {
    mapGetters: mapOriginGetters,
} = createNamespacedHelpers('profileCreate/origin');

export default __createMocks();
