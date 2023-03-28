import {
    notification,
} from './notification';
import * as mutationTypes from '../mutation-types';

describe('notification', () => {
    describe('mutations', () => {
        test('SET_NOTIFICATIONS', () => {
            const state = {};
            notification.mutations[mutationTypes.SET_NOTIFICATIONS](state, {
                alarm: false,
                applications: false,
                companies: true,
                cv: false,
                matching: false,
                messages: true,
            });
            expect(state).toEqual({
                alarm: false,
                applications: false,
                companies: true,
                cv: false,
                matching: false,
                messages: true,
            });
        });
    });
});
