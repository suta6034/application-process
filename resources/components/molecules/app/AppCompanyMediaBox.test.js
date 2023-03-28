import {
    shallowMount,
} from '../../../../tests/app/vue/utils';

import AppCompanyMediaBox from './AppCompanyMediaBox';

describe('AppCompanyMediaBox', () => {
    test('It should render a `<div>`.', () => {
        const wrapper = shallowMount(AppCompanyMediaBox);

        expect(wrapper.is('div')).toBe(true);
    });

    test('It should render the given image.', () => {
        const wrapper = shallowMount(AppCompanyMediaBox, {
            propsData: {
                img: 'someimage.gif',
            },
        });

        expect(wrapper.contains('[data-qa="image"]')).toBe(true);
    });

    test('It should render a fallback image when there is no given image.', () => {
        const wrapper = shallowMount(AppCompanyMediaBox, {
            propsData: {
                img: '',
            },
        });

        expect(wrapper.contains('[data-qa="placeholder illustration"]')).toBe(true);
    });

    test('It should only render the given image when there is no given video.', () => {
        const wrapper = shallowMount(AppCompanyMediaBox, {
            propsData: {
                img: 'someimage.gif',
                video: '',
            },
        });

        expect(wrapper.contains('[data-qa="image"]')).toBe(true);
        expect(wrapper.contains('[data-qa="video"]')).toBe(false);
    });

    test('It should render the given logo.', () => {
        const wrapper = shallowMount(AppCompanyMediaBox, {
            propsData: {
                logo: {
                    companysmall: 'somelogo.gif',
                },
                isActive: true,
            },
        });

        expect(wrapper.contains('[data-qa="company logo"]')).toBe(true);
    });

    test('It should not render a logo if there is no given logo.', () => {
        const wrapper = shallowMount(AppCompanyMediaBox, {
            propsData: {
                logo: '',
            },
        });

        expect(wrapper.contains('[data-qa="company logo"]')).toBe(false);
    });

    test('It should not render the insightBadge and videoBadge when branding solution type is 0.', () => {
        const wrapper = shallowMount(AppCompanyMediaBox, {
            propsData: {
                brandingType: 0,
            },
        });

        expect(wrapper.contains('[data-qa="insight badge"]')).toBe(false);
        expect(wrapper.contains('[data-qa="video badge"]')).toBe(false);
    });

    test('It should only render the insightBadge and when branding solution type is 1.', () => {
        const wrapper = shallowMount(AppCompanyMediaBox, {
            propsData: {
                brandingType: 1,
                isActive: true,
            },
        });

        expect(wrapper.contains('[data-qa="insight badge"]')).toBe(true);
        expect(wrapper.contains('[data-qa="video badge"]')).toBe(false);
    });

    test('It should render the insightBadge and videoBadge when branding solution type is 2.', () => {
        const wrapper = shallowMount(AppCompanyMediaBox, {
            propsData: {
                brandingType: 2,
                isActive: true,
            },
        });

        expect(wrapper.contains('[data-qa="insight badge"]')).toBe(true);
        expect(wrapper.contains('[data-qa="video badge"]')).toBe(true);
    });

    describe('The video renders and plays.', () => {
        test('It should render the given video when the image is hovered.', async () => {
            const wrapper = shallowMount(AppCompanyMediaBox, {
                propsData: {
                    img: 'someimage.gif',
                    video: 'someimage.mp4',
                },
            });

            wrapper.find('[data-qa="company media box"]').trigger('mouseenter');

            await wrapper.vm.$nextTick();

            expect(wrapper.contains('[data-qa="video"]')).toBe(true);
            expect(wrapper.contains('[data-qa="image"]')).toBe(false);
        });

        test('It should render the given image when the video is not hovered.', () => {
            const wrapper = shallowMount(AppCompanyMediaBox, {
                propsData: {
                    img: 'someimage.gif',
                    video: 'someimage.mp4',
                },
            });

            wrapper.find('[data-qa="company media box"]').trigger('mouseenter');
            wrapper.find('[data-qa="company media box"]').trigger('mouseleave');
            expect(wrapper.contains('[data-qa="video"]')).toBe(false);
            expect(wrapper.contains('[data-qa="image"]')).toBe(true);
        });

        test('It should only render the inactive badge when the company is inactive.', () => {
            const wrapper = shallowMount(AppCompanyMediaBox, {
                propsData: {
                    isActive: false,
                    brandingType: 2,
                },
            });

            expect(wrapper.contains('[data-qa="inactive badge"]')).toBe(true);
            expect(wrapper.contains('[data-qa="insight badge"]')).toBe(false);
            expect(wrapper.contains('[data-qa="video badge"]')).toBe(false);
        });
    });
});
