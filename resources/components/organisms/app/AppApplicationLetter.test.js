import {
    shallowMount,
} from '../../../../tests/app/vue/utils';

import AppApplicationLetter from './AppApplicationLetter';

let wrapper;

beforeEach(() => {
    wrapper = shallowMount(AppApplicationLetter, {
        propsData: {
            application: {
                firstname: 'Laura',
                surname: 'Heidelbeere',
                companyName: 'karriere.at',
                message: 'Laura bewirbt sich, mal wieder.',
                createDate: '2019-09-10T12:08:49+02:00',
                attachments: [{
                    url: 'test.at',
                    name: 'test',
                }],
                company: {
                    isChiffre: false,
                },
            },
        },
    });
});

describe('AppApplicationLetter', () => {
    test('It should render a `<div>`.', () => {
        expect(wrapper.is('div')).toBe(true);
    });

    test('It should render a list of attachments if the application has attachments.', () => {
        expect(wrapper.find('[data-qa="file list"]').isVisible()).toBe(true);
    });

    test('It should not render no attachment list if there are no attachments.', () => {
        wrapper = shallowMount(AppApplicationLetter, {
            propsData: {
                application: {
                    firstname: 'Laura',
                    surname: 'Heidelbeere',
                    companyName: 'karriere.at',
                    message: 'Laura bewirbt sich, mal wieder.',
                    createDate: '2019-09-10T12:08:49+02:00',
                    attachments: [],
                    company: {
                        isChiffre: false,
                    },
                },
            },
        });
        expect(wrapper.contains('[data-qa="file list"]')).toBe(false);
    });

    test('It should not render the rejected letter for chiffre application.', () => {
        wrapper = shallowMount(AppApplicationLetter, {
            propsData: {
                application: {
                    firstname: 'Laura',
                    surname: 'Heidelbeere',
                    companyName: 'karriere.at',
                    message: 'Laura bewirbt sich, mal wieder.',
                    createDate: '2019-09-10T12:08:49+02:00',
                    attachments: [],
                    company: {
                        isChiffre: true,
                    },
                    isRejected: true,
                },
            },
        });
        expect(wrapper.contains('[data-qa="rejected message"]')).toBe(true);
    });
});
