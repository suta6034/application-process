import flushPromises from 'flush-promises';
import {
    mount,
    mockRouter,
} from '../../../../tests/app/vue/utils';
import * as applicationService from '../../../services/application';
import {
    applicationServiceResponses,
} from '../../__mocks__/applicationServiceResponses';

import CardLatestApplications from './CardLatestApplications';

jest.mock('../../../router', () => ({
    afterEach: () => () => {},
}));

const wrapperFactory = propsData => mount(CardLatestApplications, {
    propsData: {
        hasProfile: true,
        ...propsData,
    },
});

describe('CardLatestApplications', () => {
    test('It should render a `<div>`', () => {
        const wrapper = wrapperFactory();
        expect(wrapper.element.tagName).toBe('DIV');
    });

    test('It should render a list of the latest 3 applications', async () => {
        // eslint-disable-next-line no-import-assign
        applicationService.getList = jest.fn().mockReturnValue(applicationServiceResponses.pageSize3);
        const wrapper = wrapperFactory();
        await flushPromises();

        expect(wrapper.findAll('[data-qa="application item"]').length).toBe(3);
    });

    test('It should render an empty state illustration when the user has no applications', async () => {
        // eslint-disable-next-line no-import-assign
        applicationService.getList = jest.fn().mockReturnValue(applicationServiceResponses.empty);
        const wrapper = wrapperFactory();
        await flushPromises();

        expect(wrapper.find('[data-qa="empty state illustration"]').exists()).toBe(true);
    });

    test('It should show a total of 0 applications when the user has no applications', async () => {
        // eslint-disable-next-line no-import-assign
        applicationService.getList = jest.fn().mockReturnValue(applicationServiceResponses.empty);
        const wrapper = wrapperFactory();
        await flushPromises();

        expect(wrapper.find('[data-qa="counter"]').text()).toBe('0');
    });

    test('It should render a link to the application page when the user has no applications', async () => {
        // eslint-disable-next-line no-import-assign
        applicationService.getList = jest.fn().mockReturnValue(applicationServiceResponses.empty);
        const wrapper = wrapperFactory();
        await flushPromises();

        expect(wrapper.find('[data-qa="application link"]').exists()).toBe(true);
    });

    test(`It should render a link to the application tipps landing page when
    the user has no applications and no profile`, async () => {
        // eslint-disable-next-line no-import-assign
        applicationService.getList = jest.fn().mockReturnValue(applicationServiceResponses.empty);
        const wrapper = wrapperFactory({
            hasProfile: false,
        });
        await flushPromises();

        expect(wrapper.find('[data-qa="tip link"]').exists()).toBe(true);
    });

    test('It should show the show all link when applications exist', async () => {
        // eslint-disable-next-line no-import-assign
        applicationService.getList = jest.fn().mockReturnValue(applicationServiceResponses.pageSize3);
        const wrapper = wrapperFactory();
        await flushPromises();

        expect(wrapper.find('[data-qa="show all link"]').text()).toBe('Alle anzeigen');
    });

    test('It should show the error state when application service fails', async () => {
        // eslint-disable-next-line no-import-assign
        applicationService.getList = jest.fn().mockReturnValue(Promise.reject(new Error()));
        const wrapper = wrapperFactory();
        await flushPromises();

        expect(wrapper.find('[data-qa="error state"]').exists()).toBe(true);
    });

    test('It should redirect to the normal applications page', async () => {
        // eslint-disable-next-line no-import-assign
        applicationService.getList = jest.fn().mockReturnValue(applicationServiceResponses.pageSize3);
        const wrapper = wrapperFactory();
        await flushPromises();
        const application = wrapper.find('[data-qa="application item"]').find('.c-appApplicationItem__link');
        await application.trigger('click');

        expect(mockRouter.push).toBeCalledWith({
            name: 'page-applications',
            params: {
                id: 1,
            },
        });
    });
});
