import * as softSkillsService from './soft-skills';
import {
    // eslint-disable-next-line import/named
    __axiosInstance,
} from '../utils/api';

jest.mock('../utils/api');

describe('softSkillsService getList', () => {
    test('It should be a function.', () => {
        expect(typeof softSkillsService.getList).toBe('function');
    });

    test('It should call `axios.get`.', () => {
        softSkillsService.getList();

        expect(__axiosInstance.get).toBeCalled();
    });
});
