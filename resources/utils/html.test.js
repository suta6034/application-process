import {
    convertLineBreaks,
    decodeHTML,
} from './html';

let text;
describe('convertLineBreaks()', () => {
    test('It should convert new line indicator \r\n to `<br>`.', () => {
        text = 'test\r\n';

        expect(convertLineBreaks(text)).toBe('test<br>');
    });
    test('It should convert new line indicator \r to `<br>`.', () => {
        text = 'test\r';

        expect(convertLineBreaks(text)).toBe('test<br>');
    });
    test('It should convert new line indicator \n to `<br>`.', () => {
        text = 'test\n';

        expect(convertLineBreaks(text)).toBe('test<br>');
    });
});

describe('decodeHTML()', () => {
    test('It should decode HTML entities', () => {
        text = '&#062;test&#060;';

        expect(decodeHTML(text)).toBe('>test<');
    });
});
