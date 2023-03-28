import {
    shallowMount,
} from '../../../../tests/app/vue/utils';

import FormRadio from './FormRadio';

describe('FormRadio', () => {
    test('It should render a `<label>`.', () => {
        const wrapper = shallowMount(FormRadio);

        expect(wrapper.is('label')).toBe(true);
    });

    test('It should not be checked on initialization.', () => {
        const wrapper = shallowMount(FormRadio);

        expect(wrapper.contains('input:checked')).toBe(false);
    });

    test('It should be checked when property checked is true.', () => {
        const wrapper = shallowMount(FormRadio, {
            propsData: {
                checked: true,
            },
        });

        expect(wrapper.contains('input:checked')).toBe(true);
    });

    test('It should emit the `value` if it is changed to checked.', () => {
        const wrapper = shallowMount(FormRadio, {
            propsData: {
                checked: false,
                value: 'foo',
            },
        });

        wrapper.find('input').trigger('click');

        expect(wrapper.emitted().change).toEqual([['foo']]);
    });
});
