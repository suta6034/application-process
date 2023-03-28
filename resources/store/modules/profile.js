import {
    createHelpers,
    getField,
    updateField,
} from 'vuex-map-fields';
import {
    createNamespacedHelpers,
} from 'vuex';

import {
    apiErrorShouldBeReported,
} from '../../utils/api';
import {
    ACTIONS,
    EVENTS,
    track,
} from '../../utils/tracking';

// eslint-disable-next-line import/no-cycle
import {
    commitAndShowModal,
} from '../../utils/error';
import {
    createProfile,
} from '../../models/Profile';
import {
    educationCategoriesGet,
    educationTypesGet,
} from '../../services/education';
import {
    profileCreate,
    profileGet,
    updateProfileMeta,
} from '../../services/profile';
import * as actionTypes from '../action-types';
import * as mutationTypes from '../mutation-types';

import attachment from './forms/attachment';
import award from './forms/award';
import basics from './forms/basics';
import blacklist from './forms/blacklist';
import desiredJob from './forms/desired-job';
import education from './forms/education';
import interest from './forms/interest';
import language from './forms/language';
import origin from './origin';
import profileText from './forms/profile-text';
import project from './forms/project';
import skill from './forms/skill';
import softSkill from './forms/soft-skill';
import statement from './forms/statement';
import training from './forms/training';
import work from './forms/work';

function updateFormModules({ commit, response }) {
    const {
        desiredJob: desiredJobData,
        profileText: profileTextData,
        attachments: attachmentData,
        awards: awardData,
        basics: basicsData,
        blacklist: blacklistData,
        educations: educationData,
        interests: interestData,
        languages: languageData,
        origin: originData,
        projects: projectData,
        skills: skillData,
        softSkills: softSkillData,
        statement: statementData,
        trainings: trainingData,
        work: workData,
    } = response?.data.data.attributes ?? {};

    if (attachmentData) commit(`attachment/${mutationTypes.UPDATE_FROM_QUERY}`, attachmentData);
    if (awardData) commit(`award/${mutationTypes.UPDATE_FROM_QUERY}`, awardData);
    if (basicsData) commit(`basics/${mutationTypes.UPDATE_FROM_QUERY}`, basicsData);
    if (blacklistData) commit(`blacklist/${mutationTypes.UPDATE_FROM_QUERY}`, blacklistData);
    if (desiredJobData) commit(`desiredJob/${mutationTypes.UPDATE_FROM_QUERY}`, desiredJobData);
    if (desiredJobData?.objectives?.length) {
        // If the user already has a minimal profile, we want to preserve their
        // desired job and make it available in the create process.
        commit(`profileCreate/desiredJob/${mutationTypes.UPDATE_FROM_QUERY}`, desiredJobData, { root: true });
    }
    if (educationData) commit(`education/${mutationTypes.UPDATE_FROM_QUERY}`, educationData);
    if (interestData) commit(`interest/${mutationTypes.UPDATE_FROM_QUERY}`, interestData);
    if (languageData) commit(`language/${mutationTypes.UPDATE_FROM_QUERY}`, languageData);
    if (originData) commit(`origin/${mutationTypes.SET_ORIGIN}`, originData);
    commit(`profileText/${mutationTypes.UPDATE_FROM_QUERY}`, profileTextData);
    if (projectData) commit(`project/${mutationTypes.UPDATE_FROM_QUERY}`, projectData);
    if (skillData) commit(`skill/${mutationTypes.UPDATE_FROM_QUERY}`, skillData);
    if (skillData?.length) {
        // If the user already has a minimal profile, we want to preserve their
        // skills and make them available in the create process.
        commit(`profileCreate/skill/${mutationTypes.UPDATE_FROM_QUERY}`, skillData, { root: true });
    }
    if (softSkillData) commit(`softSkill/${mutationTypes.UPDATE_FROM_QUERY}`, softSkillData);
    commit(`statement/${mutationTypes.UPDATE_FROM_QUERY}`, statementData);
    if (trainingData) commit(`training/${mutationTypes.UPDATE_FROM_QUERY}`, trainingData);
    if (workData) commit(`work/${mutationTypes.UPDATE_FROM_QUERY}`, workData);
}

function updateMetadata({ commit, response }) {
    commit(mutationTypes.SET_PROFILE_ID, response.data.data.id);
    commit(mutationTypes.SET_PROFILE_FLAGS, response.data.data.attributes.flags);
    commit(mutationTypes.SET_PROFILE_META, response.data.meta);
    commit(mutationTypes.SET_PROFILE_FETCHED, Date.now());
}

const actions = {
    async [actionTypes.CREATE_PROFILE]({ commit }, { profileData = null, hash = null } = {}) {
        try {
            commit(mutationTypes.SET_PROFILE_FETCHED, null);
            commit(mutationTypes.SET_PROFILE_CREATED, null);

            const queryParameters = hash && { hash };
            const response = await profileCreate(profileData, queryParameters);
            if (!response) return;

            updateFormModules({ commit, response });
            updateMetadata({ commit, response });

            commit(mutationTypes.SET_PROFILE_IMAGE, response.data.data.attributes.image);
            commit(mutationTypes.SET_PROFILE_CREATED, Date.now());
        } catch (error) {
            commit(mutationTypes.SET_PROFILE_FETCHED, false);
            commit(mutationTypes.SET_PROFILE_CREATED, false);
            // Temporarily log profile data because of
            // http://sentry.log.karriere.at/kat/karriereat-karl/issues/53624/
            // remove if the bug is fixed!
            commitAndShowModal(commit, error, profileData);
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
    async [actionTypes.FETCH_PROFILE]({ commit }) {
        try {
            commit(mutationTypes.SET_PROFILE_FETCHED, null);

            const response = await profileGet();
            if (!response) return;

            updateFormModules({ commit, response });
            updateMetadata({ commit, response });

            commit(mutationTypes.SET_PROFILE_IMAGE, response.data.data.attributes.image);
        } catch (error) {
            commit(mutationTypes.SET_PROFILE_FETCHED, false);
        }
    },
    async [actionTypes.UPDATE_PROFILE]({ commit }, profileData) {
        try {
            commit(mutationTypes.SET_PROFILE_FETCHED, null);

            const response = await profileCreate(profileData);
            if (!response) return;

            updateFormModules({ commit, response });
            updateMetadata({ commit, response });

            commit(mutationTypes.SET_PROFILE_IMAGE, response.data.data.attributes.image);
        } catch (error) {
            commit(mutationTypes.SET_PROFILE_FETCHED, false);
            // Temporarily log profile data because of
            // http://sentry.log.karriere.at/kat/karriereat-karl/issues/53624/
            // remove if the bug is fixed!
            commitAndShowModal(commit, error, profileData);
        }
    },
    async [actionTypes.UPDATE_ACTIVE_STATUS]({ commit, dispatch, getters }, status) {
        commit(mutationTypes.SET_PROFILE_FLAGS, { isActive: status });
        await dispatch(actionTypes.UPDATE_PROFILE, getters.model);

        track({
            event: EVENTS.profileStatus,
            action: ACTIONS.conversion,
            label: status ? 'on' : 'off',
        });

        track({
            event: EVENTS.statusChange,
            element: 'Profile',
            elementDetail: status ? 'on' : 'off',
            ga4Event: true,
        });
    },
    async [actionTypes.UPDATE_HAS_WORK_EXPERIENCE_STATUS]({ commit, dispatch, getters }, status) {
        commit(mutationTypes.SET_PROFILE_FLAGS, { hasWorkExperience: status });
        await dispatch(actionTypes.UPDATE_PROFILE, getters.model);
    },
    async [actionTypes.UPDATE_HAS_SEEN_BOOSTER]({ commit }, profileMeta) {
        commit(mutationTypes.SET_PROFILE_FLAGS, { hasSeenBooster: Date.now() });
        await updateProfileMeta(profileMeta);
    },
};

const mutations = {
    updateField,
    [mutationTypes.SET_PROFILE_CREATED](state, time) {
        state.created = time;
    },
    [mutationTypes.SET_PROFILE_FETCHED](state, time) {
        state.fetched = time;
    },
    [mutationTypes.SET_PROFILE_ID](state, id) {
        state.id = id;
    },
    [mutationTypes.SET_PROFILE_FLAGS](state, flags) {
        if (flags.isActive !== undefined) {
            state.active = flags.isActive;
        }
        if (flags.hasWorkExperience !== undefined) {
            state.hasWorkExperience = flags.hasWorkExperience;
        }
        if (flags.exists !== undefined) {
            state.exists = flags.exists;
        }
        if (flags.hasSeenBooster !== undefined) {
            state.hasSeenBooster = flags.hasSeenBooster;
        }
        if (flags.boosterCounter !== undefined) {
            state.boosterCounter = flags.boosterCounter;
        }
    },
    [mutationTypes.SET_PROFILE_IMAGE](state, image) {
        state.image = image;
    },
    [mutationTypes.SET_PROFILE_META](state, meta) {
        state.completeness = meta.completeness;
    },
    [mutationTypes.SET_EDUCATION_CATEGORIES](state, { educationCategories }) {
        state.educationCategories = educationCategories;
    },
    [mutationTypes.SET_EDUCATION_TYPES](state, { educationTypes }) {
        state.educationTypes = educationTypes;
    },
    [mutationTypes.SET_FORM_DIRTY](state, value) {
        state.anyFormDirty = value;
    },
    [mutationTypes.SET_FORM_ACTIVE](state, value) {
        state.activeForm = value;
    },
    [mutationTypes.SET_NEW_FORM_ACTIVE](state, value) {
        state.newFormIsActive = value;
    },
    [mutationTypes.TRIGGER_CANCEL](state, timestamp) {
        state.cancelTimestamp = timestamp;
    },
};

const getters = {
    getField,
    created(state) {
        return state.created !== null;
    },
    fetched(state) {
        return state.fetched !== null;
    },
    imageVersion(state) {
        return version => state.image.find(x => x.version === version);
    },
    isValid(state) {
        return !!state.basics.email;
    },
    model(state, instanceGetters) {
        return createProfile({
            awards: instanceGetters['award/models'],
            basics: instanceGetters['basics/model'],
            blacklist: state.blacklist,
            desiredJob: instanceGetters['desiredJob/model'],
            educations: instanceGetters['education/models'],
            flags: {
                isActive: state.active,
                hasWorkExperience: state.hasWorkExperience,
                hasSeenBooster: state.hasSeenBooster,
                boosterCounter: state.boosterCounter,
            },
            interests: instanceGetters['interest/models'],
            languages: instanceGetters['language/models'],
            origin: state.origin.origin,
            profileText: state.profileText.profileText,
            projects: instanceGetters['project/models'],
            skills: instanceGetters['skill/models'],
            softSkills: instanceGetters['softSkill/models'],
            statement: state.statement.statement,
            trainings: instanceGetters['training/models'],
            work: instanceGetters['work/models'],
        });
    },
};

const state = {
    id: null,
    active: false,
    activeForm: false,
    anyFormDirty: false,
    boosterCounter: 0,
    cancelTimestamp: 0,
    completeness: 0,
    created: null,
    educationCategories: [],
    educationTypes: [],
    exists: false,
    fetched: null,
    hasSeenBooster: false,
    hasWorkExperience: false,
    image: [],
    newFormIsActive: false,
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

export const { mapMultiRowFields: mapAwardMultiRowFields } = createHelpers({
    getterType: 'profile/award/getField',
    mutationType: 'profile/award/updateField',
});

export const { mapFields } = createHelpers({
    getterType: 'profile/getField',
    mutationType: 'profile/updateField',
});

export const { mapFields: mapAttachmentFields } = createHelpers({
    getterType: 'profile/attachment/getField',
    mutationType: 'profile/attachment/updateField',
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

export const { mapFields: mapInterestFields } = createHelpers({
    getterType: 'profile/interest/getField',
    mutationType: 'profile/interest/updateField',
});

export const { mapFields: mapProfileTextFields } = createHelpers({
    getterType: 'profile/profileText/getField',
    mutationType: 'profile/profileText/updateField',
});

export const { mapFields: mapSkillFields } = createHelpers({
    getterType: 'profile/skill/getField',
    mutationType: `profile/skill/${mutationTypes.UPDATE}`,
});

export const { mapFields: mapSoftSkillFields } = createHelpers({
    getterType: 'profile/softSkill/getField',
    mutationType: 'profile/softSkill/updateField',
});

export const { mapFields: mapStatementFields } = createHelpers({
    getterType: 'profile/statement/getField',
    mutationType: 'profile/statement/updateField',
});

export const { mapFields: mapOriginFields } = createHelpers({
    getterType: 'profile/origin/getField',
    mutationType: 'profile/origin/updateField',
});

export const { mapFields: mapLanguageFields } = createHelpers({
    getterType: 'profile/language/getField',
    mutationType: `profile/language/${mutationTypes.UPDATE}`,
});

export const { mapMultiRowFields: mapEducationMultiRowFields } = createHelpers({
    getterType: 'profile/education/getField',
    mutationType: 'profile/education/updateField',
});

export const { mapMultiRowFields: mapProjectMultiRowFields } = createHelpers({
    getterType: 'profile/project/getField',
    mutationType: 'profile/project/updateField',
});

export const { mapMultiRowFields: mapTrainingMultiRowFields } = createHelpers({
    getterType: 'profile/training/getField',
    mutationType: 'profile/training/updateField',
});

export const { mapMultiRowFields: mapWorkMultiRowFields } = createHelpers({
    getterType: 'profile/work/getField',
    mutationType: 'profile/work/updateField',
});

export const { mapMutations: mapAwardMutations } = createNamespacedHelpers('profile/award');

export const {
    mapState: mapBasicsState,
    mapMutations: mapBasicsMutations,
} = createNamespacedHelpers('profile/basics');

export const { mapMutations: mapEducationMutations } = createNamespacedHelpers('profile/education');

export const { mapMutations: mapProjectMutations } = createNamespacedHelpers('profile/project');

export const { mapMutations: mapTrainingMutations } = createNamespacedHelpers('profile/training');

export const { mapMutations: mapWorkMutations } = createNamespacedHelpers('profile/work');

export const profile = {
    namespaced: true,
    actions,
    mutations,
    getters,
    state,
    modules,
};
