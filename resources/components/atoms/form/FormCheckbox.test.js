import {
    shallowMount,
} from '../../../../tests/app/vue/utils';

import FormCheckbox from './FormCheckbox';

describe('FormCheckbox', () => {
    test('It should render a `<label>`.', () => {
        const wrapper = shallowMount(FormCheckbox);

        expect(wrapper.is('label')).toBe(true);
    });

    test('It should not be checked on initialization.', () => {
        const wrapper = shallowMount(FormCheckbox);

        expect(wrapper.contains('input:checked')).toBe(false);
    });

    test('It should be checked when property checked is true.', () => {
        const wrapper = shallowMount(FormCheckbox, {
            propsData: {
                checked: true,
            },
        });

        expect(wrapper.contains('input:checked')).toBe(true);
    });

    test('It should be checked when property checked is the same as the `trueValue`.', () => {
        const wrapper = shallowMount(FormCheckbox, {
            propsData: {
                checked: 'foo',
                trueValue: 'foo',
            },
        });

        expect(wrapper.contains('input:checked')).toBe(true);
    });

    test('It should emit the `trueValue` if it is changed to checked.', () => {
        const wrapper = shallowMount(FormCheckbox, {
            propsData: {
                checked: false,
                trueValue: 'foo',
            },
        });
        const input = wrapper.find('input');

        input.trigger('click');

        expect(wrapper.emitted().change).toEqual([['foo']]);
    });

    test('It should emit the `falseValue` if it is changed to unchecked.', () => {
        const wrapper = shallowMount(FormCheckbox, {
            propsData: {
                checked: 'foo',
                trueValue: 'foo',
            },
        });
        const input = wrapper.find('input');

        input.trigger('click');

        expect(wrapper.emitted().change).toEqual([[false]]);
    });
});
