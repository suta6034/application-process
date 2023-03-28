import {
    focusFirstStatus,
} from './form-focus';
// import { mount } from '@vue/test-utils';

// const MockComponent = {
//     template: `
//         <input aria-label="Text">
//     `,
// };

describe('focusFirstStatus()', () => {
    test('It should be a function.', () => {
        expect(typeof focusFirstStatus).toBe('function');
    });
    // test('It should focus the given Element.', () => {
    //     const wrapper = mount(MockComponent);
    //     const input = wrapper.find('input');
    //
    //     focusFirstStatus(input);
    //     expect(input).toBe(document.activeElement);
    // });
});
