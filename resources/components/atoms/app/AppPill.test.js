import {
    mount,
} from '../../../../tests/app/vue/utils';

import AppPill from './AppPill';

let wrapper;

beforeEach(() => {
    wrapper = mount(AppPill);
});

describe('AppPill', () => {
    test('It should render a `<span>`.', () => {
        expect(wrapper.is('span')).toBe(true);
    });

    test('It should set the outline class.', async () => {
        await wrapper.setProps({ outline: true });

        expect(wrapper.classes('k-c-pill--outline')).toBe(true);
    });

    test('It should set the status class.', async () => {
        await wrapper.setProps({ status: 'error' });

        expect(wrapper.classes('k-c-pill--error')).toBe(true);
    });
});
