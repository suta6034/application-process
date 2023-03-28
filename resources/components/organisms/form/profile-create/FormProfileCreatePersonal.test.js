import Vuex from 'vuex';

import {
    nextTick,
} from 'vue';
import flushPromises from 'flush-promises';
import {
    localVue,
    mount,
} from '../../../../../tests/app/vue/utils';
import store from '../../../../store';
import mitt from '../../../../utils/mitt';
import * as authService from '../../../../services/auth';

import FormProfileCreatePersonal from './FormProfileCreatePersonal';

jest.mock('../../../../store');
jest.mock('../../../../store/modules/profile');
jest.mock('../../../../store/modules/profile-create');
jest.mock('../../../../services/autocomplete');
jest.mock('../../../../services/auth');
jest.mock('../../../../store/modules/components/popup');

let wrapper;

localVue.use(Vuex);

const mockRouter = {
    push: jest.fn(),
};

beforeEach(() => {
    // eslint-disable-next-line prefer-destructuring
    store.state.profileCreate.profileExists = false;
    store.state.profileCreate.forceValidation = { key: '', time: 0 };

    wrapper = mount(FormProfileCreatePersonal, {
        localVue,
        store,
        mocks: {
            $router: mockRouter,
            $t: jest.fn(),
            $randomFieldId: jest.fn(),
        },
    });
});

describe('FormProfileCreatePersonal', () => {
    test('It should render a `<div>`.', () => {
        expect(wrapper.element.tagName).toBe('DIV');
    });

    test('It should open a new modal if a profile already exists for the given email.', async () => {
        store.commit = jest.fn();
        authService.isUserLoggedIn.mockResolvedValue(false);
        store.state.profileCreate.userWithEmailExists = true;

        await flushPromises();
        expect(store.commit).toBeCalledWith('popup/SHOW_POPUP', expect.any(Object));
    });

    test('It should disable the email field if a user is logged in.', () => {
        store.state.profile.basics.email = 'foo@bar.com';
        wrapper = mount(FormProfileCreatePersonal, {
            localVue,
            store,
            mocks: {
                $router: mockRouter,
                $t: jest.fn(),
                $randomFieldId: jest.fn(),
            },
        });

        expect(wrapper.find('[data-qa="email field"][disabled]').exists()).toBe(true);
    });

    test('It should prefill the email field if an email from the user is available.', () => {
        store.state.profileCreate.basics.email = 'foo@bar.com';
        wrapper = mount(FormProfileCreatePersonal, {
            localVue,
            store,
            mocks: {
                $router: mockRouter,
                $t: jest.fn(),
                $randomFieldId: jest.fn(),
            },
        });

        expect(wrapper.find('[data-qa="email field"]').element.value).toBe('foo@bar.com');
    });

    test('It should clear the email field, when the profile exists modal is declined.', async () => {
        store.state.profile.basics.email = 'foo@bar.com';
        store.commit = jest.fn();
        wrapper = mount(FormProfileCreatePersonal, {
            localVue,
            store,
            mocks: {
                $router: mockRouter,
                $t: jest.fn(),
                $randomFieldId: jest.fn(),
            },
        });
        mitt.emit('modal-profile-exists-decline');

        await nextTick();

        expect(store.commit).toHaveBeenCalledWith('profile/basics/CLEAR_EMAIL', undefined);
    });

    test('It should show the DACH countries by default when selecting a country.', async () => {
        wrapper.find('[data-qa="country field"]').trigger('focus');
        await nextTick();

        expect(wrapper.find('[data-qa="option 1"]').text()).toBe('Österreich');
        expect(wrapper.find('[data-qa="option 2"]').text()).toBe('Deutschland');
        expect(wrapper.find('[data-qa="option 3"]').text()).toBe('Schweiz');
    });

    describe('Fetch the profile exists status', () => {
        test('User enters email address.', async () => {
            store.dispatch = jest.fn();
            wrapper = mount(FormProfileCreatePersonal, {
                localVue,
                store,
                mocks: {
                    $randomFieldId: jest.fn(),
                },
            });
            const email = wrapper.find('[data-qa="email field"]');

            email.element.value = 'foo@bar.at';
            email.trigger('input');
            email.trigger('blur');

            await nextTick();

            expect(store.dispatch).toBeCalledWith('profileCreate/fetchCheckUserByEmail', 'foo@bar.com');
        });

        test('User is logged in.', () => {
            store.dispatch = jest.fn();
            store.state.profile.basics.email = 'foo@bar.com';

            wrapper = mount(FormProfileCreatePersonal, {
                localVue,
                store,
                mocks: {
                    $randomFieldId: jest.fn(),
                },
            });

            expect(store.dispatch).toBeCalledWith('profileCreate/fetchCheckUserByEmail', 'foo@bar.com');
        });
    });
});
