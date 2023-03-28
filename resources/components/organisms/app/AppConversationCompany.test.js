import {
    mount,
} from '../../../../tests/app/vue/utils';

import AppConversationCompany from './AppConversationCompany';

let wrapper;

describe('AppConversationCompany', () => {
    test('It should show the company if the company is active.', () => {
        wrapper = mount(AppConversationCompany, {
            propsData: {
                conversation: {
                    type: 'conversation',
                    id: 'conversation-1',
                    company: {
                        slug: 'foo-bar',
                    },
                },
                hasNoCompany: false,
            },
        });
        expect(wrapper.contains('[data-qa="has company"]')).toBe(true);
    });

    test('It should show the correct empty state text for the inactive company.', () => {
        wrapper = mount(AppConversationCompany, {
            propsData: {
                conversation: {
                    type: 'conversation',
                    id: 'conversation-1',
                },
                hasNoCompany: true,
            },
        });
        expect(wrapper.find('[data-qa="empty state text"]').text())
            .toMatch('Dieser Arbeitgeber hat kein Profil mehr auf karriere.at.');
    });
});
