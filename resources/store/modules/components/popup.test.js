import popup from './popup';

let mockState;

beforeEach(() => {
    mockState = {
        active: false,
        ariaLabel: '',
        componentName: '',
        componentProps: {},
        focusElementSelector: null,
        showCloseButton: false,
    };
});

describe('popup', () => {
    describe('mutations', () => {
        describe('SHOW_POPUP', () => {
            test('It should activate the popup.', () => {
                popup.mutations.SHOW_POPUP(mockState, {
                    ariaLabel: 'foo bar',
                    componentName: 'myComponentName',
                });

                expect(mockState).toEqual({
                    active: true,
                    ariaLabel: 'foo bar',
                    componentName: 'myComponentName',
                    componentProps: {},
                    focusElementSelector: null,
                    showCloseButton: true,
                    title: '',
                    type: 'modal',
                });
            });
        });

        describe('HIDE_POPUP', () => {
            test('It should hide the popup.', () => {
                popup.mutations.HIDE_POPUP(mockState);

                expect(mockState).toEqual({
                    active: false,
                    ariaLabel: '',
                    componentName: '',
                    componentProps: {},
                    focusElementSelector: null,
                    showCloseButton: false,
                });
            });
        });
    });
});
