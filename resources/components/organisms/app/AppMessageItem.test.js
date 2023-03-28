import {
    shallowMount,
} from '../../../../tests/app/vue/utils';

import AppMessageItem from './AppMessageItem';
import {
    SMALL_DEVICE,
} from '../../../../tests/app/jest-setup';

describe('AppMessageItem', () => {
    test('It should render a `<div>`.', () => {
        const wrapper = shallowMount(AppMessageItem);

        expect(wrapper.is('div')).toBe(true);
    });

    test('It should render a skeleton view if the loading property is set.', () => {
        const wrapper = shallowMount(AppMessageItem, { propsData: { conversation: null } });

        expect(wrapper.contains('[data-qa="skeleton box"]')).toBe(true);
    });

    test('It should emit a `clicked` event when clicking the link on a desktop device.', async () => {
        global.innerWidth = 1200;
        const wrapper = shallowMount(AppMessageItem, {
            propsData: {
                conversation: {
                    id: '1',
                    read: true,
                    replied: true,
                },
            },
        });

        const firstMessage = wrapper.find('[data-qa="conversation subject link"]');
        await firstMessage.trigger('click');

        expect(wrapper.emitted('clicked')).toBeDefined();
    });

    test('It should not emit a `clicked` event when clicking the link on a mobile device.', async () => {
        global.innerWidth = SMALL_DEVICE;
        const wrapper = shallowMount(AppMessageItem, {
            propsData: {
                conversation: {
                    id: '1',
                    read: true,
                    replied: true,
                },
            },
        });

        const firstMessage = wrapper.find('[data-qa="conversation subject link"]');
        await firstMessage.trigger('click');

        expect(wrapper.emitted('clicked')).not.toBeDefined();
    });
});
