import Router from 'vue-router';
import {
    createLocalVue,
    mount,
} from '@vue/test-utils';

import AppButton from './AppButton';

let wrapper;
const localVue = createLocalVue();
const router = new Router({
    routes: [
        {
            path: '/foo-bar',
            name: 'foo-bar',
        },
    ],
    mode: 'history',
});

localVue.use(Router);

beforeEach(() => {
    wrapper = mount(AppButton, { localVue, router });
});

describe('AppButton', () => {
    test('It should render a `<button>`.', () => {
        expect(wrapper.element.tagName).toBe('BUTTON');
    });

    test('It should render an `<a>` with a resolved href if `to` is specified.', async () => {
        await wrapper.setProps({ to: { name: 'foo-bar' } });

        expect(wrapper.element.tagName).toBe('A');
        expect(wrapper.attributes('href')).toBe('/foo-bar');
    });

    test('It should set the disabled attribute and class.', async () => {
        await wrapper.setProps({ disabled: true });

        expect(wrapper.classes('k-c-button--disabled')).toBe(true);
        expect(wrapper.attributes('disabled')).toBe('disabled');
    });

    test('It should be possible to change the size.', async () => {
        await wrapper.setProps({ size: 's' });

        expect(wrapper.classes('k-c-button--s')).toBe(true);
    });

    test('It should be possible to use the slim variant.', async () => {
        await wrapper.setProps({ slim: true });

        expect(wrapper.classes('k-c-button--slim')).toBe(true);
    });

    describe('width', () => {
        test('It should be possible to change the width to condensed.', async () => {
            await wrapper.setProps({ width: 'condensed' });

            expect(wrapper.classes('k-c-button--condensed')).toBe(true);
        });

        test('It should be possible to change the width to full.', async () => {
            await wrapper.setProps({ width: 'full' });

            expect(wrapper.classes('k-c-button--full')).toBe(true);
        });
    });

    describe('outline', () => {
        test('It should be possible to change the variant to the default outline.', async () => {
            await wrapper.setProps({ outline: true });

            expect(wrapper.classes('k-c-button--outline')).toBe(true);
        });

        test('It should be possible to change the variant to outlineGray.', async () => {
            await wrapper.setProps({ outline: 'outlineGray' });

            expect(wrapper.classes('k-c-button--outlineGray')).toBe(true);
        });

        test('It should be possible to change the variant to outlineWhite.', async () => {
            await wrapper.setProps({ outline: 'outlineGray' });

            expect(wrapper.classes('k-c-button--outlineGray')).toBe(true);
        });
    });

    describe('color', () => {
        test('It should be possible to change the color to red.', async () => {
            await wrapper.setProps({ color: 'red' });

            expect(wrapper.classes('k-c-button--red')).toBe(true);
        });

        test('It should be possible to change the color to blue.', async () => {
            await wrapper.setProps({ color: 'blue' });

            expect(wrapper.classes('k-c-button--blue')).toBe(true);
        });
    });

    describe('icon', () => {
        test('It should be possible to set an icon on the left side.', async () => {
            wrapper = mount(AppButton, {
                slots: {
                    iconLeft: '<span>icon</span>',
                },
            });

            expect(wrapper.classes('k-c-button--icon')).toBe(true);
            expect(wrapper.find('[data-qa="icon left"]').exists()).toBe(true);
        });

        test('It should be possible to set an icon on the right side.', async () => {
            wrapper = mount(AppButton, {
                slots: {
                    iconRight: '<span>icon</span>',
                },
            });

            expect(wrapper.classes('k-c-button--icon')).toBe(true);
            expect(wrapper.classes('k-c-button--iconRight')).toBe(true);
            expect(wrapper.find('[data-qa="icon right"]').exists()).toBe(true);
        });
    });
});
