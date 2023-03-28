import {
    showToast,
} from './toast';

jest.useFakeTimers();

describe('showToast', () => {
    test('it should show a toast', () => {
        showToast({
            text: 'Hello there',
        });

        const snackbarElement = document.body.querySelector('.c-appToast');
        expect(snackbarElement).not.toBe(null);
        expect(snackbarElement.innerHTML).toContain('Hello there');
    });

    test('it should remove the snackbar after some time has passed', async () => {
        showToast();

        let snackbarElement = document.body.querySelector('.c-appToast');
        expect(snackbarElement).not.toBe(null);

        jest.runAllTimers();

        snackbarElement = document.body.querySelector('.c-appToast');
        expect(snackbarElement).toBe(null);
    });

    test('it should show an icon if the status is success', () => {
        showToast({
            icon: 'check',
        });

        expect(document.body.querySelector('.c-appToast__icon')).not.toBe(null);
    });
});
