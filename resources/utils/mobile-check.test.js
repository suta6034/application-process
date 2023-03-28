import {
    isMobile,
} from './mobile-check';

describe('mobile-check', () => {
    describe('isMobile', () => {
        test('It should be a function.', () => {
            expect(typeof isMobile).toBe('function');
        });

        test('It should return `false` if the user agent is not used on a mobile device.', () => {
            expect(isMobile()).toBe(false);
        });
    });
});
