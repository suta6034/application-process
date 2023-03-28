import {
    shallowMount,
} from '../../../../tests/app/vue/utils';

import AppToggle from './AppToggle';

let wrapper;

beforeEach(() => {
    wrapper = shallowMount(AppToggle);
});

describe('AppToggle', () => {
    test('It should render a `<label>`.', () => {
        expect(wrapper.is('label')).toBe(true);
    });

    test('It should emit an input event when the input is clicked.', () => {
        wrapper.find('[data-qa="toggle input"]').trigger('click');
        expect(wrapper.emitted().input).toBeTruthy();
    });

    test('It should change to true when the toggle was false.', () => {
        const input = wrapper.find('[data-qa="toggle input"]');
        input.trigger('click');

        expect(input.element.checked).toBe(true);
    });

    test('It should change to false when the toggle was true.', () => {
        wrapper = shallowMount(AppToggle, {
            propsData: {
                value: true,
            },
        });
        const input = wrapper.find('[data-qa="toggle input"]');
        input.trigger('click');

        expect(input.element.checked).toBe(false);
    });
});
