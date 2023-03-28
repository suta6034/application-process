import {
    mount,
} from '../../../../tests/app/vue/utils';

import AppSnackbar from './AppSnackbar';

let wrapper;

jest.useFakeTimers();

beforeEach(() => {
    wrapper = mount(AppSnackbar, {
        propsData: { text: 'what', icon: 'check' },
    });
});

describe('AppSnackbar', () => {
    test('It should render a `<div>`.', () => {
        expect(wrapper.is('div')).toBe(true);
    });

    test('It should render the given text.', async () => {
        wrapper.setProps({ text: 'Foo bar baz' });

        await wrapper.vm.$nextTick();

        expect(wrapper.find('[data-qa="text"]').text()).toBe('Foo bar baz');
    });

    test('It should render the icon supplied by the prop.', async () => {
        expect(wrapper.find('[data-qa="check icon"]').exists()).toBe(true);

        wrapper.setProps({ icon: 'cross' });
        await wrapper.vm.$nextTick();

        expect(wrapper.find('[data-qa="cross icon"]').exists()).toBe(true);
    });
});
