import {
    shallowMount,
} from '../../../../tests/app/vue/utils';

import AppIcon from './AppIcon';

let wrapper;

const name = 'cross';

beforeEach(() => {
    wrapper = shallowMount(AppIcon, {
        propsData: { name },
    });
});

describe('AppIcon', () => {
    test('It should render an `<AppSvgIcon-Stub>`.', () => {
        expect(wrapper.is('AppSvgIcon-Stub')).toBe(true);
    });

    describe('Icon versions', () => {
        test('It should load the `s` version by default.', () => {
            expect(wrapper.attributes().name).toBe(`${name}--s`);
        });

        test('It should load the `s` version if the size is `s`.', async () => {
            wrapper.setProps({ size: 's' });
            await wrapper.vm.$nextTick();

            expect(wrapper.attributes().name).toBe(`${name}--s`);
        });

        test('It should load the `s` version if the size is `l`.', async () => {
            wrapper.setProps({ size: 'l' });
            await wrapper.vm.$nextTick();

            expect(wrapper.attributes().name).toBe(`${name}--s`);
        });

        test('It should load the `s` version if the size is `xl`.', async () => {
            wrapper.setProps({ size: 'xl' });
            await wrapper.vm.$nextTick();

            expect(wrapper.attributes().name).toBe(`${name}--s`);
        });

        test('It should load the `m` version if the size is `2xl`.', async () => {
            wrapper.setProps({ size: '2xl' });
            await wrapper.vm.$nextTick();

            expect(wrapper.attributes().name).toBe(`${name}--m`);
        });

        test('It should load the `m` version if the size is `3xl`.', async () => {
            wrapper.setProps({ size: '3xl' });
            await wrapper.vm.$nextTick();

            expect(wrapper.attributes().name).toBe(`${name}--m`);
        });
    });
});
