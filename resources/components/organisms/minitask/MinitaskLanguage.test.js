import Router from 'vue-router';
import Vuex from 'vuex';
import {
    updateField,
} from 'vuex-map-fields';
import {
    createLocalVue,
} from '@vue/test-utils';

import {
    mount,
} from '../../../../tests/app/vue/utils';
import {
    profile,
} from '../../../store/modules/profile';

import MinitaskLanguage from './MinitaskLanguage';

jest.mock('../../../store');

let mockStore;
let wrapper;
const localVue = createLocalVue();

const router = new Router({
    routes: [
        {
            path: '/foo/bar',
        },
    ],
});

router.push = jest.fn();

localVue.use(Router);
localVue.use(Vuex);

describe('MinitaskLanguage', () => {
    beforeEach(() => {
        profile.actions.UPDATE_PROFILE = jest.fn();

        mockStore = new Vuex.Store({
            mutations: {
                updateField,
            },
            modules: {
                profile,
            },
        });
        wrapper = mount(MinitaskLanguage, {
            localVue,
            store: mockStore,
            router,
        });
    });

    test('It should render a `<div>`.', () => {
        expect(wrapper.is('div')).toBe(true);
    });

    test('It should emit a skip event when the skip-button is clicked.', () => {
        wrapper.find('[data-qa="skip button"]').trigger('click');
        expect(wrapper.emitted().skipped).toBeDefined();
    });

    test('It should emit a updated event when the save-button is clicked.', () => {
        wrapper.find('[data-qa="add button"]').trigger('click');
        expect(wrapper.emitted().updated).toBeDefined();
    });
});
