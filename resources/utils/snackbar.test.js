import {
    showSnackbar,
} from './snackbar';

jest.useFakeTimers();

describe('showSnackbar', () => {
    test('it should show a snackbar', () => {
        showSnackbar({
            text: 'Hello there',
        });

        const snackbarElement = document.body.querySelector('.c-appSnackbar');
        expect(snackbarElement).not.toBe(null);
        expect(snackbarElement.innerHTML).toContain('Hello there');
    });

    test('it should remove the snackbar after some time has passed', async () => {
        showSnackbar();

        let snackbarElement = document.body.querySelector('.c-appSnackbar');
        expect(snackbarElement).not.toBe(null);

        jest.runAllTimers();

        snackbarElement = document.body.querySelector('.c-appSnackbar');
        expect(snackbarElement).toBe(null);
    });

    test('it should show an icon', () => {
        showSnackbar({
            icon: 'cross',
        });

        expect(document.body.querySelector('.k-c-snackbar__icon')).not.toBe(null);
    });

    test('it should give the icon its own css class based on icon name', () => {
        const icon = 'cross';
        showSnackbar({
            icon,
        });

        expect(document.body.querySelector(`.c-appSnackbar__icon--${icon}`)).not.toBe(null);
    });
});
