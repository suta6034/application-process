import {
    shallowMount,
} from '../../../../tests/app/vue/utils';
import * as jobWatchlistService from '../../../services/job-watchlist';

import AppJobMatchingItem from './AppJobMatchingItem';

jest.mock('../../../services/job-matching');
jest.mock('../../../services/job-watchlist');

describe('AppJobMatchingItem', () => {
    const jobId = 1;
    function wrapperFactory({ propsData } = {}) {
        return shallowMount(AppJobMatchingItem, {
            propsData: {
                job: {
                    id: jobId,
                    attributes: {
                        showDate: '2017-06-14T11:11:44+02:00',
                        title: 'Foo',
                        locations: ['Foo', 'Bar'],
                        companyName: 'Bar',
                        companyLogo: '/some/logogogo.png',
                        isWatched: false,
                    },
                },
                ...propsData,
            },
        });
    }

    test('It should render a `<div>`.', () => {
        const wrapper = wrapperFactory();
        expect(wrapper.is('div')).toBe(true);
    });

    test('It should trigger a delete request if a jobs unwatch button is clicked.', () => {
        const wrapper = wrapperFactory();
        wrapper.find('[data-qa="unwatch"]').trigger('click');

        expect(jobWatchlistService.unwatch).toBeCalled();
    });

    test('It should trigger a create request if a jobs unwatch button is clicked twice.', () => {
        const wrapper = wrapperFactory();

        wrapper.find('[data-qa="unwatch"]').trigger('click');
        wrapper.find('[data-qa="watch"]').trigger('click');

        expect(jobWatchlistService.watch).toBeCalledWith(jobId);
    });
});
