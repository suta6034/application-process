import {
    autocomplete,
} from './autocomplete';
import {
    // eslint-disable-next-line import/named
    __axiosInstance,
} from '../utils/api';

jest.mock('../utils/api');

describe('autocomplete()', () => {
    test('It should be a function.', () => {
        expect(typeof autocomplete).toBe('function');
    });

    test('It should call `axios.get`.', () => {
        autocomplete({});

        expect(__axiosInstance.get).toBeCalled();
    });

    test('It should pass the expected options to the `axios.get` call.', () => {
        const expectedOptions = {
            params: {
                'filter[foo]': 'foo',
                'filter[limit]': 15,
                'filter[prefix]': 'bar',
            },
        };

        autocomplete({
            filters: {
                foo: 'foo',
                limit: 15,
                prefix: 'bar',
            },
            type: 'baz',
        });

        expect(__axiosInstance.get).toBeCalledWith('baz', expectedOptions);
    });
});
