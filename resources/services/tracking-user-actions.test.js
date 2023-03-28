import mitt from '../utils/mitt';

import {
    initUserActionTracking,
} from './tracking-user-actions';

import {
    track,
} from '../utils/tracking';
import {
    emitUserAction,
} from './user-actions';

jest.mock('../utils/tracking');

describe('tracking-user-actions', () => {
    // because it takes some time for the event handler (second parameter of mitt.on('event', eventHandler))
    // to be called
    const waitForUserActionToBeDetected = () => new Promise((resolve) => { resolve(); });

    describe('initUserActionTracking()', () => {
        let currentCategory = 'some-category';
        const getCurrentCategory = () => currentCategory;

        // has to be outside of tests, otherwise mitt.on gets registered more than once
        initUserActionTracking({ getCurrentCategory });

        afterEach(() => {
            track.mockReset();
        });

        test('It should call the track function when a tracking category is provided', async () => {
            emitUserAction('profile-list-document-upload');
            mitt.off('userAction');
            await waitForUserActionToBeDetected();
            expect(track).toBeCalled();
        });

        test('It should not call the track function when no tracking category is provided', async () => {
            currentCategory = undefined;

            emitUserAction('profile-list-document-upload');
            mitt.off('userAction');
            await waitForUserActionToBeDetected();
            expect(track).not.toBeCalled();
        });
    });
});
