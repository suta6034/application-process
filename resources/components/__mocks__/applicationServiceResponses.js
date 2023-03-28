export const applicationServiceResponses = {
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
    },
    pageOne: {
        data: [
            {
                id: 1,
                company: { name: 'Company 1' },
                job: { title: 'Job 1' },
                createDate: '2020-07-22T00:57:58+02:00',
                showDate: '2020-07-22T00:57:58+02:00',
                attachments: [],
                status: 'APPLIED',
            },
            {
                id: 2,
                company: { name: 'Company 2' },
                job: { title: 'Job 2' },
                createDate: '2020-07-22T00:57:58+02:00',
                showDate: '2020-07-22T00:57:58+02:00',
                attachments: [],
                status: 'APPLIED',
            },
            {
                id: 3,
                company: { name: 'Company 3' },
                job: { title: 'Job 3' },
                createDate: '2020-07-22T00:57:58+02:00',
                showDate: '2020-07-22T00:57:58+02:00',
                attachments: [],
                status: 'APPLIED',
            },
            {
                id: 4,
                company: { name: 'Company 4' },
                job: { title: 'Job 4' },
                createDate: '2020-07-22T00:57:58+02:00',
                showDate: '2020-07-22T00:57:58+02:00',
                attachments: [],
                status: 'APPLIED',
            },
        ],
        meta: {
            pagination: {
                number: 1,
                pages: 2,
                size: 4,
                total: 5,
            },
        },
    },
    filtered: {
        data: [
            {
                id: 1,
                company: { name: 'Company 1' },
                job: { title: 'Job 1' },
                createDate: '2020-07-22T00:57:58+02:00',
                showDate: '2020-07-22T00:57:58+02:00',
                attachments: [],
                status: 'REJECTED',
            },
            {
                id: 2,
                company: { name: 'Company 2' },
                job: { title: 'Job 2' },
                createDate: '2020-07-22T00:57:58+02:00',
                showDate: '2020-07-22T00:57:58+02:00',
                attachments: [],
                status: 'REJECTED',
            },
        ],
        meta: {
            pagination: {
                number: 1,
                pages: 1,
                size: 4,
                total: 2,
            },
        },
    },
    pageSize3: {
        data: [
            {
                id: 1,
                company: { name: 'Company 1' },
                job: { title: 'Job 1' },
                createDate: '2020-07-22T00:57:58+02:00',
                showDate: '2020-07-22T00:57:58+02:00',
                attachments: [],
                status: 'APPLIED',
            },
            {
                id: 2,
                company: { name: 'Company 2' },
                job: { title: 'Job 2' },
                createDate: '2020-07-22T00:57:58+02:00',
                showDate: '2020-07-22T00:57:58+02:00',
                attachments: [],
                status: 'APPLIED',
            },
            {
                id: 3,
                company: { name: 'Company 3' },
                job: { title: 'Job 3' },
                createDate: '2020-07-22T00:57:58+02:00',
                showDate: '2020-07-22T00:57:58+02:00',
                attachments: [],
                status: 'APPLIED',
            },
        ],
        meta: {
            pagination: {
                number: 1,
                pages: 1,
                size: 3,
                total: 5,
            },
        },
    },
};
