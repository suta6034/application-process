import {
    commitAndShowModal,
    modalProperties,
} from './error';
import * as mutationTypes from '../store/mutation-types';

jest.mock('../store');

describe('error', () => {
    describe('commitAndShowModal()', () => {
        test('It should commit the modal properties.', () => {
            const commit = jest.fn();

            commitAndShowModal(commit, { mesage: '404' });

            expect(commit).toHaveBeenCalledWith(`popup/${mutationTypes.SHOW_POPUP}`, modalProperties, { root: true });
        });
    });
});
