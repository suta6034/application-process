import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

import config from '../config';
// eslint-disable-next-line import/no-cycle
import modules from './modules';

Vue.use(Vuex);

export const STORAGE = window.sessionStorage;

// If you change this key, be aware that you also have to change it in k3 and k4!
export const STORAGE_KEY = 'karL-vuex';

export default new Vuex.Store({
    strict: config.store.strict,
    modules,
    plugins: [createPersistedState({
        key: STORAGE_KEY,
        storage: STORAGE,
        paths: [
            'profileCreate',
            'templateSettings',
        ],
    })],
});
