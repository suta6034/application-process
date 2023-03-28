import {
    shallowMount,
} from '../../../../tests/app/vue/utils';

import FormSwitch from './FormSwitch';

let wrapper;

beforeEach(() => {
    wrapper = shallowMount(FormSwitch, {
        propsData: { value: false },
        stubs: { 'app-icon': true },
    });
});

describe('FormSwitch', () => {
    test('It should render a `<div>`.', () => {
        expect(wrapper.is('div')).toBe(true);
    });

    test('It should render the given radios.', async () => {
        wrapper.setProps({
            radios: [
                {
                    label: 'Foo',
                },
                {
                    label: 'Bar',
                },
            ],
        });

        await wrapper.vm.$nextTick();

        expect(wrapper.contains('[data-qa="radio 1"]')).toBe(true);
        expect(wrapper.contains('[data-qa="radio 2"]')).toBe(true);
    });

    test('It should render icons if one is provided.', async () => {
        wrapper.setProps({
            radios: [
                {
                    label: 'Foo',
                    icon: 'foo',
                },
                {
                    label: 'Bar',
                    icon: 'bar',
                },
            ],
        });

        await wrapper.vm.$nextTick();

        expect(wrapper.contains('[data-qa="radio 1"] [data-qa="icon"]')).toBe(true);
        expect(wrapper.contains('[data-qa="radio 2"] [data-qa="icon"]')).toBe(true);
    });

    test('It should select the option with the given value.', async () => {
        wrapper.setProps({
            radios: [
                {
                    label: 'Foo',
                    value: true,
                },
                {
                    label: 'Bar',
                    value: false,
                },
            ],
        });

        await wrapper.vm.$nextTick();

        expect(wrapper.contains('[data-qa="radio 2"] input:checked')).toBe(true);
    });

    test('It should emit the new value when a radio is activated.', async () => {
        wrapper.setProps({
            radios: [
                {
                    label: 'Foo',
                    value: true,
                },
                {
                    label: 'Bar',
                    value: false,
                },
            ],
        });
        await wrapper.vm.$nextTick();

        wrapper.find('[data-qa="radio 2"] input').trigger('change');
        await wrapper.vm.$nextTick();

        expect(wrapper.emitted().change).toEqual([[false]]);
    });

    test('It should not emit the new value when the switch is disabled.', async () => {
        wrapper.setProps({
            radios: [
                {

                    label: 'Foo',
                    value: true,
                },
                {
                    label: 'Bar',
                    value: false,
                },
            ],
            disabled: true,
        });
        await wrapper.vm.$nextTick();

        wrapper.find('[data-qa="radio 2"] input').trigger('change');
        await wrapper.vm.$nextTick();
        expect(wrapper.emitted().change).not.toBeDefined();
    });
});
