import {
    latest,
    unwatch,
    watch,
} from './company-follow';

import {
    // eslint-disable-next-line import/named
    __axiosInstance,
} from '../utils/api';

jest.mock('../utils/api');

describe('company-follow', () => {
    describe('unwatch()', () => {
        test('It should call the delete method on the axios instance.', () => {
            const id = 123;
            unwatch(id);

            expect(__axiosInstance.delete).toBeCalledWith(`${id}`);
        });
    });

    describe('watch()', () => {
        test('It should call the post method on the axios instance.', () => {
            const id = 123;
            watch(id);

            expect(__axiosInstance.post).toBeCalledWith(`${id}`);
        });
    });

    describe('latest()', () => {
        test('It should call the get method on the axios instance.', () => {
            latest();

            expect(__axiosInstance.get).toBeCalledWith('latest', {
                params: { pageSize: 3 },
            });
        });
    });
});
