import {
    isEmbedded,
} from './frame-check';

describe('frame-check', () => {
    describe('isEmbedded', () => {
        test('It should be a function.', () => {
            expect(typeof isEmbedded).toBe('function');
        });
    });
});
