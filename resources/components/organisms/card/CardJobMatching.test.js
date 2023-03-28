import {
    mount,
} from '../../../../tests/app/vue/utils';
import CardJobMatching from './CardJobMatching';

jest.mock('../../../composables/resource-endpoint');
const { useResourceEndpointGet } = require('../../../composables/resource-endpoint');

function wrapperFactory() {
    return mount(CardJobMatching);
}

describe('CardJobMatching', () => {
    test('It should render a `<div>`.', () => {
        useResourceEndpointGet.mockImplementation(() => ({
            get: () => {},
            data: [],
        }));
        const wrapper = wrapperFactory();
        expect(wrapper.element.tagName).toBe('DIV');
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

    test('It should render the provided data.', () => {
        const data = [
            {
                id: 1,
                attributes: {
                    showDate: '2017-06-14T11:11:44+02:00',
                    title: 'Foo',
                    locations: ['Foo', 'Bar'],
                    companyName: 'Bar',
                    companyLogo: '/some/logo.png',
                },
            },
            {
                id: 2,
                attributes: {
                    showDate: '2017-06-13T12:11:44+02:00',
                    title: 'Baz',
                    locations: ['Foo', 'Bar'],
                    companyName: 'Bar',
                    companyLogo: '/some/logo.png',
                },
            },
        ];
        useResourceEndpointGet.mockImplementation(() => ({
            data: {
                value: {
                    data,
                },
            },
            isLoading: false,
            get: () => {},
        }));
        const wrapper = wrapperFactory();

        // Expect length to be 8 because Hooper's inifiniteScroll property renders slides multiple times
        expect(wrapper.findAll('[data-qa="item"]').length).toBe(8);
    });

    test('It should render an empty state illustration if done loading and result is empty.', () => {
        useResourceEndpointGet.mockImplementation(() => ({
            get: () => {},
            isLoading: false,
            data: [],
        }));

        const wrapper = wrapperFactory();
        expect(wrapper.find('[data-qa="empty state illustration"]').exists()).toBe(true);
    });
});
