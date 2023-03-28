import {
    shallowMount,
} from '../../../../tests/app/vue/utils';
import * as jobWatchlistService from '../../../services/job-watchlist';

import CardLatestJobWatchlist from './CardLatestJobWatchlist';

jest.mock('../../../services/job-watchlist');
jest.mock('../../../composables/resource-endpoint');
const { useResourceEndpointGet } = require('../../../composables/resource-endpoint');

function wrapperFactory({ stubs } = {}) {
    return shallowMount(CardLatestJobWatchlist, {
        stubs,
    });
}

describe('CardLatestJobWatchlist', () => {
    test('It should render a `<div>`.', () => {
        useResourceEndpointGet.mockImplementation(() => ({
            get: () => {},
            data: [],
        }));
        const wrapper = wrapperFactory();

        expect(wrapper.element.tagName).toBe('DIV');
    });

    test('It should render the provided data.', () => {
        const data = [
            {
                id: 1,
                attributes: {
                    'create-date': '2017-06-14T11:11:44+02:00',
                    title: 'Foo',
                    locations: ['Foo', 'Bar'],
                    'company-name': 'Bar',
                    'company-logo': '/some/logo.png',
                },
            },
            {
                id: 2,
                attributes: {
                    'create-date': '2017-06-13T12:11:44+02:00',
                    title: 'Baz',
                    locations: ['Foo', 'Bar'],
                    'company-name': 'Bar',
                    'company-logo': '/some/logo.png',
                },
            },
        ];
        useResourceEndpointGet.mockImplementation(() => ({
            data: {
                value: {
                    data,
                    meta: { count: 2 },
                },
            },
            isLoading: false,
            get: () => {},
        }));
        const wrapper = wrapperFactory();

        expect(wrapper.findAll('[data-qa="job"]').length).toBe(2);
    });

    test('It should render an empty state illustration if done loading and result is empty.', () => {
        useResourceEndpointGet.mockImplementation(() => ({
            data: {
                value: {
                    data: [],
                    meta: { count: 2 },
                },
            },
            isLoading: false,
            get: () => {},
        }));

        const wrapper = wrapperFactory({
            stubs: {
                AppCupcake: '<div><slot name="cherry"/><slot/><slot name="action"/></div>',
            },
        });

        expect(wrapper.contains('[data-qa="empty state"]')).toBe(true);
    });

    test('It should trigger a delete request if a jobs unwatch button is clicked.', () => {
        const jobId = 1;
        const data = [
            {
                id: jobId,
                attributes: {
                    'create-date': '2017-06-14T11:11:44+0200',
                    title: 'Foo',
                    locations: ['Foo', 'Bar'],
                    'company-name': 'Bar',
                    'company-logo': '/some/logo.png',
                },
            },
        ];
        useResourceEndpointGet.mockImplementation(() => ({
            data: {
                value: {
                    data,
                    meta: { count: 1 },
                },
            },
            isLoading: false,
            get: () => {},
        }));
        const wrapper = wrapperFactory();
        wrapper.find('[data-qa="unwatch"]').trigger('click');

        expect(jobWatchlistService.unwatch).toBeCalledWith(jobId);
    });

    test('It should trigger a create request if a jobs unwatch button is clicked twice.', () => {
        const jobId = 1;
        const data = [
            {
                id: jobId,
                attributes: {
                    'create-date': '2017-06-14T11:11:44+0200',
                    title: 'Foo',
                    locations: ['Foo', 'Bar'],
                    'company-name': 'Bar',
                    'company-logo': '/some/logo.png',
                },
            },
        ];
        useResourceEndpointGet.mockImplementation(() => ({
            data: {
                value: {
                    data,
                    meta: { count: 1 },
                },
            },
            isLoading: false,
            get: () => {},
        }));
        const wrapper = wrapperFactory();
        wrapper.find('[data-qa="unwatch"]').trigger('click');
        wrapper.find('[data-qa="watch"]').trigger('click');

        expect(jobWatchlistService.watch).toBeCalledWith(jobId);
    });
});
