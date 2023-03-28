// eslint-disable-next-line import/no-cycle
import {
    commitAndShowModal,
} from '../../utils/error';
import {
    get,
} from '../../services/user';
import * as actionTypes from '../action-types';
import * as mutationTypes from '../mutation-types';

const actions = {
    async [actionTypes.FETCH_USER]({ commit }) {
        try {
            const user = await get();
            commit(mutationTypes.SET_USER, user.data);
        } catch (error) {
            commitAndShowModal(commit, error);
        }
    },
};

const mutations = {
    [mutationTypes.SET_USER](state, user) {
        /* eslint-disable no-param-reassign */
        state.id = user.data.id;
        state.attributes = user.data.attributes;
        /* eslint-enable */
    },
};

const getters = {
    confirmed(state) {
        return state.attributes.isConfirmed;
    },
};

const state = {
    id: null,
    attributes: {
        isConfirmed: false,
    },
};

export const user = {
    namespaced: true,
    actions,
    mutations,
    getters,
    state,
};
