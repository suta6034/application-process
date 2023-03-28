import {
    ref,
} from 'vue';

import {
    useStringWithCounter,
} from './string-with-counter';

const string = ({ singular, plural, counter }) => {
    const { stringWithCounter } = useStringWithCounter({ singular, plural, counter });
    return stringWithCounter.value;
};
let singular;
let plural;
const counter = ref();

beforeEach(() => {
    singular = 'foo';
    plural = 'foos';
    counter.value = undefined;
});

describe('useStringWithCounter()', () => {
    test('It should be a function.', () => {
        expect(typeof useStringWithCounter).toBe('function');
    });

    test('It should return the correct text when counter is undefined.', () => {
        expect(string({ singular, plural, counter })).toBe(plural);
    });

    test('It should return the correct text when counter is 0.', () => {
        counter.value = 0;
        expect(string({ singular, plural, counter })).toBe(`0 ${plural}`);
    });

    test('It should return the correct text when counter is 1.', () => {
        counter.value = 1;
        expect(string({ singular, plural, counter })).toBe(`1 ${singular}`);
    });

    test('It should return the correct text when counter is 5.', () => {
        counter.value = 5;
        expect(string({ singular, plural, counter })).toBe(`5 ${plural}`);
    });
});
