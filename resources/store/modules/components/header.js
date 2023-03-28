import * as mutationTypes from '../../mutation-types';
import * as actionTypes from '../../action-types';
import * as logger from '../../../utils/logger';

import {
    getHeader,
} from '../../../services/app-shell';

const maxAge = 5 * 60 * 1000;

const actions = {
    async [actionTypes.FETCH_HEADER]({ commit }, model) {
        try {
            commit(mutationTypes.SET_HEADER_RESPONSE, null);

            const response = await getHeader(model);
            const expireTime = Date.now() + maxAge;

            commit(mutationTypes.SET_HEADER_RESPONSE, response);
            commit(mutationTypes.SET_HEADER_EXPIRE_TIME, expireTime);
        } catch (exception) {
            commit(mutationTypes.SET_HEADER_RESPONSE, null);

            /* istanbul ignore next */
            logger.error({
                exception,
                tags: {
                    user_info: logger.userInfoTags.INLINE,
                },
            });
        }
    },
};

const mutations = {
    [mutationTypes.SET_HEADER_RESPONSE](state, response) {
        state.response = response;
    },
    [mutationTypes.SET_HEADER_HASH](state, hash) {
        state.hash = hash;
    },
    [mutationTypes.SET_HEADER_EXPIRE_TIME](state, expireTime) {
        state.expireTime = expireTime;
    },
};

const state = () => ({
    response: null,
    hash: null,
    expireTime: 0,
});

export default {
    namespaced: true,
    actions,
    mutations,
    state,
};
