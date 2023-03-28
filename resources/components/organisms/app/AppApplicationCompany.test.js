import {
    mount,
} from '../../../../tests/app/vue/utils';

import AppApplicationCompany from './AppApplicationCompany';

let wrapper;

describe('AppApplicationCompany', () => {
    test('It should show the company if the application has a company.', () => {
        wrapper = mount(AppApplicationCompany, {
            propsData: {
                application: {
                    isManual: false,
                    jobUrl: 'https://foo.bar',
                    company: {
                        type: 'company',
                        id: 'company-1',
                        isActive: true,
                        isChiffre: false,
                        logo: null,
                        slug: '/foo-company',
                    },
                },
                hasNoCompany: false,
            },
        });
        expect(wrapper.contains('[data-qa="has company"]')).toBe(true);
    });

    test('It should show the correct empty state text for chiffre companies.', () => {
        wrapper = mount(AppApplicationCompany, {
            propsData: {
                application: {
                    isManual: false,
                    jobUrl: 'https://foo.bar',
                    company: {
                        type: 'company',
                        id: 'company-1',
                        isActive: true,
                        isChiffre: true,
                        logo: null,
                        slug: '/foo-company',
                    },
                },
                hasNoCompany: true,
            },
        });
        expect(wrapper.find('[data-qa="empty state text"]').text())
            .toMatch('Der Arbeitgeber möchte vorerst keine Informationen bekanntgeben.');
    });

    test('It should show the correct empty state text for deleted companies.', () => {
        wrapper = mount(AppApplicationCompany, {
            propsData: {
                application: {
                    isManual: false,
                    jobUrl: 'https://foo.bar',
                    company: {
                        type: 'company',
                        id: 'company-1',
                        isActive: false,
                        isChiffre: false,
                        logo: null,
                        slug: '/foo-company',
                    },
                },
                hasNoCompany: true,
            },
        });
        expect(wrapper.find('[data-qa="empty state text"]').text())
            .toMatch('Dieser Arbeitgeber hat kein Profil mehr auf karriere.at.');
    });

    test('It should show the correct empty state text for manual applications without company and job URL.', () => {
        wrapper = mount(AppApplicationCompany, {
            propsData: {
                application: {
                    isManual: true,
                    jobUrl: null,
                    company: {
                        type: 'company',
                        id: null,
                        isActive: false,
                        isChiffre: false,
                        logo: null,
                        slug: null,
                    },
                },
                hasNoCompany: true,
            },
        });
        expect(wrapper.find('[data-qa="empty state text"]').text())
            .toMatch('Wenn du dich nicht über karriere.at beworben hast');
    });

    test('It should show the correct empty state text for manual applications without company but job URL.', () => {
        wrapper = mount(AppApplicationCompany, {
            propsData: {
                application: {
                    isManual: true,
                    jobUrl: 'https://foo.bar',
                    company: {
                        type: 'company',
                        id: null,
                        isActive: false,
                        isChiffre: false,
                        logo: null,
                        slug: null,
                    },
                },
                hasNoCompany: true,
            },
        });

        expect(wrapper.find('[data-qa="empty state text"]').text())
            .toMatch('Die findest du über den von dir hinterlegten Link:');
    });
});
