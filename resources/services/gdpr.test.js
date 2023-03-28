import {
    approve,
    check,
    info,
} from './gdpr';
import {
    // eslint-disable-next-line import/named
    __axiosInstance,
} from '../utils/api';

jest.mock('../utils/api');

describe('approve()', () => {
    test('It should be a function.', () => {
        expect(typeof approve).toBe('function');
    });

    test('It should call the post method on the given api.', () => {
        approve('some_consent_type');

        expect(__axiosInstance.post).toBeCalled();
    });
});

describe('check()', () => {
    test('It should be a function.', () => {
        expect(typeof check).toBe('function');
    });

    test('It should call the get method on the given api.', () => {
        check('some_consent_type');

        expect(__axiosInstance.get).toBeCalledWith('check', {
            params: { infoType: 'some_consent_type' },
        });
    });
});

describe('info()', () => {
    test('It should be a function.', () => {
        expect(typeof info).toBe('function');
    });

    test('It should call the get method on the given api.', () => {
        info('some_consent_type');

        expect(__axiosInstance.get).toBeCalledWith('info', {
            params: { infoType: 'some_consent_type' },
        });
    });
});
