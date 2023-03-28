import {
    shallowMount,
} from '../../../../tests/app/vue/utils';

import CardLatestJobAlarm from './CardLatestJobAlarm';

jest.mock('../../../composables/resource-endpoint');
const { useResourceEndpointGet } = require('../../../composables/resource-endpoint');

function wrapperFactory() {
    return shallowMount(CardLatestJobAlarm);
}

describe('CardLatestJobAlarm', () => {
    test('It should render a `<div>`.', () => {
        useResourceEndpointGet.mockImplementation(() => ({
            data: [],
            get: () => {},
        }));
        const wrapper = wrapperFactory();

        expect(wrapper.element.tagName).toBe('DIV');
    });

    test('It should render the provided data.', () => {
        const data = [
            {
                id: 1,
                attributes: {
                    title: 'Foo',
                    subtitle: 'Vollzeit • Einkauf, Logistik • Berufserfahrung',
                },
                meta: {
                    'new-jobs-count': 18,
                },
            },
            {
                id: 2,
                attributes: {
                    title: 'Bar',
                    subtitle: 'Vollzeit • Einkauf, Logistik • Berufserfahrung',
                },
                meta: {
                    'new-jobs-count': 18,
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
            get: () => {},
        }));
        const wrapper = wrapperFactory();

        expect(wrapper.findAll('[data-qa="job alarm"]').length).toBe(2);
    });

    test('It should render an empty state illustration if done loading and result is empty.', () => {
        useResourceEndpointGet.mockImplementation(() => ({
            data: [],
            isLoading: false,
            get: () => {},
        }));
        const wrapper = wrapperFactory();

        expect(wrapper.contains('[data-qa="empty state"]')).toBe(true);
    });
});
