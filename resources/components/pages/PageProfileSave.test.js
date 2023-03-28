import Vuex from 'vuex';
import Router from 'vue-router';
import flushPromises from 'flush-promises';
import {
    createLocalVue,
} from '@vue/test-utils';

import {
    nextTick,
} from 'vue';
import PageProfileSave from './PageProfileSave';
import store from '../../store';
import {
    mount,
} from '../../../tests/app/vue/utils';

jest.mock('../../store');
jest.mock('../../store/modules/profile');
jest.mock('../../store/modules/profile-create');
jest.mock('../../store/modules/user');
jest.mock('../../utils/action-logger');

let wrapper;
const localVue = createLocalVue();

const router = new Router({
    routes: [
        {
            path: '/page-cv',
            name: 'page-cv',
        },
        {
            path: '/login',
            name: 'login',
        },
        {
            path: '/logout',
            name: 'logout',
        },
    ],
    mode: 'history',
});
router.push = jest.fn();

localVue.use(Router);
localVue.use(Vuex);

beforeEach(() => {
    // eslint-disable-next-line prefer-destructuring
    router.push.mockReset();

    wrapper = mount(PageProfileSave, {
        localVue,
        store,
        router,
    });
});

describe('PageProfileSave', () => {
    test('It should render a `<div>`.', () => {
        expect(wrapper.element.tagName).toBe('DIV');
    });

    test('It should trigger saving a new profile.', async () => {
        store.dispatch = jest.fn();
        store.state.profileCreate.basics.email = 'something@some.com';
        await nextTick();

        wrapper = mount(PageProfileSave, {
            localVue,
            store,
            router,
        });

        expect(store.dispatch).toHaveBeenCalledWith('profile/CREATE_PROFILE', { hash: null, profileData: undefined });
    });

    test('It should redirect to the first create step if no email is set.', () => {
        store.state.user.attributes.isConfirmed = true;
        store.state.profileCreate.basics.email = '';
        wrapper = mount(PageProfileSave, {
            localVue,
            store,
            router,
            provide: {
                router,
            },
        });
        expect(router.push).toBeCalledWith({ name: 'page-profile-create-onepage' });
    });

    describe('Saving a new profile was successful', () => {
        test('It should redirect to the profile page if the current user is confirmed.', async () => {
            store.state.profile.created = true;
            store.state.profileCreate.basics.email = 'foo@bar.com';
            store.state.user.attributes.isConfirmed = true;
            store.state.profileCreate.userWithEmailExists = false;
            store.state.profileCreate.origin.origin = 'ONE_PAGER_WORK_MANUAL';
            store.state.profileCreate.source = 'application';

            wrapper = mount(PageProfileSave, {
                localVue,
                store,
                router,
                provide: {
                    router,
                },
            });

            // Wait for API request promises to resolve.
            await flushPromises();

            expect(router.push).toBeCalledWith({ name: 'page-cv', query: { 'first-activation': 'karl' } });
        });

        test('It should show confirm information if the current user isn\'t confirmed.', async () => {
            await wrapper.setData({ showConfirmationInfo: true });

            expect(wrapper.find('[data-qa="confirm information"]').exists()).toBe(true);
        });
    });
});
