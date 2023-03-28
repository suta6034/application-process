import {
    mount,
} from '../../../../tests/app/vue/utils';

import CardLatestCompanyFollows from './CardLatestCompanyFollows';
import * as companyFollowService from '../../../services/company-follow';

jest.mock('../../../services/company-follow');
jest.mock('../../../composables/resource-endpoint');
const { useResourceEndpointGet } = require('../../../composables/resource-endpoint');

function wrapperFactory() {
    return mount(CardLatestCompanyFollows);
}

describe('CardLatestCompanyFollows', () => {
    test('It should render a `<div>`.', () => {
        useResourceEndpointGet.mockImplementation(() => ({
            get: () => {},
            data: [],
        }));
        const wrapper = wrapperFactory();

        expect(wrapper.is('div')).toBe(true);
    });

    describe('Error while fetching data', () => {
        test('It should display the error state.', async () => {
            useResourceEndpointGet.mockImplementation(() => ({
                error: true,
                get: () => {},
                data: [],
            }));
            const wrapper = wrapperFactory();
            expect(wrapper.contains('[data-qa="error state"]')).toBe(true);
        });
    });

    test('It should render an empty state if loading done and result is empty.', () => {
        useResourceEndpointGet.mockImplementation(() => ({
            get: () => {},
            isLoading: false,
            data: [],
        }));
        const wrapper = wrapperFactory();
        expect(wrapper.contains('[data-qa="empty state"]')).toBe(true);
    });

    test('It should trigger a delete request if a company unwatch button is clicked.', async () => {
        const companyId = 1;
        const data = [
            {
                type: 'companyCard',
                id: companyId,
                attributes: {
                    name: 'Foo',
                    logos: {
                        companysmall: '/some/logo.png',
                    },
                    image: '/some/logo.png',
                    typeId: 2,
                    url: '/f/foo',
                    locations: ['Foo', 'Bar'],
                    jobFields: ['Foo', 'Bar'],
                    jobCount: 2,
                },
            },
        ];
        useResourceEndpointGet.mockImplementation(() => ({
            get: () => {
            },
            isLoading: false,
            data,
        }));

        setTimeout(() => {
            const wrapper = wrapperFactory();
            wrapper.find('[data-qa="unwatch"]').trigger('click');

            expect(companyFollowService.unwatch).toBeCalledWith(companyId);
        }, 20);
    });

    test('It should trigger a create request if a company unwatch button is clicked twice.', () => {
        const companyId = 1;
        const data = [
            {
                type: 'companyCard',
                id: companyId,
                attributes: {
                    name: 'Foo',
                    logos: {
                        companysmall: '/some/logo.png',
                    },
                    image: '/some/logo.png',
                    typeId: 2,
                    url: '/f/foo',
                    locations: ['Foo', 'Bar'],
                    jobFields: ['Foo', 'Bar'],
                    jobCount: 2,
                },
            },
        ];
        useResourceEndpointGet.mockImplementation(() => ({
            get: () => {},
            isLoading: false,
            data,
        }));

        setTimeout(() => {
            const wrapper = wrapperFactory();
            wrapper.find('[data-qa="unwatch"]').trigger('click');
            wrapper.find('[data-qa="watch"]').trigger('click');

            expect(companyFollowService.watch).toBeCalledWith(companyId);
        }, 20);
    });
});
