import skill from './skill';

import {
    Skill,
} from '../../../models/Skill';

describe('skill', () => {
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
                        level: { id: 10, label: 'Basiswissen' },
                    },
                ];
                const expectedResult = [
                    {
                        id: 1,
                        label: 'foo',
                        level: { id: 10, label: 'Basiswissen' },
                    },
                    {
                        id: 2,
                        label: 'bar',
                        level: { id: 10, label: 'Basiswissen' },
                    },
                ];

                skill.mutations.UPDATE(mockState, { path: 'rows', value });

                expect(mockState.rows).toEqual(expectedResult);
            });

            test('It should use level of skill in state if none is given for a specific skill.', () => {
                const mockState = {
                    rows: [
                        {
                            id: 1,
                            label: 'foo',
                            level: { id: 20, label: 'Fortgeschritten' },
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
                        level: { id: 20, label: 'Fortgeschritten' },
                    },
                ];

                skill.mutations.UPDATE(mockState, { path: 'rows', value });

                expect(mockState.rows).toEqual(expectedResult);
            });

            test('It should update other paths than `rows` as usual.', () => {
                const mockState = { foo: '' };

                skill.mutations.UPDATE(mockState, { path: 'foo', value: 'foo' });

                expect(mockState.foo).toEqual('foo');
            });
        });

        describe('UPDATE_FROM_QUERY', () => {
            test('It should map query data to match state structure.', () => {
                const mockState = { rows: [] };

                skill.mutations.UPDATE_FROM_QUERY(mockState, [
                    {
                        levelLabel: 'Basiswissen',
                        id: 1,
                        level: 10,
                        name: 'foo',
                    },
                    {
                        levelLabel: 'Basiswissen',
                        id: 2,
                        level: 10,
                        name: 'bar',
                    },
                ]);

                expect(mockState.rows).toEqual([
                    {
                        id: 1,
                        label: 'foo',
                        level: { id: 10, label: 'Basiswissen' },
                    },
                    {
                        id: 2,
                        label: 'bar',
                        level: { id: 10, label: 'Basiswissen' },
                    },
                ]);
            });

            test('It should set an empty object as level if none is given.', () => {
                const mockState = { rows: [] };

                skill.mutations.UPDATE_FROM_QUERY(mockState, [
                    {
                        levelLabel: 'Basiswissen',
                        id: 1,
                        name: 'foo',
                    },
                    {
                        levelLabel: 'Basiswissen',
                        id: 2,
                        name: 'bar',
                    },
                ]);

                expect(mockState.rows).toEqual([
                    {
                        id: 1,
                        label: 'foo',
                        level: {},
                    },
                    {
                        id: 2,
                        label: 'bar',
                        level: {},
                    },
                ]);
            });
        });

        describe('UPDATE_LEVEL', () => {
            test('It should update the level of the skill with the given ID.', () => {
                const mockState = {
                    rows: [
                        {
                            id: 1,
                            label: 'foo',
                            level: { id: 20, label: 'Fortgeschritten' },
                        },
                    ],
                };

                skill.mutations.UPDATE_LEVEL(mockState, {
                    id: 1,
                    label: 'foo',
                    levelId: 10,
                });

                expect(mockState.rows).toEqual([
                    {
                        id: 1,
                        label: 'foo',
                        level: { id: 10, label: 'Basiswissen' },
                    },
                ]);
            });
        });
    });

    describe('getters', () => {
        test('It should have a `getField()` getter.', () => {
            expect(typeof skill.getters.getField).toBe('function');
        });

        describe('models()', () => {
            test('It should return an array of Skill objects.', () => {
                const mockState = { rows: [{}] };

                expect(skill.getters.models(mockState)[0] instanceof Skill).toBe(true);
            });
        });
    });
});
