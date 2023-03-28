import merge from 'lodash/merge';

import {
    createNamespacedHelpers,
} from 'vuex';
import * as mutationTypes from '../../mutation-types';
import * as actionTypes from '../../action-types';

const actions = {
    [actionTypes.FETCH_TEMPLATE_SETTINGS]: jest.fn(),
    [actionTypes.CREATE_TEMPLATE_SETTINGS]: jest.fn(),
    [actionTypes.UPDATE_TEMPLATE_SETTINGS]: jest.fn(),
};

const mutations = {
    [mutationTypes.SET_TEMPLATE_SETTINGS]: jest.fn(),
    [mutationTypes.SET_TEMPLATE_SETTINGS_BY_KEY]: jest.fn(),
    [mutationTypes.SET_MODIFIED]: jest.fn(),
};

const state = {
    modified: false,
    settings: {
        template: 'vegan',
        color: 'blu-gre',
        font: 'not-not',
        educationFirst: false,
    },
};

const getters = {
    templateSettings: jest.fn(),
};

// eslint-disable-next-line no-underscore-dangle
export function __createMocks(custom = { actions: {}, getters: {}, mutations: {}, state: {} }) {
    const mockActions = merge({}, actions, custom.actions);
    const mockMutations = merge({}, mutations, custom.mutations);
    const mockGetters = merge({}, getters, custom.getters);
    const mockState = merge({}, state, custom.state);

    return {
        namespaced: true,
        actions: mockActions,
        getters: mockGetters,
        mutations: mockMutations,
        state: mockState,
    };
}

export const { mapState: mapTemplateSettingsState } = createNamespacedHelpers('templateSettings');

export default __createMocks();
