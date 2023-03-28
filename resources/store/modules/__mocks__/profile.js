import {
    createNamespacedHelpers,
} from 'vuex';
import {
    createHelpers,
    getField,
    updateField,
} from 'vuex-map-fields';
import merge from 'lodash/merge';

import * as actionTypes from '../../action-types';
import * as mutationTypes from '../../mutation-types';

import attachment from '../forms/attachment';
import award from '../forms/award';
import basics from '../forms/basics';
import blacklist from '../forms/blacklist';
import desiredJob from '../forms/desired-job';
import education from '../forms/education';
import interest from '../forms/interest';
import language from '../forms/language';

import origin from '../origin';
import profileText from '../forms/profile-text';
import project from '../forms/project';
import skill from '../forms/skill';
import softSkill from '../forms/soft-skill';
import statement from '../forms/statement';
import training from '../forms/training';
import work from '../forms/work';

const actions = {
    [actionTypes.CREATE_PROFILE]: jest.fn(),
    [actionTypes.FETCH_PROFILE]: jest.fn(),
    [actionTypes.UPDATE_ACTIVE_STATUS]: jest.fn(),
    [actionTypes.UPDATE_PROFILE]: jest.fn(),
    [actionTypes.UPDATE_HAS_WORK_EXPERIENCE_STATUS]: jest.fn(),
    [actionTypes.UPDATE_HAS_SEEN_BOOSTER]: jest.fn(),
    fetchEducationCategories: jest.fn(),
    fetchEducationTypes: jest.fn(),
};

const mutations = {
    updateField,
    [mutationTypes.SET_FORM_ACTIVE]: jest.fn(),
    [mutationTypes.SET_FORM_DIRTY]: jest.fn(),
    [mutationTypes.SET_NEW_FORM_ACTIVE]: jest.fn(),
    [mutationTypes.SET_PROFILE_FLAGS]: jest.fn(),
    [mutationTypes.SET_PROFILE_IMAGE]: jest.fn(),
    [mutationTypes.TRIGGER_CANCEL]: jest.fn(),
};

const getters = {
    cancelTimestamp: jest.fn(),
    created: jest.fn(),
    fetched: jest.fn(),
    getField,
    anyFormDirty: jest.fn(),
    imageVersion: () => jest.fn(),
    isValid: jest.fn(),
    model: jest.fn(),
};

const state = {
    active: false,
    boosterCounter: 0,
    cancelTimestamp: 0,
    completeness: 0,
    created: null,
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
    exists: false,
    fetched: null,
    anyFormDirty: false,
    activeForm: false,
    hasSeenBooster: false,
    hasWorkExperience: false,
    image: [],
    newFormIsActive: false,
    isValid: false,
};

const modules = {
    attachment,
    award,
    basics,
    blacklist,
    desiredJob,
    education,
    interest,
    language,
    origin,
    profileText,
    project,
    skill,
    softSkill,
    statement,
    training,
    work,
};

// eslint-disable-next-line no-underscore-dangle
export function __createMocks(custom = { actions: {}, mutations: {}, getters: {}, state: {}, modules: {} }) {
    const mockActions = merge({}, actions, custom.actions);
    const mockMutations = merge({}, mutations, custom.mutations);
    const mockGetters = merge({}, getters, custom.getters);
    const mockState = merge({}, state, custom.state);
    const mockModules = merge({}, modules, custom.modules);

    return {
        namespaced: true,
        actions: mockActions,
        mutations: mockMutations,
        getters: mockGetters,
        state: mockState,
        modules: mockModules,
    };
}

export const { mapFields } = createHelpers({
    getterType: 'profile/getField',
    mutationType: 'profile/updateField',
});

export const { mapFields: mapAttachmentFields } = createHelpers({
    getterType: 'profile/attachment/getField',
    mutationType: 'profile/attachment/updateField',
});

export const { mapFields: mapAwardFields } = createHelpers({
    getterType: 'profile/award/getField',
    mutationType: 'profile/award/updateField',
});

export const { mapFields: mapBasicsFields } = createHelpers({
    getterType: 'profile/basics/getField',
    mutationType: 'profile/basics/updateField',
});

export const { mapFields: mapBlacklistFields } = createHelpers({
    getterType: 'profile/blacklist/getField',
    mutationType: 'profile/blacklist/updateField',
});

export const { mapFields: mapDesiredJobFields } = createHelpers({
    getterType: 'profile/desiredJob/getField',
    mutationType: 'profile/desiredJob/updateField',
});

export const { mapFields: mapSkillFields } = createHelpers({
    getterType: 'profile/skill/getField',
    mutationType: 'profile/skill/updateField',
});

export const { mapFields: mapSoftSkillFields } = createHelpers({
    getterType: 'profile/softSkill/getField',
    mutationType: 'profile/softSkill/updateField',
});

export const { mapFields: mapLanguageFields } = createHelpers({
    getterType: 'profile/language/getField',
    mutationType: 'profile/language/updateField',
});

export const { mapFields: mapProfileTextFields } = createHelpers({
    getterType: 'profile/profileText/getField',
    mutationType: 'profile/profileText/updateField',
});

export const { mapFields: mapStatementFields } = createHelpers({
    getterType: 'profile/statement/getField',
    mutationType: 'profile/statement/updateField',
});

export const { mapFields: mapOriginFields } = createHelpers({
    getterType: 'profile/origin/getField',
    mutationType: 'profile/origin/updateField',
});

export const { mapMultiRowFields: mapEducationMultiRowFields } = createHelpers({
    getterType: 'profile/education/getField',
    mutationType: 'profile/education/updateField',
});

export const { mapFields: mapInterestFields } = createHelpers({
    getterType: 'profile/interest/getField',
    mutationType: 'profile/interest/updateField',
});

export const { mapMultiRowFields: mapProjectMultiRowFields } = createHelpers({
    getterType: 'profile/project/getField',
    mutationType: 'profile/project/updateField',
});

export const { mapMultiRowFields: mapTrainingMultiRowFields } = createHelpers({
    getterType: 'profile/training/getField',
    mutationType: 'profile/training/updateField',
});

export const { mapMultiRowFields: mapAwardMultiRowFields } = createHelpers({
    getterType: 'profile/award/getField',
    mutationType: 'profile/award/updateField',
});

export const { mapMultiRowFields: mapWorkMultiRowFields } = createHelpers({
    getterType: 'profile/work/getField',
    mutationType: 'profile/work/updateField',
});

export const { mapMutations: mapAwardMutations } = createNamespacedHelpers('profile/award');
export const { mapMutations: mapEducationMutations } = createNamespacedHelpers('profile/education');
export const { mapMutations: mapProjectMutations } = createNamespacedHelpers('profile/project');
export const { mapMutations: mapTrainingMutations } = createNamespacedHelpers('profile/training');
export const { mapMutations: mapWorkMutations } = createNamespacedHelpers('profile/work');

export const {
    mapState: mapBasicsState,
    mapMutations: mapBasicsMutations,
} = createNamespacedHelpers('profile/basics');

export default __createMocks();
