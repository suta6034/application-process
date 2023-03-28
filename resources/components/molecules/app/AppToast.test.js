import {
    mount,
} from '../../../../tests/app/vue/utils';

import AppToast from './AppToast';

let wrapper;

jest.useFakeTimers();

beforeEach(() => {
    wrapper = mount(AppToast, {
        props: { text: '' },
    });
});

describe('AppToast', () => {
    test('It should render a `<div>`.', () => {
        expect(wrapper.is('div')).toBe(true);
    });

    test('It should render the given text.', async () => {
        wrapper.setProps({ text: 'Foo bar baz' });

        await wrapper.vm.$nextTick();

        expect(wrapper.find('[data-qa="text"]').text()).toBe('Foo bar baz');
    });

    test('It should render a success icon if the status is `success`.', () => {
        wrapper.setProps({ status: 'success' });

        expect(wrapper.contains('[data-qa="success icon"]')).toBe(true);
    });

    test('It should get visible after a timeout.', async () => {
        jest.advanceTimersByTime(1000);

        await wrapper.vm.$nextTick();

        expect(wrapper.is('.is-visible')).toBe(true);
    });

    test('It should be hidden after the initial timeout + visible duration.', async () => {
        jest.advanceTimersByTime(3000);

        await wrapper.vm.$nextTick();

        expect(wrapper.is('.is-visible')).toBe(false);
    });
});
