import flushPromises from 'flush-promises';
import {
    deleteAttachment,
    deleteImage,
    profileCreate,
    profileGet,
    uploadAttachment,
    uploadImage,
    updateProfileMeta,
} from './profile';
import {
    getAccessToken,
} from './auth';
import {
    // eslint-disable-next-line import/named
    __axiosInstance,
} from '../utils/api';

jest.mock('../utils/api');
jest.mock('./auth');

beforeEach(() => {
    __axiosInstance.defaults.headers.common.authorization = null;
});

describe('profile', () => {
    describe('profileGet()', () => {
        test('It should be a function.', () => {
            expect(typeof profileGet).toBe('function');
        });

        test('It should call the get method on the axios instance.', async () => {
            const authorizationValue = 'mocked-authorization-header-value';

            getAccessToken.mockReturnValue(authorizationValue);

            expect(__axiosInstance.defaults.headers.common.authorization).toBe(null);

            profileGet();

            await flushPromises();

            expect(__axiosInstance.get).toBeCalled();

            expect(__axiosInstance.defaults.headers.common.authorization).toBe(`Bearer ${authorizationValue}`);
        });
    });

    describe('profileCreate()', () => {
        test('It should be a function.', () => {
            expect(typeof profileCreate).toBe('function');
        });

        test('It should include authorization header when hash is not sent as parameter', async () => {
            const authorizationValue = 'mocked-authorization-header-value';

            getAccessToken.mockReturnValue(authorizationValue);

            expect(__axiosInstance.defaults.headers.common.authorization).toBe(null);

            profileCreate({ firstname: 'test' });

            await flushPromises();

            expect(__axiosInstance.post).toBeCalled();
            expect(__axiosInstance.defaults.headers.common.authorization).toBe(`Bearer ${authorizationValue}`);
        });

        test('It should remove authorization header when hash is sent as parameter', async () => {
            expect(__axiosInstance.defaults.headers.common.authorization).toBe(null);

            profileCreate({ firstname: 'test' }, { hash: 'some-user-has' });

            expect(__axiosInstance.post).toBeCalled();
            expect(__axiosInstance.defaults.headers.common.authorization).toBe(null);
        });
    });

    describe('deleteAttachment()', () => {
        test('It should be a function.', () => {
            expect(typeof deleteAttachment).toBe('function');
        });

        test('It should call the delete method on the axios instance.', async () => {
            deleteAttachment();

            await flushPromises();

            expect(__axiosInstance.delete).toBeCalled();
        });
    });

    describe('deleteImage()', () => {
        test('It should be a function.', () => {
            expect(typeof deleteImage).toBe('function');
        });

        test('It should call the delete method on the axios instance.', async () => {
            deleteImage();

            await flushPromises();

            expect(__axiosInstance.delete).toBeCalled();
        });
    });

    describe('uploadAttachment()', () => {
        test('It should be a function.', () => {
            expect(typeof uploadAttachment).toBe('function');
        });

        test('It should call the post method on the axios instance.', async () => {
            uploadAttachment();

            await flushPromises();

            expect(__axiosInstance.post).toBeCalled();
        });
    });

    describe('uploadImage()', () => {
        test('It should be a function.', () => {
            expect(typeof uploadImage).toBe('function');
        });

        test('It should call the post method on the axios instance.', async () => {
            uploadImage();

            await flushPromises();

            expect(__axiosInstance.post).toBeCalled();
        });
    });

    describe('updateProfileMeta()', () => {
        test('It should be a function.', () => {
            expect(typeof updateProfileMeta).toBe('function');
        });

        test('It should call the put method on the axios instance.', async () => {
            updateProfileMeta();

            await flushPromises();

            expect(__axiosInstance.put).toBeCalled();
        });
    });
});
