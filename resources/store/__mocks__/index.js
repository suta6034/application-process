import Vue from 'vue';
import Vuex from 'vuex';
import cloneDeep from 'lodash/cloneDeep';

/* eslint-disable import/named */
import {
    __createMocks as createMinitaskMocks,
} from '../modules/minitask';
import {
    __createMocks as createNotificationMocks,
} from '../modules/notification';
import {
    __createMocks as createProfileMocks,
} from '../modules/profile';
import {
    __createMocks as createProfileCreateMocks,
} from '../modules/profile-create';
import {
    __createMocks as createTemplateSettingsMocks,
} from '../modules/template-settings';
import {
    __createMocks as createUserMocks,
} from '../modules/user';
/* eslint-enable */
import header from '../modules/components/header';
import popup from '../modules/components/popup';

jest.mock('../modules/profile');
jest.mock('../modules/profile-create');
jest.mock('../modules/user');
jest.mock('../modules/minitask');
jest.mock('../modules/notification');
jest.mock('../modules/template-settings');
jest.mock('../modules/components/header');

Vue.use(Vuex);

export const modules = {
    minitask: createMinitaskMocks(),
    notification: createNotificationMocks(),
    profile: createProfileMocks(),
    profileCreate: createProfileCreateMocks(),
    templateSettings: createTemplateSettingsMocks(),
    user: createUserMocks(),
    header,
    popup,
};

// eslint-disable-next-line no-underscore-dangle
export function __createMocks(custom = { modules: {} }) {
    const mockModules = { ...cloneDeep(modules), ...custom.modules };

    return {
        modules: mockModules,
        store: new Vuex.Store({
            modules: mockModules,
        }),
    };
}

export const STORAGE = {
    removeItem: jest.fn(),
};

export const STORAGE_KEY = 'karL-vuex';

// Export single store object to make sure vuex helpers import the correct, mocked store
// eslint-disable-next-line import/no-mutable-exports
let { store } = __createMocks();

beforeEach(() => {
    store = {
        ...(__createMocks().store),
    };
});

export default store;
