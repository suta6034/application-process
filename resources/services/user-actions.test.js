import mitt from '../utils/mitt';

import {
    emitUserAction,
    onUserAction,
} from './user-actions';

describe('user-actions', () => {
    test('It should be a function.', () => {
        expect(typeof onUserAction).toBe('function');
    });

    // because it takes some time for the event handler (second parameter of mitt.on('event', eventHandler))
    // to be called
    const waitForUserActionToBeDetected = () => new Promise((resolve) => { resolve(); });

    test('It should call the given callback when the user-action is known', async () => {
        const callback = jest.fn();
        onUserAction(callback);
        emitUserAction('profile-list-document-upload');
        mitt.off('userAction');
        await waitForUserActionToBeDetected();
        expect(callback).toBeCalled();
    });

    test('It should not call the given callback when the user-action is unknown', async () => {
        const callback = jest.fn();
        onUserAction(callback);
        emitUserAction('invalid-user-action');
        mitt.off('userAction');
        await waitForUserActionToBeDetected();
        expect(callback).not.toBeCalled();
    });
});
