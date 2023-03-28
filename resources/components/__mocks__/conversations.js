export const conversationsServiceResponses = {
    empty: {
        data: [],
        meta: {
            pagination: {
                number: 1,
                pages: 1,
                size: 0,
                total: 0,
            },
        },
        included: [],
    },
    pageOne: {
        data: [
            {
                type: 'conversation',
                id: 'c3b8f9de-bdca-4e55-b7aa-4ce473006732',
                read: false,
                replied: false,
                approved: false,
                rejected: false,
                deleted: false,
                latestSendDate: '2021-10-17T06:25:01+02:00',
                subject: 'This is dummy data1',
                messages: [
                    {
                        type: 'message',
                        id: 'message-1',
                        meta: {
                            sendDate: '2021-10-15T10:01:01+02:00',
                        },
                        attributes: {
                            subject: 'foo',
                            body: 'bar',
                        },
                        sender: {
                            data: {
                                type: 'companyUser',
                                id: 'company-1',
                            },
                        },
                        recipient: {
                            data: {
                                type: 'user',
                                id: 'user-1',
                            },
                        },
                        job: {
                            data: {
                                type: 'job',
                                id: 'job-1',
                            },
                        },
                    },
                    {
                        type: 'message',
                        id: 'message-2',
                        meta: {
                            sendDate: '2021-10-15T10:01:01+03:00',
                        },
                        attributes: {
                            subject: 'foo2',
                            body: 'bar2',
                        },
                        sender: {
                            data: {
                                type: 'user',
                                id: 'user-2',
                            },
                        },
                        recipient: {
                            data: {
                                type: 'companyUser',
                                id: 'company-user-2',
                            },
                        },
                        job: {
                            data: {
                                type: 'job',
                                id: 'job-1',
                            },
                        },
                    },
                ],
                recruiter: {
                    data: {
                        type: 'user',
                        id: '15ded721-5ef8-5daa-9ad3-23344efde126',
                    },
                },
                company: {
                    data: {
                        type: 'company',
                        id: '136',
                        meta: {
                            active: true,
                            isChiffre: false,
                        },
                    },
                },
            },
            {
                type: 'conversation',
                id: '9c34d6b6-8c22-4f13-9105-1c73e783fdce',
                read: true,
                replied: false,
                approved: false,
                rejected: true,
                deleted: false,
                latestSendDate: '2021-10-15T10:01:01+02:00',
                subject: 'This is dummy data2',
                messages: [
                    {
                        type: 'message',
                        id: 'message-1',
                        meta: {
                            sendDate: '2021-10-15T10:01:01+02:00',
                        },
                        attributes: {
                            subject: 'foo',
                            body: 'bar',
                        },
                        sender: {
                            data: {
                                type: 'companyUser',
                                id: 'company-1',
                            },
                        },
                        recipient: {
                            data: {
                                type: 'user',
                                id: 'user-1',
                            },
                        },
                        job: {
                            data: {
                                type: 'job',
                                id: 'job-1',
                            },
                        },
                    },
                ],
                recruiter: {
                    data: {
                        type: 'user',
                        id: '15ded721-5ef8-5daa-9ad3-23344efde126',
                    },
                },
                company: {
                    data: {
                        type: 'company',
                        id: '136',
                        meta: {
                            active: true,
                            isChiffre: false,
                        },
                    },
                },
            },
            {
                type: 'conversation',
                id: 'aa89d107-54ae-4813-8d24-71ea5e1381f8',
                read: true,
                replied: true,
                approved: true,
                rejected: false,
                deleted: false,
                latestSendDate: '2021-10-14T11:25:09+02:00',
                subject: 'This is dummy data3',
                messages: [
                    {
                        type: 'message',
                        id: 'message-1',
                        meta: {
                            sendDate: '2021-10-15T10:01:01+02:00',
                        },
                        attributes: {
                            subject: 'foo',
                            body: 'bar',
                        },
                        sender: {
                            data: {
                                type: 'companyUser',
                                id: 'company-1',
                            },
                        },
                        recipient: {
                            data: {
                                type: 'user',
                                id: 'user-1',
                            },
                        },
                        job: {
                            data: {
                                type: 'job',
                                id: 'job-1',
                            },
                        },
                    },
                ],
                recruiter: {
                    data: {
                        type: 'user',
                        id: '15ded721-5ef8-5daa-9ad3-23344efde126',
                    },
                },
                company: {
                    data: {
                        type: 'company',
                        id: '136',
                        meta: {
                            active: true,
                            isChiffre: false,
                        },
                    },
                },
            },
            {
                type: 'conversation',
                id: '9c34d6b6-8c22-4f13-9105-1c73e783fdc2',
                read: true,
                replied: false,
                approved: false,
                rejected: true,
                deleted: false,
                latestSendDate: '2021-10-15T10:01:01+02:00',
                subject: 'This is dummy data2',
                recruiter: {
                    data: {
                        type: 'user',
                        id: '15ded721-5ef8-5daa-9ad3-23344efde126',
                    },
                },
                company: {
                    data: {
                        type: 'company',
                        id: '136',
                        meta: {
                            active: true,
                            isChiffre: false,
                        },
                    },
                },
            },
            {
                type: 'conversation',
                id: 'aa89d107-54ae-4813-8d24-71ea5e1381f9',
                read: true,
                replied: true,
                approved: true,
                rejected: false,
                deleted: false,
                latestSendDate: '2021-10-14T11:25:09+02:00',
                subject: 'This is dummy data3',
                messages: [
                    {
                        type: 'message',
                        id: 'message-1',
                        meta: {
                            sendDate: '2021-10-15T10:01:01+02:00',
                        },
                        attributes: {
                            subject: 'foo',
                            body: 'bar',
                        },
                        sender: {
                            data: {
                                type: 'companyUser',
                                id: 'company-1',
                            },
                        },
                        recipient: {
                            data: {
                                type: 'user',
                                id: 'user-1',
                            },
                        },
                        job: {
                            data: {
                                type: 'job',
                                id: 'job-1',
                            },
                        },
                    },
                ],
                recruiter: {
                    data: {
                        type: 'user',
                        id: '15ded721-5ef8-5daa-9ad3-23344efde126',
                    },
                },
                company: {
                    data: {
                        type: 'company',
                        id: '136',
                        meta: {
                            active: true,
                            isChiffre: false,
                        },
                    },
                },
            },
        ],
        meta: {
            pagination: {
                number: 1,
                size: 15,
                total: 5,
                pages: 1,
            },
        },
        included: [],
    },
    filtered: {
        data: [
            {
                type: 'conversation',
                id: 'aaa9d107-54ae-4813-8d24-71ea5e1381f7',
                read: true,
                replied: true,
                approved: true,
                rejected: false,
                deleted: true,
                latestSendDate: '2021-10-14T11:25:09+02:00',
                subject: 'This is dummy data3',
                messages: [
                    {
                        type: 'message',
                        id: 'message-1',
                        meta: {
                            sendDate: '2021-10-15T10:01:01+02:00',
                        },
                        attributes: {
                            subject: 'foo',
                            body: 'bar',
                        },
                        sender: {
                            data: {
                                type: 'companyUser',
                                id: 'company-1',
                            },
                        },
                        recipient: {
                            data: {
                                type: 'user',
                                id: 'user-1',
                            },
                        },
                        job: {
                            data: {
                                type: 'job',
                                id: 'job-1',
                            },
                        },
                    },
                ],
                recruiter: {
                    data: {
                        type: 'user',
                        id: '15ded721-5ef8-5daa-9ad3-23344efde126',
                    },
                },
                company: {
                    data: {
                        type: 'company',
                        id: '136',
                        meta: {
                            active: true,
                            isChiffre: false,
                        },
                    },
                },
            },
        ],
        meta: {
            pagination: {
                number: 1,
                size: 15,
                total: 1,
                pages: 1,
            },
        },
    },
    two: {
        data: [
            {
                type: 'conversation',
                id: 'aaa9d107-54ae-4813-8d24-71ea5e1381f8',
                read: true,
                replied: true,
                approved: true,
                rejected: false,
                deleted: true,
                latestSendDate: '2021-10-14T11:25:09+02:00',
                subject: 'This is conversation one',
                messages: [
                    {
                        type: 'message',
                        id: 'message-1',
                        meta: {
                            sendDate: '2021-10-15T10:01:01+02:00',
                        },
                        attributes: {
                            subject: 'foo',
                            body: 'bar',
                        },
                        sender: {
                            data: {
                                type: 'companyUser',
                                id: 'company-1',
                            },
                        },
                        recipient: {
                            data: {
                                type: 'user',
                                id: 'user-1',
                            },
                        },
                        job: {
                            data: {
                                type: 'job',
                                id: 'job-1',
                            },
                        },
                    },
                ],
                recruiter: {
                    data: {
                        type: 'user',
                        id: '15ded721-5ef8-5daa-9ad3-23344efde126',
                    },
                },
                company: {
                    data: {
                        type: 'company',
                        id: '001',
                        meta: {
                            active: true,
                            isChiffre: false,
                        },
                    },
                },
            },
            {
                type: 'conversation',
                id: '9c34d6b6-8c22-4f13-9105-1c73e783fdce',
                read: true,
                replied: true,
                approved: true,
                rejected: false,
                deleted: true,
                latestSendDate: '2021-10-15T11:25:09+02:00',
                subject: 'Re: Re: Re: Re: Re: Hello World this is an incredibly long title for a message',
                messages: [
                    {
                        type: 'message',
                        id: 'message-1',
                        meta: {
                            sendDate: '2021-10-15T10:01:01+02:00',
                        },
                        attributes: {
                            subject: 'foo',
                            body: 'bar',
                        },
                        sender: {
                            data: {
                                type: 'companyUser',
                                id: 'company-1',
                            },
                        },
                        recipient: {
                            data: {
                                type: 'user',
                                id: 'user-1',
                            },
                        },
                        job: {
                            data: {
                                type: 'job',
                                id: 'job-1',
                            },
                        },
                    },
                ],
                recruiter: {
                    data: {
                        type: 'user',
                        id: '15ded721-5ef8-5daa-9ad3-23344efde126',
                    },
                },
                company: {
                    data: {
                        type: 'company',
                        id: '002',
                        meta: {
                            active: true,
                            isChiffre: false,
                        },
                    },
                },
            },
        ],
        meta: {
            pagination: {
                number: 1,
                pages: 1,
                size: 15,
                total: 2,
            },
        },
    },
    three: {
        data: [
            {
                type: 'conversation',
                id: 'ab706a2f-85a0-4298-bfde-cdbd8ad92987',
                read: true,
                replied: false,
                approved: false,
                rejected: false,
                deleted: false,
                latestSendDate: '2022-05-04T16:17:04+02:00',
                subject: 'Neue Herausforderung und Entwicklungsmöglichkeit im Bereich Software-Qualitätssicherung?',
                messages: [],
                recruiter: { type: 'companyUser', id: '6b727a5e-fe64-4dc0-83db-05e3c195d9ca', name: 'Tatjana Soos' },
                recruiterFallback: { type: 'user', id: null, name: null },
                company: {
                    type: 'company',
                    id: '82212',
                    isActive: true,
                    isChiffre: false,
                    name: 'Qcentris GmbH',
                    slug: 'qcentris',
                },
            },
            {
                type: 'conversation',
                id: 'e7b59e98-83e6-41a7-9496-033e8b4f9f93',
                read: true,
                replied: false,
                approved: true,
                rejected: false,
                deleted: false,
                latestSendDate: '2022-04-08T17:05:24+02:00',
                subject: 'Software Engineer, Linz',
                messages: [],
                recruiter: {
                    type: 'companyUser',
                    id: '8158e95a-e775-50f7-b2d4-a3acc66f1549',
                    name: 'Team  Oberösterreich',
                },
                recruiterFallback: { type: 'user', id: null, name: null },
                company: {
                    type: 'company',
                    id: '79',
                    isActive: true,
                    isChiffre: false,
                    name: 'ISG Personalmanagement GmbH',
                    slug: 'isg-personalmanagement',
                },
            },
            {
                type: 'conversation',
                id: 'a0824328-b5a2-4ebf-bc64-39fcca95815f',
                read: true,
                replied: false,
                approved: false,
                rejected: false,
                deleted: false,
                latestSendDate: '2022-03-28T15:36:19+02:00',
                subject: 'Hello Marcus!',
                messages: [],
                recruiter: {
                    type: 'companyUser',
                    id: 'a228cea6-fcf0-44da-86b7-3609fc7fc80e',
                    name: 'Teodora Covaci',
                },
                recruiterFallback: {
                    type: 'user',
                    id: null,
                    name: null,
                },
                company: {
                    type: 'company',
                    id: '116612',
                    isActive: true,
                    isChiffre: false,
                    name: 'Einhorn GmbH Änderung',
                    slug: 'einhorn-gmbh',
                },
            },
        ],
        meta: {
            pagination: {
                number: 1,
                size: 3,
                total: 46,
                pages: 16,
            },
        },
    },
};

export const messagesMocks = {
    one: [
        {
            job: {
                title: 'Testjob',
            },
            sender: {
                name: 'Recruiter',
                type: 'companyUser',
            },
            recipient: {
                name: 'Laura',
                type: 'user',
            },
        },
    ],
    two: [
        {
            job: {
                title: 'Testjob',
            },
            sender: {
                name: 'Recruiter',
                type: 'companyUser',
            },
            recipient: {
                name: 'Laura',
                type: 'user',
            },
        },
        {
            job: {
                title: 'Testjob',
            },
            sender: {
                name: 'Laura',
                type: 'user',
            },
            recipient: {
                name: 'Recruiter',
                type: 'companyUser',
            },
        },
    ],
    three: [
        {
            job: {
                title: 'Testjob',
            },
            sender: {
                name: 'Recruiter',
                type: 'companyUser',
            },
            recipient: {
                name: 'Laura',
                type: 'user',
            },
        },
        {
            job: {
                title: 'Testjob',
            },
            sender: {
                name: 'Laura',
                type: 'user',
            },
            recipient: {
                name: 'Recruiter',
                type: 'companyUser',
            },
        },
        {
            job: {
                title: 'Testjob',
            },
            sender: {
                name: 'Recruiter',
                type: 'companyUser',
            },
            recipient: {
                name: 'Laura',
                type: 'user',
            },
        },
    ],
};

export const conversationMocks = {
    hasNotReplied: {
        company: {
            name: 'Foo',
        },
        replied: false,
        messages: messagesMocks.one,
    },
    hasReplied: {
        company: {
            name: 'Foo',
            isActive: true,
        },
        rejected: false,
        replied: true,
        recruiter: {
            name: 'Foo Bar',
        },
        recruiterFallback: {
            name: null,
        },
        messages: messagesMocks.two,
    },
    hasRejected: {
        company: {
            name: 'Foo',
            isActive: true,
        },
        recruiter: {
            name: 'Foo Bar',
        },
        replied: true,
        rejected: true,
        messages: messagesMocks.two,
    },
    hasRejectedNotReplied: {
        company: {
            name: 'Foo',
            isActive: true,
        },
        recruiter: {
            name: 'Foo Bar',
        },
        replied: false,
        rejected: true,
        messages: messagesMocks.three,
    },
    hasNotApproved: {
        company: {
            name: 'Foo',
            isActive: true,
        },
        recruiter: {
            name: 'Foo Bar',
        },
        recruiterFallback: {
            name: null,
        },
        approved: false,
        messages: messagesMocks.one,
    },
    hasApproved: {
        company: {
            name: 'Foo',
        },
        approved: true,
        messages: messagesMocks.two,
    },
    hasInactive: {
        company: {
            name: 'Foo',
            isActive: false,
        },
        messages: messagesMocks.two,
    },
    hasRecruiterFallback: {
        company: {
            name: 'Foo',
            isActive: true,
        },
        recruiter: {
            name: 'Foo Bar',
        },
        recruiterFallback: {
            name: 'Foo',
        },
        messages: messagesMocks.one,
    },
    hasRecruiterFallbackMultipleMessages: {
        company: {
            name: 'Foo',
            isActive: true,
        },
        recruiter: {
            name: 'Foo Bar',
        },
        recruiterFallback: {
            name: 'Foo',
        },
        messages: messagesMocks.two,
    },
};
