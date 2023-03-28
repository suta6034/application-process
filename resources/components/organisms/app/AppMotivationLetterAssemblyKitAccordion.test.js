import {
    mount,
} from '../../../../tests/app/vue/utils';

import AppMotivationLetterAssemblyKitAccordion from './AppMotivationLetterAssemblyKitAccordion';

describe('AppMotivationLetterAssemblyKitAccordion', () => {
    test('It should render a `<div>`.', () => {
        const wrapper = mount(AppMotivationLetterAssemblyKitAccordion, {
            props: {
                label: 'Headline',
                items: [
                    {
                        text: 'Foo',
                    },
                ],
            },
        });

        expect(wrapper.element.tagName).toBe('DIV');
    });

    test('It should open the accordion if the initially active prop is set.', async () => {
        const wrapper = mount(AppMotivationLetterAssemblyKitAccordion, {
            propsData: {
                label: 'Headline',
                items: [
                    {
                        text: 'Foo',
                    },
                ],
                isActiveInitially: true,
            },
        });

        expect(wrapper.find('[data-qa="items"]').isVisible()).toBe(true);
    });
});
