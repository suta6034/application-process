import education from './education';

import {
    Education,
} from '../../../models/Education';

describe('education', () => {
    describe('mutations', () => {
        test('It should have an `updateField()` mutation.', () => {
            expect(typeof education.mutations.updateField).toBe('function');
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

                education.mutations.CLEAR_NEW_ROWS(mockState);

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

                education.mutations.DELETE(mockState, 2);

                expect(mockState.rows.length).toBe(2);
                expect(mockState.rows[0].id).toBe(3);
            });
        });

        describe('UPDATE_FROM_QUERY', () => {
            test('It should map query data to match state structure.', () => {
                const mockState = { rows: [] };

                education.mutations.UPDATE_FROM_QUERY(mockState, [
                    {
                        customType: 'custom-type1',
                        typeLabel: 'Foo',
                        trainingCompany: '',
                        completed: 'completed1',
                        description: 'description1',
                        end: 'end1',
                        focus: 'focus1',
                        id: 1,
                        location: 'location1',
                        name: 'name1',
                        start: 'start1',
                        title: 'title1',
                        type: 1,
                    },
                    {
                        customType: 'custom-type2',
                        typeLabel: 'Bar',
                        trainingCompany: 'Company',
                        completed: 'completed2',
                        description: 'description2',
                        end: 'end2',
                        focus: 'focus2',
                        id: 2,
                        location: 'location2',
                        name: 'name2',
                        start: 'start2',
                        title: 'title2',
                        type: 2,
                    },
                ]);

                expect(mockState.rows).toEqual([
                    {
                        category: {},
                        completed: 'completed1',
                        customType: 'custom-type1',
                        description: 'description1',
                        end: 'end1',
                        focus: 'focus1',
                        id: 1,
                        location: 'location1',
                        name: 'name1',
                        start: 'start1',
                        submitted: false,
                        title: 'title1',
                        trainingCompany: '',
                        type: { id: 1, label: 'Foo' },
                    },
                    {
                        category: {},
                        completed: 'completed2',
                        customType: 'custom-type2',
                        description: 'description2',
                        end: 'end2',
                        focus: 'focus2',
                        id: 2,
                        location: 'location2',
                        name: 'name2',
                        start: 'start2',
                        submitted: false,
                        title: 'title2',
                        trainingCompany: 'Company',
                        type: { id: 2, label: 'Bar' },
                    },
                ]);
            });

            test('It should add new educations to the beginning of the rows if a row already exists.', () => {
                const mockState = {
                    rows: [
                        {
                            id: null,
                            name: '',
                        },
                    ],
                };

                education.mutations.UPDATE_FROM_QUERY(mockState, [
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

                education.mutations.UPDATE_FROM_QUERY(mockState, [
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

                education.mutations.UPDATE_FROM_QUERY(mockState, [
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
            expect(typeof education.getters.getField).toBe('function');
        });

        describe('models()', () => {
            test('It should return an array of Education objects.', () => {
                const mockState = { rows: [{ id: 1 }] };

                expect(education.getters.models(mockState)[0] instanceof Education).toBe(true);
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

                expect(education.getters.models(mockState).length).toBe(2);
            });
        });
    });

    describe('getCategory()', () => {
        test('It should be a function.', () => {
            expect(typeof education.getCategory).toBe('function');
        });

        test('It should return the education category of the education type.', () => {
            const type = 4073;

            expect(education.getCategory(type)).toEqual({ id: 'Hochschule', label: 'Hochschule' });
        });
    });
});
