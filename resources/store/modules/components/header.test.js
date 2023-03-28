import header from './header';
import * as actionTypes from '../../action-types';
import * as mutationTypes from '../../mutation-types';

jest.mock('../../../store');
jest.mock('../../../services/app-shell');

let state;

beforeEach(() => {
    state = {
        response: null,
        hash: 99999,
        expireTime: 12345,
    };
});

describe('header', () => {
    describe('mutations', () => {
        test('SET_HEADER_RESPONSE', () => {
            header.mutations[mutationTypes.SET_HEADER_RESPONSE](state, { html: 'Foo' });

            expect(state.response).toEqual({ html: 'Foo' });
        });

        test('SET_HEADER_HASH', () => {
            header.mutations[mutationTypes.SET_HEADER_HASH](state, 77777);
            expect(state.hash).toEqual(77777);
        });

        test('SET_HEADER_EXPIRE_TIME', () => {
            header.mutations[mutationTypes.SET_HEADER_EXPIRE_TIME](state, 98765);
            expect(state.expireTime).toEqual(98765);
        });
    });
    describe('actions', () => {
        test('It should fetch the header with the given model.', async () => {
            const commit = jest.fn();
            const model = { user: { firstname: 'foo', lastname: 'bar' } };

            await header.actions[actionTypes.FETCH_HEADER]({ commit }, model);

            expect(commit).toHaveBeenCalledWith('SET_HEADER_RESPONSE', null);
            expect(commit).toHaveBeenCalledWith('SET_HEADER_RESPONSE', expect.anything());
            expect(commit).toHaveBeenCalledWith('SET_HEADER_EXPIRE_TIME', expect.any(Number));
        });
    });
});
