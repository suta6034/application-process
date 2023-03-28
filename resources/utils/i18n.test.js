import {
    strings,
} from '../lang';
import i18n, {
    extend,
} from './i18n';

jest.mock('../lang', () => ({
    strings: {
        foo: 'foo',
        nested: {
            bar: 'bar',
        },
        someFunc() {
            return 'baz';
        },
    },
}));

describe('i18n()', () => {
    test('It should be a function.', () => {
        expect(typeof i18n).toBe('function');
    });

    test('It should return the string with the given name.', () => {
        expect(i18n('foo')).toBe('foo');
    });

    test('It should return the nested string with the given name.', () => {
        expect(i18n('nested.bar')).toBe('bar');
    });

    test('It should return the return value of a string function.', () => {
        expect(i18n('someFunc')).toBe('baz');
    });
});

describe('extend()', () => {
    test('It should be a function.', () => {
        expect(typeof extend).toBe('function');
    });

    test('It should merge given strings with existing strings.', () => {
        extend({ qux: 'qux' });

        expect(strings).toEqual({
            foo: 'foo',
            nested: {
                bar: 'bar',
            },
            qux: 'qux',
            someFunc: expect.anything(),
        });
    });
});
