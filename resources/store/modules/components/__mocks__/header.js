import * as mutationTypes from '../../../mutation-types';
import * as actionTypes from '../../../action-types';

const mutations = {
    [mutationTypes.SET_HEADER_RESPONSE]: jest.fn(),
    [mutationTypes.SET_HEADER_EXPIRE_TIME]: jest.fn(),
    [mutationTypes.SET_HEADER_HASH]: jest.fn(),
};

const actions = {
    [actionTypes.FETCH_HEADER]: jest.fn(),
};

const state = {
    response: null,
    hash: null,
    expireTime: 0,
};

export default {
    namespaced: true,
    actions,
    mutations,
    state,
};
