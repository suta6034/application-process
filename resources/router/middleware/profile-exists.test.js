import Vue from 'vue';

import {
    // eslint-disable-next-line import/named
    __createMocks as createStoreMocks,
} from '../../store';
import {
    FETCH_PROFILE,
} from '../../store/action-types';
import {
    HIDE_POPUP,
    SHOW_POPUP,
} from '../../store/mutation-types';
import profileExists from './profile-exists';

jest.mock('../../store');
jest.mock('../../store/modules/components/popup');
jest.mock('../../store/modules/profile');

let storeMocks;

beforeEach(() => {
    storeMocks = createStoreMocks();
    storeMocks.modules.popup.mutations[SHOW_POPUP].mockReset();
    storeMocks.modules.profile.actions[FETCH_PROFILE].mockReset();
    storeMocks.modules.profile.state.exists = false;
});

describe('profileExists()', () => {
    test('It should be a function.', () => {
        expect(typeof profileExists).toBe('function');
    });

    test('It should call the next callback if the user has a profile.', () => {
        storeMocks.modules.profile.state.exists = true;

        const next = jest.fn();
        profileExists({ next, store: storeMocks.store });

        expect(next).toBeCalledWith();
    });

    test('It should show a progress popup if no profile exists in store.', () => {
        storeMocks.modules.profile.state.exists = false;

        const next = jest.fn();
        profileExists({ next, store: storeMocks.store });

        expect(storeMocks.modules.popup.mutations[SHOW_POPUP])
            .toBeCalledWith(expect.any(Object), {
                componentName: 'ProgressPopup',
                type: 'progress',
            });
    });

    test('It should hide the progress popup after fetching a profile.', async () => {
        storeMocks.modules.profile.state.exists = false;

        const next = jest.fn();
        profileExists({ next, store: storeMocks.store });

        // Wait for API request.
        await Vue.nextTick();

        expect(storeMocks.modules.popup.mutations[HIDE_POPUP]).toBeCalled();
    });

    test('It should try to fetch the profile if no profile exists in store.', () => {
        storeMocks.modules.profile.state.exists = false;

        const next = jest.fn();
        profileExists({ next, store: storeMocks.store });

        expect(storeMocks.modules.profile.actions[FETCH_PROFILE]).toBeCalled();
    });

    test('It should call the next callback if fetching an existing profile was successful.', async () => {
        storeMocks.modules.profile.state.exists = false;

        const next = jest.fn();
        profileExists({ next, store: storeMocks.store });

        // Simulate store update.
        storeMocks.modules.profile.state.exists = true;
        // Wait for API request.
        await Vue.nextTick();

        expect(next).toBeCalledWith();
    });

    test('It should redirect to the landingpage if fetching an existing profile was not successful.', async () => {
        storeMocks.modules.profile.state.exists = false;

        const next = jest.fn();
        profileExists({ next, store: storeMocks.store });

        // Wait for API request.
        await Vue.nextTick();

        expect(next).toBeCalledWith({
            name: 'cv-landing-page',
        });
    });
});
