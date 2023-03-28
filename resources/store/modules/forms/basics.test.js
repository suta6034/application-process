import basics, {
    nationalityOptionAdapter,
    nationalityValueAdapter,
    townOptionAdapter,
    townValueAdapter,
    countryAutocompleteAdapter,
    webAddressOptionAdapter,
    webAddressValueAdapter,
} from './basics';

import {
    ProfileBasics,
} from '../../../models/Basics';

describe('basics', () => {
    describe('mutations', () => {
        test('It should have an `updateField()` mutation.', () => {
            expect(typeof basics.mutations.updateField).toBe('function');
        });

        describe('CLEAR_EMAIL', () => {
            test('It should clear the email property value.', () => {
                const mockState = {
                    email: 'foo@bar.com',
                };

                basics.mutations.CLEAR_EMAIL(mockState);

                expect(mockState.email).toBe('');
            });
        });

        describe('UPDATE_FROM_QUERY', () => {
            test('It should map query data to match state structure.', () => {
                const mockState = {};

                basics.mutations.UPDATE_FROM_QUERY(mockState, {
                    birthdate: 'birthdate',
                    contact: {
                        email: 'email',
                        mobile: 'mobile',
                        web: 'web',
                    },
                    firstname: 'firstname',
                    location: {
                        country: 'country',
                        countryLabel: 'countryLabel',
                        state: 'state',
                        stateLabel: 'stateLabel',
                        street: 'street',
                        town: 'town',
                        zip: 'zip',
                    },
                    nationality: 'nationality',
                    salutation: 'm',
                    surname: 'surname',
                    title: 'title',
                });

                expect(mockState).toEqual({
                    birthdate: 'birthdate',
                    email: 'email',
                    mobile: 'mobile',
                    web: 'web',
                    firstname: 'firstname',
                    country: { id: 'country', label: 'countryLabel' },
                    state: { id: 'state', label: 'stateLabel' },
                    street: 'street',
                    town: 'town',
                    zip: 'zip',
                    nationality: 'nationality',
                    salutation: {
                        id: 'm',
                        label: 'Männlich',
                    },
                    surname: 'surname',
                    title: 'title',
                });
            });
        });
    });

    describe('getters', () => {
        test('It should have a `getField()` getter.', () => {
            expect(typeof basics.getters.getField).toBe('function');
        });

        describe('models()', () => {
            test('It should return a ProfileBasics object.', () => {
                const mockState = {};

                expect(basics.getters.model(mockState) instanceof ProfileBasics).toBe(true);
            });
        });
    });

    test('It should create a nation AdaptedOption.', () => {
        const adaptedOption = nationalityOptionAdapter('Foo');
        expect(adaptedOption.id).toBe('Foo');
    });

    test('It should create a nation ValueAdapter.', () => {
        const val = nationalityValueAdapter('Foo');
        expect(val).toEqual({ label: 'Foo' });
    });

    test('It should create a town AdaptedOption.', () => {
        const adaptedOption = townOptionAdapter('Foo');
        expect(adaptedOption.id).toBe('Foo');
    });

    test('It should create a town ValueAdapter.', () => {
        const val = townValueAdapter('Foo');
        expect(val).toEqual({ label: 'Foo' });
    });

    test('It should create a town countryAutocompleteAdapter.', () => {
        const adaptedOption = countryAutocompleteAdapter({ id: 'Foo', label: 'Bar' });
        expect(adaptedOption.id).toBe('Foo');
    });

    test('It should create a web address AdaptedOption.', () => {
        const adaptedOption = webAddressOptionAdapter('Foo');
        expect(adaptedOption.id).toBe('Foo');
    });

    test('It should create a web address ValueAdapter.', () => {
        const val = webAddressValueAdapter('Foo');
        expect(val).toBe('Foo');
    });
});
