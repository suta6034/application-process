import training from './training';

import {
    Training,
} from '../../../models/Training';

describe('training', () => {
    describe('mutations', () => {
        test('It should have an `updateField()` mutation.', () => {
            expect(typeof training.mutations.updateField).toBe('function');
        });

        describe('CLEAR_NEW_ROWS', () => {
            test('It should clear rows which were not saved yet.', () => {
                const mockState = {
                    rows: [
                        {
                            id: 1,
                            title: 'Foo',
                        },
                        {
                            id: 2,
                            title: 'Bar',
                        },
                        {
                            id: null,
                            title: 'Baz',
                        },
                    ],
                };

                training.mutations.CLEAR_NEW_ROWS(mockState);

                expect(mockState.rows[0].title).toBe('Foo');
                expect(mockState.rows[1].title).toBe('Bar');
                expect(mockState.rows[2].title).toBe('');
            });
        });

        describe('DELETE', () => {
            test('It should delete the element with the given id.', () => {
                const mockState = {
                    rows: [
                        {
                            id: 1,
                            title: 'Foo',
                        },
                        {
                            id: 2,
                            title: 'Bar',
                        },
                        {
                            id: 3,
                            title: 'Baz',
                        },
                    ],
                };

                training.mutations.DELETE(mockState, 2);

                expect(mockState.rows.length).toBe(2);
                expect(mockState.rows[1].id).toBe(3);
            });
        });

        describe('UPDATE_FROM_QUERY', () => {
            test('It should map query data to match state structure.', () => {
                const mockState = { rows: [] };

                training.mutations.UPDATE_FROM_QUERY(mockState, [
                    {
                        date: 'date1',
                        id: 1,
                        institute: 'institute1',
                        title: 'title1',
                    },
                    {
                        date: 'date2',
                        id: 2,
                        institute: 'institute2',
                        title: 'title2',
                    },
                ]);

                expect(mockState.rows).toEqual([
                    {
                        date: 'date1',
                        id: 1,
                        institute: 'institute1',
                        submitted: false,
                        title: 'title1',
                    },
                    {
                        date: 'date2',
                        id: 2,
                        institute: 'institute2',
                        submitted: false,
                        title: 'title2',
                    },
                ]);
            });

            test('It should add new trainings to the beginning of the rows if a row already exists.', () => {
                const mockState = {
                    rows: [
                        {
                            id: null,
                            title: '',
                        },
                    ],
                };

                training.mutations.UPDATE_FROM_QUERY(mockState, [
                    {
                        id: 1,
                        title: 'Foo',
                    },
                ]);

                expect(mockState.rows[0].id).toBe(1);
                expect(mockState.rows[1].id).toBe(null);
            });

            test('It should not add already existing rows (by id) a second time.', () => {
                const mockState = {
                    rows: [
                        {
                            id: 1,
                            title: 'Foo',
                        },
                    ],
                };

                training.mutations.UPDATE_FROM_QUERY(mockState, [
                    {
                        id: 1,
                        title: 'Foo',
                    },
                ]);

                expect(mockState.rows.length).toBe(1);
            });

            test('It should reset the `submitted` state.', () => {
                const mockState = {
                    rows: [
                        {
                            id: null,
                            title: 'Foo',
                            submitted: true,
                        },
                    ],
                };

                training.mutations.UPDATE_FROM_QUERY(mockState, [
                    {
                        id: 1,
                        title: 'Bar',
                    },
                ]);

                expect(mockState.rows[1].submitted).toBe(false);
            });
        });
    });

    describe('getters', () => {
        test('It should have a `getField()` getter.', () => {
            expect(typeof training.getters.getField).toBe('function');
        });

        describe('models()', () => {
            test('It should return an array of Training objects.', () => {
                const mockState = { rows: [{ id: 1 }] };

                expect(training.getters.models(mockState)[0] instanceof Training).toBe(true);
            });

            test('It should filter rows which are not submitted.', () => {
                const mockState = {
                    rows: [
                        {
                            id: 1,
                            submitted: false,
                        },
                        {
                            id: null,
                            submitted: false,
                        },
                        {
                            id: null,
                            submitted: true,
                        },
                    ],
                };

                expect(training.getters.models(mockState).length).toBe(2);
            });
        });
    });
});
