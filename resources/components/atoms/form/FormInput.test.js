import {
    shallowMount,
} from '../../../../tests/app/vue/utils';

import FormInput from './FormInput';

let wrapper;

const helpers = {
    setValue(value) {
        wrapper.find('input').element.value = value;
        wrapper.find('input').trigger('input');
    },
};

beforeEach(() => {
    wrapper = shallowMount(FormInput);
});

describe('FormInput', () => {
    test('It should render an `<input>`.', () => {
        expect(wrapper.contains('input')).toBe(true);
    });

    test('It should have an error class on error.', async () => {
        wrapper.setProps({ status: 'error' });

        await wrapper.vm.$nextTick();

        expect(wrapper.find('input').classes()).toContain('has-status-error');
    });

    test('It should emit an `input` event.', () => {
        helpers.setValue('Some text');

        expect(wrapper.emitted().input[0][0]).toBe('Some text');
        expect(wrapper.emitted().input[0][1]).toBeInstanceOf(Event);
    });

    describe('Character limit', () => {
        test('It should limit the length of the value if a `limit` was set.', async () => {
            wrapper.setProps({ limit: 6 });

            await wrapper.vm.$nextTick();

            helpers.setValue('Foo Bar');

            await wrapper.vm.$nextTick();

            expect(wrapper.emitted().input[0][0]).toBe('Foo Ba');
        });

        test('It should emit an event with value `true` if a `limit` was set and reached.', async () => {
            wrapper.setProps({ limit: 6 });

            await wrapper.vm.$nextTick();

            helpers.setValue('Foo Bar');

            await wrapper.vm.$nextTick();

            expect(wrapper.emitted()['limit-reached']).toEqual([[true]]);
            expect(wrapper.emitted().input[0][0]).toBe('Foo Ba');
        });

        test('It should emit an event with value `false` if a `limit` was set but not reached.', async () => {
            wrapper.setProps({ limit: 6 });

            await wrapper.vm.$nextTick();

            helpers.setValue('Foo B');

            await wrapper.vm.$nextTick();

            expect(wrapper.emitted()['limit-reached']).toEqual([[false]]);
            expect(wrapper.emitted().input[0][0]).toBe('Foo B');
        });
    });

    test('It should update the value when using arrow keys.', async () => {
        wrapper.find('input').element.value = 'Foo Bar';
        wrapper.find('input').trigger('input', { key: 'ArrowUp' });

        await wrapper.vm.$nextTick();

        expect(wrapper.emitted().input[0][0]).toBe('Foo Bar');
    });

    describe('Edge quirks', () => {
        test('It should update the value when using arrow keys.', async () => {
            wrapper.find('input').element.value = 'Foo Bar';
            wrapper.find('input').trigger('keyup', { key: 'Up' });

            await wrapper.vm.$nextTick();

            expect(wrapper.emitted().input[0][0]).toBe('Foo Bar');
        });

        test('It should update the value when using arrow keys.', async () => {
            wrapper.find('input').element.value = 'Foo Bar';
            wrapper.find('input').trigger('keyup', { key: 'Down' });

            await wrapper.vm.$nextTick();

            expect(wrapper.emitted().input[0][0]).toBe('Foo Bar');
        });

        test('It should not update the value when using enter key.', async () => {
            wrapper.find('input').element.value = 'Foo Bar';
            wrapper.find('input').trigger('keyup', { key: 'Enter' });

            await wrapper.vm.$nextTick();

            expect(wrapper.emitted().input).not.toBe('Foo Bar');
        });
    });

    describe('Adapter', () => {
        test('It should adapt the format and the emitted value', async () => {
            wrapper = shallowMount(FormInput, {
                propsData: {
                    formatAdapter: value => `@${value}`,
                    valueAdapter: value => value.replace('@', ''),
                },
            });

            helpers.setValue('Foo Bar');

            await wrapper.vm.$nextTick();

            expect(wrapper.find('input').element.value).toBe('@Foo Bar');
            expect(wrapper.emitted().input[0][0]).toBe('Foo Bar');
        });
    });
});
