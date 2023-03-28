import flushPromises from 'flush-promises';

import {
    getTrackingStats,
} from './tracking';

import {
    // eslint-disable-next-line import/named
    __axiosInstance,
} from '../utils/api';

jest.mock('../utils/api');

describe('content', () => {
    describe('getTrackingStats()', () => {
        test('It should be a function.', () => {
            expect(typeof getTrackingStats).toBe('function');
        });

        test('It should call the get method on the axios instance.', async () => {
            __axiosInstance.get.mockReturnValueOnce({
                data: {
                    meta: {
                        userId: '123',
                        userFeatureLebenslauf: 1,
                        userFeatureBewerbungen: 0,
                        userFeatureJobalarm: 1,
                        userFeatureMerkliste: 1,
                        userFeatureFirmenalarm: 1,
                    },
                },
            });

            let responseData = {};

            getTrackingStats()
                .then((response) => {
                    responseData = response;
                })
                .catch(() => {
                    responseData = {};
                });

            expect(__axiosInstance.get).toBeCalled();

            await flushPromises();

            expect(responseData).toStrictEqual({
                userId: '123',
                userFeatureLebenslauf: '1',
                userFeatureBewerbungen: '0',
                userFeatureJobalarm: '1',
                userFeatureMerkliste: '1',
                userFeatureFirmenalarm: '1',
            });
        });
    });
});
