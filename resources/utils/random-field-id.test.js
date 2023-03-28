import randomFieldId from './random-field-id';

describe('randomFieldId()', () => {
    test('It should be a function.', () => {
        expect(typeof randomFieldId).toBe('function');
    });

    test('It should return a number.', () => {
        expect(randomFieldId('foobar')).toEqual(expect.any(Number));
    });
});
