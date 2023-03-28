import {
    user,
} from './user';
import {
    get,
} from '../../services/user';
import * as actionTypes from '../action-types';
import * as mutationTypes from '../mutation-types';

jest.mock('../../services/user');
jest.mock('../');

let state;
const defaultResponse = {
    data: {
        id: 1,
        attributes: {
            isConfirmed: true,
        },
    },
};

beforeEach(() => {
    get.mockReturnValue({ data: { id: 1, attributes: { isConfirmed: true } } });
    state = {
        id: null,
        attributes: {
            isConfirmed: false,
        },
    };
});

describe('profile', () => {
    describe('actions', () => {
        test('FETCH_USER', async () => {
            const commit = jest.fn();
            await user.actions[actionTypes.FETCH_USER]({ commit });

            expect(commit).toHaveBeenCalledWith(mutationTypes.SET_USER, defaultResponse.data);
        });
    });

    describe('mutations', () => {
        test('SET_USER', () => {
            user.mutations[mutationTypes.SET_USER](state, defaultResponse);
            expect(state).toEqual({ id: 1, attributes: { isConfirmed: true } });
        });
    });

    describe('getters', () => {
        test('confirmed', () => {
            const confirmed = user.getters.confirmed(state);
            expect(confirmed).toBe(false);
        });
    });
});
