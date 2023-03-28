import origin from './origin';

describe('origin', () => {
    describe('mutations', () => {
        test('It should have an `updateField()` mutation.', () => {
            expect(typeof origin.mutations.updateField).toBe('function');
        });
    });

    describe('getters', () => {
        test('It should have a `getField()` getter.', () => {
            expect(typeof origin.getters.getField).toBe('function');
        });
    });
});
