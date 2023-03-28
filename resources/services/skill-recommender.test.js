import * as skillRecommender from './skill-recommender';
import {
    // eslint-disable-next-line import/named
    __axiosInstance,
} from '../utils/api';

jest.mock('../utils/api');

describe('skillRecommender', () => {
    test('It should be a function.', () => {
        expect(typeof skillRecommender.get).toBe('function');
    });

    test('It should call the get method on the axios instance.', () => {
        skillRecommender.get({});

        expect(__axiosInstance.get).toBeCalled();
    });

    test('It should pass the expected options to the `axios.get` call.', () => {
        const expectedOptions = {
            jobFields: null,
            objectives: null,
            skills: 'foo,bar',
        };

        skillRecommender.get({ skills: 'foo,bar' });

        expect(__axiosInstance.get).toBeCalledWith('', expectedOptions);
    });

    test('It should pass the expected options with given optional parameters.', () => {
        const expectedOptions = {
            skills: 'foo,bar',
            objectives: 'foo,bar',
            jobFields: '1,2,3,4,5',
        };

        skillRecommender.get({ skills: 'foo,bar', objectives: 'foo,bar', jobFields: '1,2,3,4,5' });

        expect(__axiosInstance.get).toBeCalledWith('', expectedOptions);
    });
});
