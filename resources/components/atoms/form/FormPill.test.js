import {
    shallowMount,
} from '../../../../tests/app/vue/utils';

import FormPill from './FormPill';

describe('FormPill', () => {
    test('It should render a `<label>`.', () => {
        const wrapper = shallowMount(FormPill, {
            propsData: {
                label: 'foo',
            },
        });

        expect(wrapper.is('label')).toBe(true);
    });

    test('It should render a radio by default.', () => {
        const wrapper = shallowMount(FormPill, {
            propsData: {
                label: 'foo',
            },
        });
        const input = wrapper.find('input');

        expect(input.is('input[type="radio"]')).toBe(true);
    });

    test('It should not be checked on initialization.', () => {
        const wrapper = shallowMount(FormPill, {
            propsData: {
                label: 'foo',
            },
        });
        const input = wrapper.find('input');

        expect(input.is('input:checked')).toBe(false);
    });

    test('It should be checked when property `checked` is true.', () => {
        const wrapper = shallowMount(FormPill, {
            propsData: {
                label: 'foo',
                checked: true,
            },
        });
        const input = wrapper.find('input');

        expect(input.is('input:checked')).toBe(true);
    });

    test('It should be checked when property `checked` includes the value.', () => {
        const wrapper = shallowMount(FormPill, {
            propsData: {
                label: 'foo',
                value: 'foo',
                checked: ['foo', 'bar'],
            },
        });
        const input = wrapper.find('input');

        expect(input.is('input:checked')).toBe(true);
    });

    test('It should emit a change event with the `trueValue` if it gets checked.', () => {
        const wrapper = shallowMount(FormPill, {
            propsData: {
                label: 'foo',
            },
        });
        const input = wrapper.find('input');
        input.element.checked = true;
        input.trigger('change');

        expect(wrapper.emitted().change).toEqual([[true]]);
    });

    test('It should emit a change event with the `falseValue` if it gets unchecked.', () => {
        const wrapper = shallowMount(FormPill, {
            propsData: {
                label: 'foo',
            },
        });
        const input = wrapper.find('input');
        input.element.checked = false;
        input.trigger('change');

        expect(wrapper.emitted().change).toEqual([[false]]);
    });

    test('It should add its value to the array of checked values if it gets checked.', () => {
        const wrapper = shallowMount(FormPill, {
            propsData: {
                label: 'foo',
                value: 'bar',
                checked: ['foo'],
            },
        });
        const input = wrapper.find('input');
        input.element.checked = true;
        input.trigger('change');

        expect(wrapper.emitted().change).toEqual([[['foo', 'bar']]]);
    });

    test('It should remove its value from the array of checked values if it gets unchecked.', () => {
        const wrapper = shallowMount(FormPill, {
            propsData: {
                label: 'foo',
                value: 'foo',
                checked: ['foo', 'bar'],
            },
        });
        const input = wrapper.find('input');
        input.element.checked = false;
        input.trigger('change');

        expect(wrapper.emitted().change).toEqual([[['bar']]]);
    });
});
