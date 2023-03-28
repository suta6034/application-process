import {
    get,
} from './content';

import {
    // eslint-disable-next-line import/named
    __axiosInstance,
} from '../utils/api';

jest.mock('../utils/api');

describe('content', () => {
    describe('get()', () => {
        test('It should be a function.', () => {
            expect(typeof get).toBe('function');
        });

        test('It should call the get method on the axios instance.', () => {
            get({ type: 'articles', pageSize: 4 });

            expect(__axiosInstance.get).toBeCalled();
        });
    });
});
