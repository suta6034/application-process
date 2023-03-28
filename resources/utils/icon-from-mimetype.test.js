import iconFromMimetype from './icon-from-mimetype';

describe('iconFromMimetype()', () => {
    test('It should be a function.', () => {
        expect(typeof iconFromMimetype).toBe('function');
    });

    test('It should return the PDF icon for PDFs.', () => {
        expect(iconFromMimetype('application/pdf')).toBe('file-pdf');
    });

    test('It should return the image icon for images.', () => {
        expect(iconFromMimetype('image/jpg')).toBe('file-image');
    });

    test('It should return the text icon by default.', () => {
        expect(iconFromMimetype('some/mime')).toBe('file-text');
    });
});
