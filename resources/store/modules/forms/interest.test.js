import interest from './interest';

import {
    Interest,
} from '../../../models/Interest';

describe('interest', () => {
    describe('mutations', () => {
        test('It should have an `updateField()` mutation.', () => {
            expect(typeof interest.mutations.updateField).toBe('function');
        });

        describe('UPDATE_FROM_QUERY', () => {
            test('It should map query data to match state structure.', () => {
                const mockState = { rows: [] };

                interest.mutations.UPDATE_FROM_QUERY(mockState, [
                    {
                        id: 1,
                        name: 'foo',
                    },
                    {
                        id: 2,
                        name: 'bar',
                    },
                ]);

                expect(mockState.rows).toEqual([
                    {
                        id: 1,
                        label: 'foo',
                    },
                    {
                        id: 2,
                        label: 'bar',
                    },
                ]);
            });
        });
    });

    describe('getters', () => {
        test('It should have a `getField()` getter.', () => {
            expect(typeof interest.getters.getField).toBe('function');
        });

        describe('models()', () => {
            test('It should return an array of Interest objects.', () => {
                const mockState = { rows: [{}] };

                expect(interest.getters.models(mockState)[0] instanceof Interest).toBe(true);
            });
        });
    });
});
