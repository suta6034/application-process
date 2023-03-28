import {
    createNamespacedHelpers,
} from 'vuex';
import * as actionTypes from '../action-types';
import * as mutationTypes from '../mutation-types';
import * as minitaskService from '../../services/minitask';

const DEFAULT = {
    meta: {
        uuid: null,
        hideSuccess: null,
        showSuccess: null,
        skipped: null,
    },
    data: {
        birthdate: null,
        mobile: null,
        image: null,
        address: null,
        desiredJobEmploymentType: null,
        desiredJobJobfield: null,
        desiredJobTravelReadiness: null,
        desiredJobWorkFromHome: null,
        language: null,
        work: null,
        softSkills: null,
        jobTitle: null,
        jobField: null,
        visibility: null,
    },
};

function checkSkipStatus(skipDate) {
    if (!skipDate) return false;

    const skippedExpiredDate = new Date(skipDate);
    skippedExpiredDate.setDate(skippedExpiredDate.getDate() + 14);

    return skippedExpiredDate > new Date();
}

const actions = {
    [actionTypes.FETCH_MINITASKS]({ commit }, data) {
        const minitasks = minitaskService.getMinitasks(data.uuid);
        if (minitasks) {
            commit(mutationTypes.SET_MINITASKS, minitasks);
        }
        data.callback();
    },
    [actionTypes.SET_MINITASK_SUCCESS_STATUS]({ commit }) {
        commit(mutationTypes.SET_MINITASK_SUCCESS_STATUS);
    },
    [actionTypes.SET_MINITASK_SUCCESS_HIDE]({ commit }) {
        commit(mutationTypes.SET_MINITASK_SUCCESS_HIDE);
    },
    [actionTypes.SET_MINITASK_BIRTHDATE_SKIPPED]({ commit }) {
        minitaskService.setMinitaskSkipped('birthdate', new Date());
        commit(mutationTypes.SET_MINITASK_BIRTHDATE_SKIPPED, new Date());
    },
    [actionTypes.SET_MINITASK_IMAGE_SKIPPED]({ commit }) {
        minitaskService.setMinitaskSkipped('image', new Date());
        commit(mutationTypes.SET_MINITASK_IMAGE_SKIPPED, new Date());
    },
    [actionTypes.SET_MINITASK_ADDRESS_SKIPPED]({ commit }) {
        minitaskService.setMinitaskSkipped('address', new Date());
        commit(mutationTypes.SET_MINITASK_ADDRESS_SKIPPED, new Date());
    },
    [actionTypes.SET_MINITASK_DESIREDJOBEMPLOYMENTTYPE_SKIPPED]({ commit }) {
        minitaskService.setMinitaskSkipped('desiredJobEmploymentType', new Date());
        commit(mutationTypes.SET_MINITASK_DESIREDJOBEMPLOYMENTTYPE_SKIPPED, new Date());
    },
    [actionTypes.SET_MINITASK_DESIREDJOBJOBFIELD_SKIPPED]({ commit }) {
        minitaskService.setMinitaskSkipped('desiredJobJobfield', new Date());
        commit(mutationTypes.SET_MINITASK_DESIREDJOBJOBFIELD_SKIPPED, new Date());
    },
    [actionTypes.SET_MINITASK_DESIREDJOBTRAVELREADINESS_SKIPPED]({ commit }) {
        minitaskService.setMinitaskSkipped('desiredJobTravelReadiness', new Date());
        commit(mutationTypes.SET_MINITASK_DESIREDJOBTRAVELREADINESS_SKIPPED, new Date());
    },
    [actionTypes.SET_MINITASK_DESIREDJOBWORKFROMHOME_SKIPPED]({ commit }) {
        minitaskService.setMinitaskSkipped('desiredJobWorkFromHome', new Date());
        commit(mutationTypes.SET_MINITASK_DESIREDJOBWORKFROMHOME_SKIPPED, new Date());
    },
    [actionTypes.SET_MINITASK_LANGUAGE_SKIPPED]({ commit }) {
        minitaskService.setMinitaskSkipped('language', new Date());
        commit(mutationTypes.SET_MINITASK_LANGUAGE_SKIPPED, new Date());
    },
    [actionTypes.SET_MINITASK_TELEPHONE_SKIPPED]({ commit }) {
        minitaskService.setMinitaskSkipped('mobile', new Date());
        commit(mutationTypes.SET_MINITASK_TELEPHONE_SKIPPED, new Date());
    },
    [actionTypes.SET_MINITASK_WORK_SKIPPED]({ commit }) {
        minitaskService.setMinitaskSkipped('work', new Date());
        commit(mutationTypes.SET_MINITASK_WORK_SKIPPED, new Date());
    },
    [actionTypes.SET_MINITASK_JOBTITLE_SKIPPED]({ commit }) {
        minitaskService.setMinitaskSkipped('jobTitle', new Date());
        commit(mutationTypes.SET_MINITASK_JOBTITLE_SKIPPED, new Date());
    },
    [actionTypes.SET_MINITASK_JOBFIELD_SKIPPED]({ commit }) {
        minitaskService.setMinitaskSkipped('jobField', new Date());
        commit(mutationTypes.SET_MINITASK_JOBFIELD_SKIPPED, new Date());
    },
    [actionTypes.SET_MINITASK_VISIBILITY_SKIPPED]({ commit }) {
        minitaskService.setMinitaskSkipped('visibility', new Date());
        commit(mutationTypes.SET_MINITASK_VISIBILITY_SKIPPED, new Date());
    },
    [actionTypes.SET_MINITASK_SOFT_SKILLS_SKIPPED]({ commit }) {
        minitaskService.setMinitaskSkipped('softSkills', new Date());
        commit(mutationTypes.SET_MINITASK_SOFT_SKILLS_SKIPPED, new Date());
    },
};

const mutations = {
    [mutationTypes.SET_MINITASK_SUCCESS_STATUS](state) {
        // eslint-disable-next-line no-param-reassign
        state.meta.showSuccess = true;
    },
    [mutationTypes.SET_MINITASK_SUCCESS_HIDE](state) {
        // eslint-disable-next-line no-param-reassign
        state.meta.hideSuccess = true;
    },
    [mutationTypes.SET_MINITASK_BIRTHDATE_SKIPPED](state, date) {
        // eslint-disable-next-line no-param-reassign
        state.data.birthdate = date;
    },
    [mutationTypes.SET_MINITASK_IMAGE_SKIPPED](state, date) {
        // eslint-disable-next-line no-param-reassign
        state.data.image = date;
    },
    [mutationTypes.SET_MINITASK_ADDRESS_SKIPPED](state, date) {
        // eslint-disable-next-line no-param-reassign
        state.data.address = date;
    },
    [mutationTypes.SET_MINITASK_DESIREDJOBEMPLOYMENTTYPE_SKIPPED](state, date) {
        // eslint-disable-next-line no-param-reassign
        state.data.desiredJobEmploymentType = date;
    },
    [mutationTypes.SET_MINITASK_DESIREDJOBJOBFIELD_SKIPPED](state, date) {
        // eslint-disable-next-line no-param-reassign
        state.data.desiredJobJobfield = date;
    },
    [mutationTypes.SET_MINITASK_DESIREDJOBTRAVELREADINESS_SKIPPED](state, date) {
        // eslint-disable-next-line no-param-reassign
        state.data.desiredJobTravelReadiness = date;
    },
    [mutationTypes.SET_MINITASK_DESIREDJOBWORKFROMHOME_SKIPPED](state, date) {
        // eslint-disable-next-line no-param-reassign
        state.data.desiredJobWorkFromHome = date;
    },
    [mutationTypes.SET_MINITASK_LANGUAGE_SKIPPED](state, date) {
        // eslint-disable-next-line no-param-reassign
        state.data.language = date;
    },
    [mutationTypes.SET_MINITASK_TELEPHONE_SKIPPED](state, date) {
        // eslint-disable-next-line no-param-reassign
        state.data.mobile = date;
    },
    [mutationTypes.SET_MINITASK_WORK_SKIPPED](state, date) {
        // eslint-disable-next-line no-param-reassign
        state.data.work = date;
    },
    [mutationTypes.SET_MINITASK_JOBTITLE_SKIPPED](state, date) {
        // eslint-disable-next-line no-param-reassign
        state.data.jobTitle = date;
    },
    [mutationTypes.SET_MINITASK_JOBFIELD_SKIPPED](state, date) {
        // eslint-disable-next-line no-param-reassign
        state.data.jobField = date;
    },
    [mutationTypes.SET_MINITASK_VISIBILITY_SKIPPED](state, date) {
        // eslint-disable-next-line no-param-reassign
        state.data.visibility = date;
    },
    [mutationTypes.SET_MINITASK_SOFT_SKILLS_SKIPPED](state, date) {
        // eslint-disable-next-line no-param-reassign
        state.data.softSkills = date;
    },
    [mutationTypes.SET_MINITASKS](state, minitasks) {
        /* eslint-disable no-param-reassign */
        state.meta.skipped = minitasks.meta.skipped;
        state.meta.uuid = minitasks.meta.uuid;
        state.data.birthdate = minitasks.data.birthdate;
        state.data.image = minitasks.data.image;
        state.data.address = minitasks.data.address;
        state.data.desiredJobEmploymentType = minitasks.data.desiredJobEmploymentType;
        state.data.desiredJobJobfield = minitasks.data.desiredJobJobfield;
        state.data.desiredJobTravelReadiness = minitasks.data.desiredJobTravelReadiness;
        state.data.desiredJobWorkFromHome = minitasks.data.desiredJobWorkFromHome;
        state.data.language = minitasks.data.language;
        state.data.mobile = minitasks.data.mobile;
        state.data.work = minitasks.data.work;
        state.data.softSkills = minitasks.data.softSkills;
        state.data.jobTitle = minitasks.data.jobTitle;
        state.data.jobField = minitasks.data.jobField;
        state.data.visibility = minitasks.data.visibility;
        /* eslint-enable */
    },
};

const getters = {
    /* eslint-disable no-shadow */
    addressDisplayStatus(state, getters, rootState) {
        return rootState.profile.basics.town && !rootState.profile.basics.street
            && !checkSkipStatus(state.data.address);
    },
    birthdateDisplayStatus(state, getters, rootState) {
        return !rootState.profile.basics.birthdate && !checkSkipStatus(state.data.birthdate);
    },
    imageDisplayStatus(state, getters, rootState) {
        return !rootState.profile.image[0] && !checkSkipStatus(state.data.image);
    },
    desiredJobEmploymentTypeDisplayStatus(state, getters, rootState) {
        return !rootState.profile.desiredJob.employment[0] && !checkSkipStatus(state.data.desiredJobEmploymentType);
    },
    desiredJobJobfieldDisplayStatus(state, getters, rootState) {
        return !rootState.profile.desiredJob.jobFields[0] && !checkSkipStatus(state.data.desiredJobJobfield);
    },
    desiredJobTravelReadinessDisplayStatus(state, getters, rootState) {
        return (rootState.profile.desiredJob.travelReadiness.value === null)
            && !checkSkipStatus(state.data.desiredJobTravelReadiness);
    },
    desiredJobWorkFromHomeDisplayStatus(state, getters, rootState) {
        return (rootState.profile.desiredJob.workFromHome.value === null)
            && !checkSkipStatus(state.data.desiredJobWorkFromHome);
    },
    languageDisplayStatus(state, getters, rootState) {
        return !rootState.profile.language.rows[0] && !checkSkipStatus(state.data.language);
    },
    telephoneDisplayStatus(state, getters, rootState) {
        return !rootState.profile.basics.mobile && !checkSkipStatus(state.data.mobile);
    },
    workDisplayStatus(state, getters, rootState) {
        return !rootState.profile.work.rows[1] && !checkSkipStatus(state.data.work);
    },
    softSkillsSkippedStatus(state) {
        return !checkSkipStatus(state.data.softSkills);
    },
    jobTitleDisplayStatus(state, getters, rootState) {
        return !rootState.profile.jobTitle && !checkSkipStatus(state.data.jobTitle);
    },
    jobFieldDisplayStatus(state, getters, rootState) {
        return !rootState.profile.jobField && !checkSkipStatus(state.data.jobField);
    },
    visibilityDisplayStatus(state, getters, rootState) {
        return !rootState.profile.active && !checkSkipStatus(state.data.visibility)
            && rootState.profile.completeness >= 50;
    },
    /* eslint-enable */
    successDisplayStatus(state) {
        return !state.meta.hideSuccess && state.meta.showSuccess;
    },
};

const state = () => ({ ...DEFAULT });

export const { mapState: mapMinitaskState } = createNamespacedHelpers('minitask');

export const minitask = {
    namespaced: true,
    actions,
    mutations,
    getters,
    state,
};
