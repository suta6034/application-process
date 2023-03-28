import blacklist, {
    blacklistAutocompleteAdapter,
} from './blacklist';

describe('blacklist', () => {
    describe('mutations', () => {
        test('It should have an `updateField()` mutation.', () => {
            expect(typeof blacklist.mutations.updateField).toBe('function');
        });

        describe('UPDATE_FROM_QUERY', () => {
            test('It should map query data to match state structure.', () => {
                const mockState = { blacklist: [] };

                blacklist.mutations.UPDATE_FROM_QUERY(mockState, []);

                expect(mockState.blacklist).toStrictEqual([]);
            });
        });
    });

    describe('getters', () => {
        test('It should have a `getField()` getter.', () => {
            expect(typeof blacklist.getters.getField).toBe('function');
        });
    });

    test('It should create a blacklist AutocompleteAdapter.', () => {
        const val = blacklistAutocompleteAdapter('Foo');
        expect(val).toBe('Foo');
    });
});
