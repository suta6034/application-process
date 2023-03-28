import project from './project';

import {
    Project,
} from '../../../models/Project';
import work from './work';

describe('project', () => {
    describe('mutations', () => {
        test('It should have an `updateField()` mutation.', () => {
            expect(typeof project.mutations.updateField).toBe('function');
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
                        {
                            id: null,
                            name: 'Qux',
                        },
                    ],
                };

                project.mutations.CLEAR_NEW_ROWS(mockState);

                expect(mockState.rows[0].name).toBe('Foo');
                expect(mockState.rows[1].name).toBe('Bar');
                expect(mockState.rows[2].name).toBe('');
                expect(mockState.rows[3].name).toBe('');
            });
        });

        describe('DELETE', () => {
            test('It should delete the element with the given id.', () => {
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
                            id: 3,
                            name: 'Qux',
                        },
                    ],
                };

                work.mutations.DELETE(mockState, 2);

                expect(mockState.rows.length).toBe(2);
                expect(mockState.rows[1].id).toBe(3);
            });
        });

        describe('UPDATE_FROM_QUERY', () => {
            test('It should map query data to match state structure.', () => {
                const mockState = { rows: [] };

                project.mutations.UPDATE_FROM_QUERY(mockState, [
                    {
                        description: 'Foo foo',
                        end: null,
                        name: 'Foo',
                        start: '2010-02-28T00:00:00+01:00',
                        url: 'https://foo.com',
                    },
                    {
                        description: 'Bar bar',
                        end: null,
                        name: 'Bar',
                        start: '2010-01-28T00:00:00+01:00',
                        url: 'https://bar.com',
                    },
                ]);

                expect(mockState.rows).toEqual([
                    {
                        description: 'Foo foo',
                        end: null,
                        name: 'Foo',
                        start: '2010-02-28T00:00:00+01:00',
                        submitted: false,
                        url: 'https://foo.com',
                    },
                    {
                        description: 'Bar bar',
                        end: null,
                        name: 'Bar',
                        start: '2010-01-28T00:00:00+01:00',
                        submitted: false,
                        url: 'https://bar.com',
                    },
                ]);
            });

            test('It should add new projects to the beginning of the rows if a row already exists.', () => {
                const mockState = {
                    rows: [
                        {
                            id: null,
                            name: '',
                        },
                    ],
                };

                project.mutations.UPDATE_FROM_QUERY(mockState, [
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

                project.mutations.UPDATE_FROM_QUERY(mockState, [
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

                project.mutations.UPDATE_FROM_QUERY(mockState, [
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
            expect(typeof project.getters.getField).toBe('function');
        });

        describe('models()', () => {
            test('It should return an array of Project objects.', () => {
                const mockState = { rows: [{ id: 1 }] };

                expect(project.getters.models(mockState)[0] instanceof Project).toBe(true);
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

                expect(project.getters.models(mockState).length).toBe(2);
            });
        });
    });
});
