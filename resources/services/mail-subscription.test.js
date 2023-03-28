import * as mailSubscription from './mail-subscription';
import {
    // eslint-disable-next-line import/named
    __axiosInstance,
} from '../utils/api';

jest.mock('../utils/api');

describe('softSkillsService getList', () => {
    test('It should be a function.', () => {
        expect(typeof mailSubscription.getCompanyAlarmSubscriptionInterval).toBe('function');
    });

    test('It should call `axios.get`.', async () => {
        await mailSubscription.getCompanyAlarmSubscriptionInterval();

        expect(__axiosInstance.post).toBeCalled();
    });
});
