import {
    createNamespacedHelpers,
} from 'vuex';
import * as mutationTypes from '../mutation-types';

const mutations = {
    [mutationTypes.SET_NOTIFICATIONS](state, notifications) {
        /* eslint-disable no-param-reassign */
        state.alarm = notifications.alarm;
        state.applications = notifications.applications;
        state.companies = notifications.companies;
        state.cv = notifications.cv;
        state.matching = notifications.matching;
        state.messages = notifications.messages;
        /* eslint-enable */
    },
};

const state = {
    alarm: false,
    applications: false,
    companies: false,
    cv: false,
    matching: false,
    messages: false,
};

export const { mapState: mapNotificationState } = createNamespacedHelpers('notification');

export const notification = {
    namespaced: true,
    mutations,
    state,
};
