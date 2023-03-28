import scrollToElement from './scroll-to-element';

describe('scrollToElement()', () => {
    test('It should be a function.', () => {
        expect(typeof scrollToElement).toBe('function');
    });

    test('It should scroll to the offset top of the element.', () => {
        window.scrollTo = jest.fn();
        const $element = document.createElement('div');
        document.body.appendChild($element);

        scrollToElement($element, 'smooth');

        expect(window.scrollTo).toBeCalledWith({
            behavior: 'smooth',
            top: 0,
        });
    });

    test('It should take local scroll padding into account.', () => {
        window.scrollTo = jest.fn();
        const $element = document.createElement('div');
        window.getComputedStyle = jest.fn($htmlElement => (
            $htmlElement === $element ? { scrollPadding: '10px' } : {}));
        document.body.appendChild($element);

        scrollToElement($element);

        expect(window.getComputedStyle).toBeCalledWith($element);
        expect(window.scrollTo).toBeCalledWith({
            behavior: 'auto',
            top: -10,
        });
    });

    test('It should take local scroll padding top into account.', () => {
        window.scrollTo = jest.fn();
        const $element = document.createElement('div');
        window.getComputedStyle = jest.fn($htmlElement => (
            $htmlElement === $element ? { scrollPaddingTop: '20px' } : {}));
        document.body.appendChild($element);

        scrollToElement($element);

        expect(window.getComputedStyle).toBeCalledWith($element);
        expect(window.scrollTo).toBeCalledWith({
            behavior: 'auto',
            top: -20,
        });
    });

    test('It should take root scroll padding into account.', () => {
        window.scrollTo = jest.fn();
        const $html = document.querySelector('html');
        window.getComputedStyle = jest.fn($htmlElement => (
            $htmlElement === $html ? { scrollPadding: '10px' } : {}));
        const $element = document.createElement('div');
        document.body.appendChild($element);

        scrollToElement($element);

        expect(window.getComputedStyle).toBeCalledWith($html);
        expect(window.scrollTo).toBeCalledWith({
            behavior: 'auto',
            top: -10,
        });
    });

    test('It should take root scroll padding top into account.', () => {
        window.scrollTo = jest.fn();
        const $html = document.querySelector('html');
        window.getComputedStyle = jest.fn($htmlElement => (
            $htmlElement === $html ? { scrollPaddingTop: '20px' } : {}));
        const $element = document.createElement('div');
        document.body.appendChild($element);

        scrollToElement($element);

        expect(window.getComputedStyle).toBeCalledWith(document.querySelector('html'));
        expect(window.scrollTo).toBeCalledWith({
            behavior: 'auto',
            top: -20,
        });
    });
});
