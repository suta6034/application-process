import * as mutationTypes from '../../mutation-types';

export const mutations = {
    [mutationTypes.SET_NOTIFICATIONS]: jest.fn(),
};

export const state = {
    alarm: false,
    applications: false,
    companies: false,
    cv: false,
    matching: false,
    messages: false,
};

// eslint-disable-next-line no-underscore-dangle
export function __createMocks(custom = { mutations: {}, state: {} }) {
    const mockMutations = { ...mutations, ...custom.mutations };
    const mockState = { ...state, ...custom.state };

    return {
        namespaced: true,
        mutations: mockMutations,
        state: mockState,
    };
}

export default __createMocks();
