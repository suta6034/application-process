import profileText from './profile-text';

describe('profileText', () => {
    describe('mutations', () => {
        test('It should have an `updateField()` mutation.', () => {
            expect(typeof profileText.mutations.updateField).toBe('function');
        });

        describe('UPDATE_FROM_QUERY', () => {
            test('It should map query data to match state structure.', () => {
                const mockState = { profileText: '' };

                profileText.mutations.UPDATE_FROM_QUERY(mockState, 'Foo');

                expect(mockState.profileText).toBe('Foo');
            });
        });
    });

    describe('getters', () => {
        test('It should have a `getField()` getter.', () => {
            expect(typeof profileText.getters.getField).toBe('function');
        });
    });
});
