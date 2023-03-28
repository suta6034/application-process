import {
    shallowMount,
} from '../../../../tests/app/vue/utils';

import FormMessage from './FormMessage';

describe('FormMessage', () => {
    test('It should render a `<ul>`.', () => {
        const wrapper = shallowMount(FormMessage);

        expect(wrapper.is('ul')).toBe(true);
    });

    test('It should render a message with an error class on error.', () => {
        const wrapper = shallowMount(FormMessage, {
            propsData: { type: 'error' },
        });

        expect(wrapper.classes()).toContain('c-formMessage--error');
    });
});
