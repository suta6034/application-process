import * as actionTypes from '../../action-types';
import * as mutationTypes from '../../mutation-types';

export const actions = {
    [actionTypes.FETCH_USER]: jest.fn(),
};

export const mutations = {
    [mutationTypes.SET_USER]: jest.fn(),
};

export const getters = {
    confirmed: state => state.attributes.isConfirmed,
};

export const state = {
    id: null,
    attributes: {
        isConfirmed: false,
    },
};

// eslint-disable-next-line no-underscore-dangle
export function __createMocks(custom = { actions: {}, mutations: {}, getters: {}, state: {} }) {
    const mockActions = { ...actions, ...custom.actions };
    const mockMutations = { ...mutations, ...custom.mutations };
    const mockGetters = { ...getters, ...custom.getters };
    const mockState = { ...state, ...custom.state };

    return {
        namespaced: true,
        actions: mockActions,
        mutations: mockMutations,
        getters: mockGetters,
        state: mockState,
    };
}

export default __createMocks();
