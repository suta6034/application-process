import desiredJob, {
    desiredJobValueAdapter,
    objectiveValueAdapter,
    salaryFormatAdapter,
    salaryValueAdapter,
    termOfNoticeValueAdapter,
} from './desired-job';

import {
    DesiredJob,
} from '../../../models/DesiredJob';

describe('desiredJob', () => {
    describe('mutations', () => {
        test('It should have an `updateField()` mutation.', () => {
            expect(typeof desiredJob.mutations.updateField).toBe('function');
        });

        describe('UPDATE_FROM_QUERY', () => {
            test('It should map query data to match state structure.', () => {
                const mockState = {};

                desiredJob.mutations.UPDATE_FROM_QUERY(mockState, {
                    branches: [{ id: 1, title: 'Foo' }],
                    employment: [{ id: 1, title: 'Foo' }],
                    jobFields: [{ id: 1, title: 'Foo' }],
                    locations: ['Foo'],
                    migrate: 'migrate',
                    objectives: [{ id: 1, name: 'Foo' }],
                    salary: 900,
                    termOfNotice: 2,
                    travelReadiness: 'nonsense travel readiness value',
                    workFromHome: 'nonsense work from home demands',
                });

                expect(mockState).toEqual({
                    branches: [{ id: 1, title: 'Foo' }],
                    employment: [{ id: 1, title: 'Foo' }],
                    jobFields: [{ id: 1, title: 'Foo' }],
                    locations: ['Foo'],
                    migrate: 'migrate',
                    objectives: [{ id: 1, name: 'Foo' }],
                    salary: 900,
                    termOfNotice: {
                        id: 2,
                        label: 'In 1 Monat',
                        value: 2,
                    },
                    travelReadiness: { value: null },
                    workFromHome: { value: null },
                });
            });

            test('It should find correct travel readiness & work from home options.', () => {
                const mockState = {};

                desiredJob.mutations.UPDATE_FROM_QUERY(mockState, {
                    branches: [{ id: 1, title: 'Foo' }],
                    employment: [{ id: 1, title: 'Foo' }],
                    jobFields: [{ id: 1, title: 'Foo' }],
                    locations: ['Foo'],
                    migrate: 'migrate',
                    objectives: [{ id: 1, name: 'Foo' }],
                    salary: 900,
                    termOfNotice: 2,
                    travelReadiness: 2,
                    workFromHome: 3,
                });

                expect(mockState).toEqual({
                    branches: [{ id: 1, title: 'Foo' }],
                    employment: [{ id: 1, title: 'Foo' }],
                    jobFields: [{ id: 1, title: 'Foo' }],
                    locations: ['Foo'],
                    migrate: 'migrate',
                    objectives: [{ id: 1, name: 'Foo' }],
                    salary: 900,
                    termOfNotice: {
                        id: 2,
                        label: 'In 1 Monat',
                        value: 2,
                    },
                    travelReadiness: {
                        id: 2,
                        label: '2 Tage',
                        value: 2,
                    },
                    workFromHome: {
                        id: 3,
                        label: '3 Tage',
                        value: 3,
                    },
                });
            });
        });
    });

    describe('getters', () => {
        test('It should have a `getField()` getter.', () => {
            expect(typeof desiredJob.getters.getField).toBe('function');
        });

        describe('model()', () => {
            test('It should return a DesiredJob object.', () => {
                const mockState = {};

                expect(desiredJob.getters.model(mockState) instanceof DesiredJob).toBe(true);
            });
        });
    });

    describe('adapters', () => {
        test('It should adapt values.', () => {
            expect(desiredJobValueAdapter({ id: 1, label: 'foo' })).toEqual({ id: 1, title: 'foo' });
            expect(objectiveValueAdapter('foo')).toEqual({ id: null, name: 'foo' });
            expect(salaryFormatAdapter('NaN')).toEqual('');
            expect(salaryValueAdapter('')).toEqual(0);
            expect(salaryFormatAdapter(2000)).toMatch(/2.000/); // If Node.js is built with intl support it will use DE
            expect(salaryValueAdapter('2.000')).toEqual(2000);
            expect(termOfNoticeValueAdapter({ value: 'foo' })).toEqual('foo');
        });
    });
});
