import merge from 'lodash/merge';

import * as actionTypes from '../../action-types';
import * as mutationTypes from '../../mutation-types';

const actions = {
    [actionTypes.FETCH_MINITASKS]: jest.fn(),
    [actionTypes.SET_MINITASK_SUCCESS_STATUS]: jest.fn(),
    [actionTypes.SET_MINITASK_BIRTHDATE_SKIPPED]: jest.fn(),
    [actionTypes.SET_MINITASK_ADDRESS_SKIPPED]: jest.fn(),
    [actionTypes.SET_MINITASK_IMAGE_SKIPPED]: jest.fn(),
    [actionTypes.SET_MINITASK_DESIREDJOBEMPLOYMENTTYPE_SKIPPED]: jest.fn(),
    [actionTypes.SET_MINITASK_DESIREDJOBJOBFIELD_SKIPPED]: jest.fn(),
    [actionTypes.SET_MINITASK_DESIREDJOBTRAVELREADINESS_SKIPPED]: jest.fn(),
    [actionTypes.SET_MINITASK_DESIREDJOBWORKFROMHOME_SKIPPED]: jest.fn(),
    [actionTypes.SET_MINITASK_LANGUAGE_SKIPPED]: jest.fn(),
    [actionTypes.SET_MINITASK_WORK_SKIPPED]: jest.fn(),
    [actionTypes.SET_MINITASK_JOBTITLE_SKIPPED]: jest.fn(),
    [actionTypes.SET_MINITASK_JOBFIELD_SKIPPED]: jest.fn(),
    [actionTypes.SET_MINITASK_VISIBILITY_SKIPPED]: jest.fn(),
};

const mutations = {
    [mutationTypes.SET_MINITASK_SUCCESS_STATUS]: jest.fn(),
    [mutationTypes.SET_MINITASK_BIRTHDATE_SKIPPED]: jest.fn(),
    [mutationTypes.SET_MINITASK_ADDRESS_SKIPPED]: jest.fn(),
    [mutationTypes.SET_MINITASK_IMAGE_SKIPPED]: jest.fn(),
    [mutationTypes.SET_MINITASK_DESIREDJOBEMPLOYMENTTYPE_SKIPPED]: jest.fn(),
    [mutationTypes.SET_MINITASK_DESIREDJOBJOBFIELD_SKIPPED]: jest.fn(),
    [actionTypes.SET_MINITASK_DESIREDJOBTRAVELREADINESS_SKIPPED]: jest.fn(),
    [actionTypes.SET_MINITASK_DESIREDJOBWORKFROMHOME_SKIPPED]: jest.fn(),
    [mutationTypes.SET_MINITASK_LANGUAGE_SKIPPED]: jest.fn(),
    [mutationTypes.SET_MINITASK_WORK_SKIPPED]: jest.fn(),
    [mutationTypes.SET_MINITASK_JOBTITLE_SKIPPED]: jest.fn(),
    [mutationTypes.SET_MINITASK_JOBFIELD_SKIPPED]: jest.fn(),
    [mutationTypes.SET_MINITASK_VISIBILITY_SKIPPED]: jest.fn(),
    [mutationTypes.SET_MINITASKS]: jest.fn(),
};

const getters = {
    birthdateDisplayStatus: (state, gttrs, rootState) => !rootState.profile.basics.birthdate,
    addressDisplayStatus: (state, gttrs, rootState) => !rootState.profile.basics.town
        && !rootState.profile.basics.street,
    imageDisplayStatus: (state, gttrs, rootState) => !rootState.profile.image[0],
    telephoneDisplayStatus: (state, gttrs, rootState) => !rootState.profile.basics.mobile,
    desiredJobEmploymentTypeDisplayStatus: (state, gttrs, rootState) => !rootState.profile.desiredJob.employment[0],
    desiredJobJobfieldDisplayStatus: (state, gttrs, rootState) => !rootState.profile.desiredJob.jobFields[0],
    desiredJobTravelReadinessDisplayStatus(state, gttrs, rootState) {
        return rootState.profile.desiredJob.travelReadiness.value === null;
    },
    desiredJobWorkFromHomeDisplayStatus(state, gttrs, rootState) {
        return rootState.profile.desiredJob.workFromHome.value === null;
    },
    languageDisplayStatus: (state, gttrs, rootState) => !rootState.profile.language.rows[0],
    workDisplayStatus: (state, gttrs, rootState) => !rootState.profile.work.rows[1],
    softSkillsSkippedStatus: (state, gttrs, rootState) => !rootState.profile.softSkill.rows[0],
    jobTitleDisplayStatus: (state, gttrs, rootState) => !rootState.profile.jobTitle,
    jobFieldDisplayStatus: (state, gttrs, rootState) => !rootState.profile.jobField,
    visibilityDisplayStatus: (state, gttrs, rootState) => !rootState.profile.active
        && rootState.profile.completeness >= 50,
    successDisplayStatus: state => !state.meta.hideSuccess && state.meta.showSuccess,
};

const state = {
    meta: {
        uuid: null,
        skipped: null,
    },
    data: {
        birthdate: null,
        address: null,
        image: null,
        desiredJobEmploymentType: null,
        desiredJobJobfield: null,
        langauge: null,
        work: null,
        jobTitle: null,
        jobField: null,
        visibility: null,
    },
};

// eslint-disable-next-line no-underscore-dangle
export function __createMocks(custom = { actions: {}, mutations: {}, getters: {}, state: {} }) {
    const mockActions = merge({}, actions, custom.actions);
    const mockMutations = merge({}, mutations, custom.mutations);
    const mockGetters = merge({}, getters, custom.getters);
    const mockState = merge({}, state, custom.state);

    return {
        namespaced: true,
        actions: mockActions,
        mutations: mockMutations,
        getters: mockGetters,
        state: mockState,
    };
}

export default __createMocks();
