import {
    getList,
    patch,
    post,
    remove,
} from './application';
import {
    // eslint-disable-next-line import/named
    __axiosInstance,
} from '../utils/api';

jest.mock('../utils/api');

describe('application', () => {
    describe('getList()', () => {
        test('It should call the get method on the axios instance with the given params.', () => {
            __axiosInstance.get.mockReturnValueOnce({ data: { data: [] } });
            const expectedOptions = {
                params: {
                    pageNumber: 1,
                    sort: 'createDate',
                    status: 'APPLIED',
                },
            };

            getList({ filterString: 'applied', page: 1, sortDirection: 'createDate' });

            expect(__axiosInstance.get).toBeCalledWith('', expectedOptions);
        });

        test('It should handle relationships without `data`.', async () => {
            const resources = [
                {
                    type: 'application',
                    id: 'application-1',
                    createDate: '1558593784',
                    firstname: 'Foo',
                    surname: 'Bar',
                    job: null,
                },
            ];
            const included = [];
            __axiosInstance.get.mockReturnValue({ data: { data: resources, included } });
            const result = await getList();

            expect(result.data).toEqual([
                {
                    type: 'application',
                    id: 'application-1',
                    createDate: '1558593784',
                    firstname: 'Foo',
                    surname: 'Bar',
                    job: null,
                },
            ]);
        });
    });

    describe('patch()', () => {
        test('It should call the patch method with the resource as payload.', () => {
            __axiosInstance.patch.mockReturnValueOnce({ data: { data: {} } });
            const data = {
                status: 'APPLIED',
            };
            patch({ data, id: '123' });

            expect(__axiosInstance.patch).toBeCalledWith('/123', data);
        });
    });

    describe('post()', () => {
        test('It should call the post method on the axios instance with the resource as payload.', () => {
            __axiosInstance.post.mockReturnValueOnce({ data: { data: {} } });
            const data = {
                company: {
                    type: 'company',
                    id: 1,
                    isActive: false,
                    isChiffre: false,
                    logo: null,
                    slug: 'foo',
                    title: 'Foo',
                },
                status: 'APPLIED',
            };
            post({ data });

            expect(__axiosInstance.post).toBeCalledWith('', data);
        });
    });

    describe('remove()', () => {
        test('It should call the delete method on the axios instance.', () => {
            __axiosInstance.delete.mockReturnValueOnce({ data: { data: {} } });
            remove({ id: '123' });

            expect(__axiosInstance.delete).toBeCalledWith('/123');
        });
    });
});
