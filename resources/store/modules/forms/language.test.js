import language, {
    autocompleteAdapter,
} from './language';

import {
    Language,
} from '../../../models/Language';

describe('language', () => {
    describe('mutations', () => {
        describe('UPDATE', () => {
            test('It should enrich data with default level if none is given.', () => {
                const mockState = { rows: [] };
                const value = [
                    {
                        id: 1,
                        label: 'foo',
                    },
                    {
                        id: 2,
                        label: 'bar',
                        level: { id: 10, label: 'Grundkenntnisse' },
                    },
                ];
                const expectedResult = [
                    {
                        id: 1,
                        label: 'foo',
                        languageId: null,
                        level: { id: 10, label: 'Grundkenntnisse' },
                    },
                    {
                        id: 2,
                        label: 'bar',
                        languageId: null,
                        level: { id: 10, label: 'Grundkenntnisse' },
                    },
                ];

                language.mutations.UPDATE(mockState, { path: 'rows', value });

                expect(mockState.rows).toEqual(expectedResult);
            });

            test('It should use level of language in state if none is given for a specific language.', () => {
                const mockState = {
                    rows: [
                        {
                            id: 1,
                            label: 'foo',
                            level: { id: 20, label: 'Gut' },
                        },
                    ],
                };
                const value = [
                    {
                        id: 1,
                        label: 'bar',
                    },
                ];
                const expectedResult = [
                    {
                        id: 1,
                        label: 'bar',
                        languageId: null,
                        level: { id: 20, label: 'Gut' },
                    },
                ];

                language.mutations.UPDATE(mockState, { path: 'rows', value });

                expect(mockState.rows).toEqual(expectedResult);
            });

            test('It should update other paths than `rows` as usual.', () => {
                const mockState = { foo: '' };

                language.mutations.UPDATE(mockState, { path: 'foo', value: 'foo' });

                expect(mockState.foo).toEqual('foo');
            });
        });

        describe('UPDATE_FROM_QUERY', () => {
            test('It should map query data to match state structure.', () => {
                const mockState = { rows: [] };

                language.mutations.UPDATE_FROM_QUERY(mockState, [
                    {
                        skillLevel: 10,
                        skillLevelLabel: 'Grundkenntnisse',
                        id: 1,
                        title: 'foo',
                    },
                    {
                        skillLevel: 10,
                        skillLevelLabel: 'Grundkenntnisse',
                        id: 2,
                        title: 'bar',
                    },
                ]);

                expect(mockState.rows).toEqual([
                    {
                        id: 1,
                        label: 'foo',
                        level: { id: 10, label: 'Grundkenntnisse' },
                    },
                    {
                        id: 2,
                        label: 'bar',
                        level: { id: 10, label: 'Grundkenntnisse' },
                    },
                ]);
            });
        });

        describe('UPDATE_LEVEL', () => {
            test('It should update the level of the language with the given ID.', () => {
                const mockState = {
                    rows: [
                        {
                            id: 1,
                            label: 'foo',
                            level: { id: 20, label: 'Gut' },
                        },
                    ],
                };

                language.mutations.UPDATE_LEVEL(mockState, {
                    id: 1,
                    label: 'foo',
                    levelId: 10,
                });

                expect(mockState.rows).toEqual([
                    {
                        id: 1,
                        label: 'foo',
                        level: { id: 10, label: 'Grundkenntnisse' },
                    },
                ]);
            });
        });
    });

    describe('getters', () => {
        test('It should have a `getField()` getter.', () => {
            expect(typeof language.getters.getField).toBe('function');
        });

        describe('models()', () => {
            test('It should return an array of Language objects.', () => {
                const mockState = { rows: [{}] };

                expect(language.getters.models(mockState)[0] instanceof Language).toBe(true);
            });
        });
    });

    describe('adapters', () => {
        describe('autocompleteAdapter()', () => {
            test('It should merge default language data with given data.', () => {
                expect(autocompleteAdapter({ id: 'foo', label: 'bar' })).toEqual({
                    id: null,
                    label: 'bar',
                    languageId: 'foo',
                    level: {
                        id: 10,
                        label: 'Grundkenntnisse',
                    },
                });
            });
        });
    });
});
