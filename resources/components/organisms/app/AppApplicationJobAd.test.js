import {
    mount,
    shallowMount,
} from '../../../../tests/app/vue/utils';

import AppApplicationJobAd from './AppApplicationJobAd';

let wrapper;

describe('AppApplicationJobAd', () => {
    test('It should show the job ad if the application has an active job ad.', () => {
        wrapper = shallowMount(AppApplicationJobAd, {
            propsData: {
                createDate: '123123123',
                jobLocation: null,
                companyName: null,
                application: {
                    job: {
                        type: 'job',
                        id: 'job-1-2-3',
                        employmentType: null,
                        level: 'Foo Job Level',
                        isActive: true,
                    },
                    isManual: false,
                },
            },
        });
        const activeAd = wrapper.find('[data-qa="job ad active"]');
        expect(activeAd.exists()).toBe(true);
    });

    test('It should show the correct job ad state text for not available job ad.', () => {
        wrapper = mount(AppApplicationJobAd, {
            propsData: {
                application: {
                    isManual: false,
                    job: {
                        isActive: false,
                    },
                    company: {
                        isChiffre: false,
                    },
                },
            },
        });
        expect(wrapper.find('[data-qa="job ad empty state"]').text())
            .toMatch('Stelleninserat nicht verfügbar');
    });

    test('It should show the correct job ad state text for manual applications without job URL.', () => {
        wrapper = mount(AppApplicationJobAd, {
            propsData: {
                application: {
                    isManual: true,
                    jobUrl: null,
                    job: {
                        isActive: false,
                    },
                },
            },
        });
        expect(wrapper.find('[data-qa="job ad empty state"]').text())
            .toMatch('Du kannst aber den dazugehörigen Link zum Arbeitgeber hier manuell hinterlegen.');
    });

    test('It should show the correct job ad state text for manual applications with job URL.', () => {
        wrapper = mount(AppApplicationJobAd, {
            propsData: {
                application: {
                    isManual: true,
                    jobUrl: 'https://foo.bar',
                    job: {
                        isActive: false,
                    },
                },
            },
        });

        expect(wrapper.find('[data-qa="job ad empty state"]').text())
            .toMatch('Mehr Infos zu dem Jobinserat findest du über den von dir hinterlegten Link.');
    });
});
