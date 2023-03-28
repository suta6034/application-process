import {
    download,
    downloadZip,
} from './download';

describe('download', () => {
    describe('download()', () => {
        test('It should be a function.', () => {
            expect(typeof download).toBe('function');
        });
    });

    describe('downloadZip()', () => {
        test('It should be a function.', () => {
            expect(typeof downloadZip).toBe('function');
        });
    });
});
