import {
    mount,
} from '../../../../tests/app/vue/utils';

import AppAccordion from './AppAccordion';
import AppShowMore from './AppShowMore';

let wrapper;

beforeEach(() => {
    wrapper = mount(AppShowMore);
});

describe('AppShowMore', () => {
    test('It should render an `<AppAccordion>`.', () => {
        expect(wrapper.findComponent(AppAccordion).exists()).toBe(true);
    });

    test('It should render an icon if one is provided.', () => {
        wrapper = mount(AppShowMore, {
            slots: {
                icon: '<div data-qa="icon"></div>',
            },
        });

        expect(wrapper.find('[data-qa="icon"]').exists()).toBe(true);
    });

    test('It should not render an icon if no icon is given.', () => {
        wrapper = mount(AppShowMore);

        expect(wrapper.find('[data-qa="icon"]').exists()).toBe(false);
    });

    describe('Read more slot activated', () => {
        beforeEach(() => {
            wrapper = mount(AppShowMore, {
                slots: {
                    more: '<p>Foo bar baz</p>',
                },
            });
        });

        test('It should render a read more link.', () => {
            expect(wrapper.find('[data-qa="read more"]').exists()).toBe(true);
        });

        test('It shouldn\'t render the more text by default.', () => {
            expect(wrapper.find('[data-qa="more"]').exists()).toBe(false);
        });

        test('It should render the more text after clicking the read more link.', async () => {
            await wrapper.find('[data-qa="read more"]').trigger('click');

            expect(wrapper.find('[data-qa="more"]').exists()).toBe(true);
        });

        test('It should hide the read more link after clicking the read more link.', () => {
            wrapper.find('[data-qa="read more"]').trigger('click');

            expect(wrapper.find('[data-qa="read more"].a-fade-out').exists()).toBe(false);
        });

        test('It should render the read less link after clicking the read more link.', async () => {
            await wrapper.find('[data-qa="read more"]').trigger('click');

            expect(wrapper.find('[data-qa="read less"]').exists()).toBe(true);
        });
    });
});
