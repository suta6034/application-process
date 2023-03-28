import {
    mount,
} from '../../../../tests/app/vue/utils';

import AppConversationItem from './AppConversationItem';
import {
    LARGE_DEVICE,
} from '../../../../tests/app/jest-setup';

const mockConversations = {
    default: {
        id: 'test',
        company: {
            name: 'asdf',
            isActive: true,
        },
        recruiter: {
            name: 'foo',
        },
        latestSendDate: '2021-10-17T06:25:01+02:00',
        subject: 'Test',
    },
    inactiveCompany: {
        id: 'test',
        company: {
            name: 'asdf',
            isActive: false,
        },
        recruiter: {
            name: 'foo',
        },
        latestSendDate: '2021-10-17T06:25:01+02:00',
        subject: 'Test',
    },
};

describe('AppMessageItem', () => {
    test('It should render a `<div>`.', () => {
        const wrapper = mount(AppConversationItem);

        expect(wrapper.element.tagName).toBe('LI');
    });

    test('It should render a skeleton view if the loading property is set.', () => {
        const wrapper = mount(AppConversationItem, { propsData: { conversation: undefined } });

        expect(wrapper.find('[data-qa="headline loading skeleton box"]').exists()).toBe(true);
        expect(wrapper.find('[data-qa="snippet loading skeleton box"]').exists()).toBe(true);
        expect(wrapper.find('[data-qa="skeleton box"]').exists()).toBe(true);
    });

    test('It should show the delete button if the item can be deleted.', () => {
        const wrapper = mount(AppConversationItem, {
            propsData: {
                conversation: mockConversations.default,
                isDeletable: true,
            },
        });

        expect(wrapper.find('[data-qa="delete button"]').exists()).toBe(true);
    });

    test('It should select the element in desktop mode when clicking on it.', async () => {
        global.innerWidth = LARGE_DEVICE;
        const wrapper = mount(AppConversationItem, {
            propsData: {
                conversation: mockConversations.default,
                isDeletable: true,
            },
        });
        const headlineLink = wrapper.find('[data-qa="conversation subject link"]');
        await headlineLink.trigger('click');

        expect(wrapper.emitted('selected')).toBeTruthy();
    });

    test('It should render an inactive state the delete button if the item can be deleted.', () => {
        const wrapper = mount(AppConversationItem, {
            propsData: {
                conversation: mockConversations.inactiveCompany,
                isDeletable: true,
            },
        });

        expect(wrapper.find('[data-qa="inactive badge"]').exists()).toBe(true);
    });

    test('It should render an inactive state the delete button if the item can be deleted.', () => {
        const wrapper = mount(AppConversationItem, {
            propsData: {
                conversation: mockConversations.default,
                isDeletable: true,
            },
        });

        expect(wrapper.find('[data-qa="company info"]').exists()).toBe(true);
    });
});
