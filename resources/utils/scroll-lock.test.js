import {
    disableScrollLock,
    enableScrollLock,
} from './scroll-lock';

beforeEach(() => {
    window.scrollTo = jest.fn();
});

window.pageYOffset = 25;

describe('enableScrollLock()', () => {
    test('It should disable scrolling on the body tag.', async () => {
        enableScrollLock();

        const body = document.querySelector('body');

        expect(body.style.position).toBe('fixed');
        expect(body.style.width).toBe('100%');
        expect(body.style.top).toBe('-25px');
    });
});

describe('disableScrollLock()', () => {
    test('It should enable scrolling on the body tag and scroll to the previous position.', async () => {
        const body = document.querySelector('body');

        enableScrollLock();
        disableScrollLock();

        expect(body.style.position).not.toBe('fixed');
        expect(body.style.width).not.toBe('100%');
        expect(body.style.top).not.toBe('-25px');
        expect(window.scrollTo).toBeCalledWith(0, 25);
    });

    test('It should enable scrolling on the body tag.', async () => {
        const body = document.querySelector('body');

        disableScrollLock();

        expect(body.style.position).not.toBe('fixed');
        expect(body.style.width).not.toBe('100%');
        expect(body.style.top).not.toBe('-25px');
        expect(window.scrollTo).not.toBeCalled();
    });
});
