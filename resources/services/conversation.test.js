import {
    get,
    getList,
    patch,
} from './conversation';
import {
    // eslint-disable-next-line import/named
    __axiosInstance,
} from '../utils/api';

jest.mock('../utils/api');

describe('conversations', () => {
    describe('get', () => {
        test('It should be a function.', () => {
            expect(typeof get).toBe('function');
        });

        test('It should call the get method on the axios instance with the given params.', () => {
            __axiosInstance.get.mockReturnValueOnce({ data: { data: {}, included: [] } });
            __axiosInstance.get.mockReturnValueOnce({ data: { data: [], included: [] } });

            get({ id: '123' });

            expect(__axiosInstance.get).toBeCalledWith('/123');
        });
    });

    describe('getList()', () => {
        test('It should be a function.', () => {
            expect(typeof getList).toBe('function');
        });

        test('It should call the get method on the axios instance with the given params.', () => {
            const expectedOptions = {
                params: {
                    deleted: null,
                    pageNumber: 1,
                    pageSize: undefined,
                },
            };

            getList({ page: 1 });

            expect(__axiosInstance.get).toBeCalledWith('', expectedOptions);
        });

        test('It should handle relationships without `data`.', async () => {
            const normalizedResources = [
                {
                    type: 'conversation',
                    id: 'conversation-1',
                    approved: false,
                    deleted: false,
                    read: false,
                    latestSendDate: null,
                    rejected: false,
                    replied: false,
                    subject: null,
                    company: {
                        id: null,
                        isActive: false,
                        isChiffre: false,
                        name: false,
                        slug: null,
                        type: 'company',
                    },
                    recruiter: {
                        id: null,
                        name: null,
                        type: 'user',
                    },
                    recruiterFallback: {
                        id: null,
                        name: null,
                        type: 'user',
                    },
                    messages: undefined,
                },
            ];
            const included = [];
            __axiosInstance.get.mockReturnValue({ data: { data: normalizedResources, included } });
            const result = await getList();

            expect(result.data).toEqual([
                {
                    type: 'conversation',
                    id: 'conversation-1',
                    read: false,
                    replied: false,
                    approved: false,
                    rejected: false,
                    deleted: false,
                    latestSendDate: null,
                    subject: null,
                    messages: undefined,
                    recruiter: {
                        type: 'user',
                        id: null,
                        name: null,
                    },
                    recruiterFallback: {
                        id: null,
                        name: null,
                        type: 'user',
                    },
                    company: {
                        type: 'company',
                        id: null,
                        isActive: false,
                        isChiffre: false,
                        name: false,
                        slug: null,
                    },
                },
            ]);
        });
    });

    describe('patch()', () => {
        test('It should be a function.', () => {
            expect(typeof patch).toBe('function');
        });

        test('It should call the deleted-patch method.', () => {
            __axiosInstance.patch.mockReturnValue({ data: { data: {} } });
            patch({ data: { deleted: true }, id: 'conversation-1' });

            expect(__axiosInstance.patch).toBeCalledWith('/conversation-1', {
                data: { deleted: true },
            });
        });

        test('It should call the read-patch method.', () => {
            __axiosInstance.patch.mockReturnValue({ data: { data: {} } });
            patch({ data: { read: true }, id: 'conversation-1' });

            expect(__axiosInstance.patch).toBeCalledWith('/conversation-1', {
                data: { read: true },
            });
        });
    });
});
