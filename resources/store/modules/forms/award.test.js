import award from './award';

import {
    Award,
} from '../../../models/Award';

describe('award', () => {
    describe('mutations', () => {
        test('It should have an `updateField()` mutation.', () => {
            expect(typeof award.mutations.updateField).toBe('function');
        });

        describe('CLEAR_NEW_ROWS', () => {
            test('It should clear rows which were not saved yet.', () => {
                const mockState = {
                    rows: [
                        {
                            id: 1,
                            name: 'Foo',
                        },
                        {
                            id: 2,
                            name: 'Bar',
                        },
                        {
                            id: null,
                            name: 'Baz',
                        },
                    ],
                };

                award.mutations.CLEAR_NEW_ROWS(mockState);

                expect(mockState.rows[0].name).toBe('Foo');
                expect(mockState.rows[1].name).toBe('Bar');
                expect(mockState.rows[2].name).toBe('');
            });
        });

        describe('DELETE', () => {
            test('It should delete the element with the given id.', () => {
                const mockState = {
                    rows: [
                        {
                            id: 2,
                            name: 'Foo',
                            submitted: true,
                        },
                        {
                            id: 3,
                            name: 'bar',
                            submitted: true,
                        },
                        {
                            id: 4,
                            name: 'Foo',
                            submitted: true,
                        },
                    ],
                };

                award.mutations.DELETE(mockState, 2);

                expect(mockState.rows.length).toBe(2);
                expect(mockState.rows[0].id).toBe(3);
            });
        });

        describe('UPDATE_FROM_QUERY', () => {
            test('It should map query data to match state structure.', () => {
                const mockState = { rows: [] };

                award.mutations.UPDATE_FROM_QUERY(mockState, [
                    {
                        date: '2013-01-01T00:00:00+0100',
                        id: 1,
                        name: 'Foo Foo',
                        url: 'www.fooBar.com',
                    },
                    {
                        date: '2014-01-01T00:00:00+0100',
                        id: 2,
                        name: 'Bar Bar',
                        url: 'www.barbar.app',
                    },
                ]);

                expect(mockState.rows).toEqual([
                    {
                        date: '2013-01-01T00:00:00+0100',
                        id: 1,
                        name: 'Foo Foo',
                        submitted: false,
                        url: 'www.fooBar.com',
                    },
                    {
                        date: '2014-01-01T00:00:00+0100',
                        id: 2,
                        name: 'Bar Bar',
                        submitted: false,
                        url: 'www.barbar.app',
                    },
                ]);
            });

            test('It should add new awards to the beginning of the rows if a row already exists.', () => {
                const mockState = {
                    rows: [
                        {
                            id: null,
                            name: '',
                        },
                    ],
                };

                award.mutations.UPDATE_FROM_QUERY(mockState, [
                    {
                        id: 1,
                        name: 'Foo',
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
                            name: 'Foo',
                        },
                    ],
                };

                award.mutations.UPDATE_FROM_QUERY(mockState, [
                    {
                        id: 1,
                        name: 'Foo',
                    },
                ]);

                expect(mockState.rows.length).toBe(1);
            });

            test('It should reset the `submitted` state.', () => {
                const mockState = {
                    rows: [
                        {
                            id: null,
                            name: 'Foo',
                            submitted: true,
                        },
                    ],
                };

                award.mutations.UPDATE_FROM_QUERY(mockState, [
                    {
                        id: 1,
                        name: 'Bar',
                    },
                ]);

                expect(mockState.rows[1].submitted).toBe(false);
            });
        });
    });

    describe('getters', () => {
        test('It should have a `getField()` getter.', () => {
            expect(typeof award.getters.getField).toBe('function');
        });

        describe('models()', () => {
            test('It should return an array of Award objects.', () => {
                const mockState = { rows: [{ id: 1 }] };

                expect(award.getters.models(mockState)[0] instanceof Award).toBe(true);
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

                expect(award.getters.models(mockState).length).toBe(2);
            });
        });
    });
});
