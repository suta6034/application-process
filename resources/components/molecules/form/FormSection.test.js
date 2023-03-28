import {
    shallowMount,
} from '../../../../tests/app/vue/utils';

import FormSection from './FormSection';

describe('FormSection', () => {
    test('It should render a `<div>`.', () => {
        const wrapper = shallowMount(FormSection);

        expect(wrapper.is('div')).toBe(true);
    });

    test('It should contain a headline if the headline slot is used.', () => {
        const wrapper = shallowMount(FormSection, {
            slots: {
                headline: '<h2>Some headline</h2>',
            },
        });
        expect(wrapper.contains('[data-qa="headline"]')).toBe(true);
    });

    test('It shouldn\'t contain a headline if the headline slot isn\'t used.', () => {
        const wrapper = shallowMount(FormSection);

        expect(wrapper.contains('[data-qa="headline"]')).toBe(false);
    });
});
