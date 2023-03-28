import statement from './statement';

describe('statement', () => {
    describe('mutations', () => {
        test('It should have an `updateField()` mutation.', () => {
            expect(typeof statement.mutations.updateField).toBe('function');
        });

        describe('UPDATE_FROM_QUERY', () => {
            test('It should map query data to match state structure.', () => {
                const mockState = { statement: '' };

                statement.mutations.UPDATE_FROM_QUERY(mockState, 'Foo');

                expect(mockState.statement).toBe('Foo');
            });
        });
    });

    describe('getters', () => {
        test('It should have a `getField()` getter.', () => {
            expect(typeof statement.getters.getField).toBe('function');
        });
    });
});
