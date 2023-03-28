import work, {
    autocompleteAdapter,
    titleOptionAdapter,
    titleValueAdapter,
    workExperienceOptionsAdapter,
    workExperienceValueAdapter,
} from './work';

import {
    Work,
} from '../../../models/Work';

describe('work', () => {
    describe('mutations', () => {
        test('It should have an `updateField()` mutation.', () => {
            expect(typeof work.mutations.updateField).toBe('function');
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
                        {
                            id: null,
                            title: 'Qux',
                        },
                    ],
                };

                work.mutations.CLEAR_NEW_ROWS(mockState);

                expect(mockState.rows[0].title).toBe('Foo');
                expect(mockState.rows[1].title).toBe('Bar');
                expect(mockState.rows[2].title).toBe('');
                expect(mockState.rows[3].title).toBe('');
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

                work.mutations.DELETE(mockState, 2);

                expect(mockState.rows.length).toBe(2);
                expect(mockState.rows[1].id).toBe(3);
            });
        });

        describe('UPDATE_FROM_QUERY', () => {
            test('It should map query data to match state structure.', () => {
                const mockState = { rows: [] };

                work.mutations.UPDATE_FROM_QUERY(mockState, [
                    {
                        employmentTypeLabel: 'Foo',
                        employmentType: 1,
                        jobfieldLabel: 'Foo',
                        company: 'company1',
                        companyId: 1,
                        current: false,
                        description: 'description1',
                        end: 'end1',
                        id: 1,
                        jobfield: 1,
                        start: 'start1',
                        title: 'title1',
                    },
                    {
                        employmentTypeLabel: 'Bar',
                        employmentType: 2,
                        jobfieldLabel: 'Bar',
                        company: 'company2',
                        companyId: 2,
                        current: false,
                        description: 'description2',
                        end: 'end2',
                        id: 2,
                        jobfield: 2,
                        start: 'start2',
                        title: 'title2',
                    },
                ]);

                expect(mockState.rows).toEqual([
                    {
                        category: {
                            id: 1,
                            label: 'Berufserfahrung',
                        },
                        company: {
                            id: 1,
                            label: 'company1',
                        },
                        current: false,
                        description: 'description1',
                        employmentType: { id: 1, label: 'Foo' },
                        end: 'end1',
                        id: 1,
                        jobfield: { id: 1, label: 'Foo' },
                        start: 'start1',
                        submitted: false,
                        title: 'title1',
                    },
                    {
                        category: {
                            id: 1,
                            label: 'Berufserfahrung',
                        },
                        company: {
                            id: 2,
                            label: 'company2',
                        },
                        current: false,
                        description: 'description2',
                        employmentType: { id: 2, label: 'Bar' },
                        end: 'end2',
                        id: 2,
                        jobfield: { id: 2, label: 'Bar' },
                        start: 'start2',
                        submitted: false,
                        title: 'title2',
                    },
                ]);
            });

            test('It should add new work experiences to the beginning of the rows if a row already exists.', () => {
                const mockState = {
                    rows: [
                        {
                            id: null,
                            title: '',
                        },
                    ],
                };

                work.mutations.UPDATE_FROM_QUERY(mockState, [
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

                work.mutations.UPDATE_FROM_QUERY(mockState, [
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

                work.mutations.UPDATE_FROM_QUERY(mockState, [
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
            expect(typeof work.getters.getField).toBe('function');
        });

        describe('models()', () => {
            test('It should return an array of Work objects.', () => {
                const mockState = { rows: [{ id: 1 }] };

                expect(work.getters.models(mockState)[0] instanceof Work).toBe(true);
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

                expect(work.getters.models(mockState).length).toBe(2);
            });
        });
    });

    describe('adapters', () => {
        test('It should adapt values.', () => {
            expect(titleValueAdapter('foo')).toEqual({ label: 'foo' });
            expect(titleOptionAdapter('foo')).toEqual({ id: 'foo', label: 'foo', value: 'foo' });
            expect(workExperienceOptionsAdapter({ id: 'foo', label: 'bar' })).toEqual({
                id: 'foo',
                label: 'bar',
                value: { id: 'foo', title: 'bar' },
            });
            expect(workExperienceValueAdapter({ id: 'foo', label: 'bar' })).toEqual({ id: 'foo', title: 'bar' });
        });

        describe('autocompleteAdapter()', () => {
            test('It should adapt autocomplete data.', () => {
                expect(autocompleteAdapter({ id: 'foo', label: 'bar' })).toEqual({
                    id: 'foo',
                    label: 'bar',
                });
            });
        });
    });
});
