import {
    mount,
    shallowMount,
} from '../../../../tests/app/vue/utils';

import FormPillSelect from './FormPillSelect';

describe('FormPillSelect', () => {
    test('It should render a `<div>`.', () => {
        const wrapper = shallowMount(FormPillSelect, {
            propsData: {
                name: 'foo',
            },
        });

        expect(wrapper.is('div')).toBe(true);
    });

    test('It should render inputs from pills.', () => {
        const wrapper = mount(FormPillSelect, {
            propsData: {
                name: 'foo',
                options: [
                    {
                        id: 1,
                        label: 'Foo',
                    },
                    {
                        id: 2,
                        label: 'Bar',
                    },
                ],
            },
        });

        expect(wrapper.contains('input')).toBe(true);
    });

    test('It should check the corresponding pill for the set value.', () => {
        const wrapper = mount(FormPillSelect, {
            propsData: {
                name: 'foo',
                value: { id: 1, label: 'Foo' },
                options: [
                    {
                        id: 1,
                        label: 'Foo',
                    },
                ],
            },
        });

        expect(wrapper.contains('input:checked')).toBe(true);
    });
});
