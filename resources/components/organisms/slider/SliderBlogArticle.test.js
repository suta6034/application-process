import {
    shallowMount,
} from '../../../../tests/app/vue/utils';

import SliderBlogArticle from './SliderBlogArticle';

jest.mock('../../../composables/resource-endpoint');
const { useResourceEndpointGet } = require('../../../composables/resource-endpoint');

function wrapperFactory() {
    return shallowMount(SliderBlogArticle);
}

describe('SliderBlogArticle', () => {
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
                    date: '2017-06-14T11:11:44+0200',
                    title: 'Foo',
                    snippet: 'Bar',
                    images: {
                        default: 'foo/bar/img.png',
                    },
                },
                links: {
                    self: 'foo/bar/1',
                },
            },
            {
                id: 2,
                attributes: {
                    date: '2017-06-13T12:11:44+0200',
                    title: 'Baz',
                    snippet: 'Bar',
                    images: {
                        default: 'foo/bar/img.png',
                    },
                },
                links: {
                    self: 'foo/bar/2',
                },
            },
        ];
        useResourceEndpointGet.mockImplementation(() => ({
            data: {
                value: {
                    data,
                },
            },
            get: () => {},
        }));
        const wrapper = wrapperFactory();

        expect(wrapper.findAll('[data-qa="article"]').length).toBe(2);
    });
});
