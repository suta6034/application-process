import {
    shallowMount,
} from '../../../../tests/app/vue/utils';

import AppLink from './AppLink';

let wrapper;

beforeEach(() => {
    wrapper = shallowMount(AppLink);
});

describe('AppLink', () => {
    test('It should render a `<a>`.', () => {
        expect(wrapper.is('a')).toBe(true);
    });

    test('It should render an `<a>` if `to` is specified.', async () => {
        wrapper.setProps({ to: '/foo' });

        await wrapper.vm.$nextTick();

        expect(wrapper.is('a')).toBe(true);
    });

    test('It should be possible to add an icon.', () => {
        wrapper = shallowMount(AppLink, {
            slots: {
                icon: '<span data-qa="icon"></span>',
            },
        });

        expect(wrapper.contains('[data-qa="icon"]')).toBe(true);
    });
});
