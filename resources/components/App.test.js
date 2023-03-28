import flushPromises from 'flush-promises';

import {
    shallowMount,
} from '../../tests/app/vue/utils';

import {
    initUserActionTracking,
} from '../services/tracking-user-actions';

import {
    // eslint-disable-next-line import/named
    __createMocks as createStoreMocks,
} from '../store';
import * as authService from '../services/auth';
import * as notificationService from '../services/notification';

import App from './App';

jest.mock('../polyfills/inert', () => () => {});
jest.mock('../services/notification');
jest.mock('../services/auth');
jest.mock('../store');
jest.mock('../store/modules/components/popup');
jest.mock('../store/modules/profile');
jest.mock('../store/modules/user');
jest.mock('../services/tracking-user-actions');

jest.useFakeTimers();

let wrapper;
let storeMocks;

function createWrapper() {
    wrapper = shallowMount(App, {
        store: storeMocks.store,
        provide: {
            router: {
                resolve: () => ({ href: 'resolved-href' }),
                onReady: callback => callback(),
                currentRoute: {
                    matched: ['Foo'],
                    query: {},
                },
            },
        },
        stubs: {
            'router-view': true,
        },
    });
}

beforeEach(() => {
    // eslint-disable-next-line prefer-destructuring
    storeMocks = createStoreMocks();

    createWrapper();
});

describe('App', () => {
    test('It should render a `<div>`.', () => {
        expect(wrapper.element.tagName).toBe('DIV');
    });

    test('It should register the user action tracking.', async () => {
        createWrapper();
        await flushPromises();
        expect(initUserActionTracking).toBeCalled();
    });

    describe('Automatic notifications check', () => {
        test('It should set the notifications.', async () => {
            authService.isUserLoggedIn.mockReturnValue(true);
            notificationService.get.mockReturnValue({
                data: {
                    meta: {
                        alarm: true,
                        applications: false,
                        companies: false,
                        cv: false,
                        jobs: false,
                        matching: false,
                        messages: false,
                    },
                },
            });

            createWrapper();

            await flushPromises();

            expect(storeMocks.modules.notification.mutations.SET_NOTIFICATIONS).toBeCalled();
        });
    });
});
