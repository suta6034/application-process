import {
    shallowMount,
} from '../../../../tests/app/vue/utils';

import AppMessageReply from './AppMessageReply';

// TODO: refactor mocks, the data is not exactly like the original
const recruiterData = {
    job: {
        title: 'Testjob',
    },
    sender: {
        name: 'Recruiter',
        type: 'companyUser',
    },
    receiver: {
        name: 'Laura',
        type: 'user',
    },
};

const messageMocks = {
    allBrokenAttachments: {
        body: 'This is a message body',
        ...recruiterData,
        attachments: [
            {
                url: '',
                name: 'foo',
            },
            {
                url: '',
                name: 'bar',
            },
        ],
    },
    someBrokenAttachments: {
        body: 'This is a message body',
        ...recruiterData,
        attachments: [
            {
                url: '',
                name: 'foo',
            },
            {
                url: 'foo.bar',
                name: 'foo',
            },
        ],
    },
    noAttachments: {
        body: 'This is a message body',
        ...recruiterData,
        attachments: [],
    },
    recruiter: {
        body: 'This is a message body',
        ...recruiterData,
        attachments: [
            {
                url: 'foo.bar',
                name: 'foo',
            },
        ],
    },
    candidate: {
        body: 'This is a message body',
        job: {
            title: 'Testjob',
        },
        sender: {
            name: 'Laura',
            type: 'user',
        },
        receiver: {
            name: 'Recruiter',
            type: 'companyUser',
        },
    },
};

const conversationMocks = {
    default: {
        company: {
            name: 'Foo',
        },
        recruiter: {
            name: 'Bar Foo',
        },
        messages: [],
    },
};

const makeWrapper = propsData => shallowMount(AppMessageReply, {
    propsData: {
        message: messageMocks.recruiter,
        conversation: conversationMocks.default,
        ...propsData,
    },
    slots: {
        message: 'This is a message',
    },
});

describe('AppMessageReply', () => {
    test('It should render a `<div>`.', () => {
        const wrapper = makeWrapper();

        expect(wrapper.element.tagName).toBe('DIV');
    });

    test('It should render a list of attachments if the message has attachments.', () => {
        const wrapper = makeWrapper({
            message: messageMocks.recruiter,
        });

        expect(wrapper.find('[data-qa="file list"]').isVisible()).toBe(true);
    });

    test('It should not render an attachment list if there are no attachments.', () => {
        const wrapper = makeWrapper({
            message: messageMocks.noAttachments,
        });

        expect(wrapper.find('[data-qa="file list"]').exists()).toBe(false);
    });

    test('It should render a failure information only when all attachments are broken.', () => {
        let wrapper = makeWrapper({
            message: messageMocks.allBrokenAttachments,
        });

        expect(wrapper.find('[data-qa="all broken attachments"]').exists()).toBe(true);

        wrapper = makeWrapper({
            message: messageMocks.someBrokenAttachments,
        });

        expect(wrapper.find('[data-qa="all broken attachments"]').exists()).toBe(false);
    });
});
