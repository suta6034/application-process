import axios from 'axios';

import {
    MOCK_TEST_API,
    BACKEND,
    apiEndpoint,
    apiResource,
    apiErrorShouldBeReported,
    interceptorAuthHeaders,
} from './api';
import * as authService from '../services/auth';

jest.mock('axios');
jest.mock('../services/auth');

// Don't access environment variables so that unit tests don't require valid `.env` files.
jest.mock('../config', () => ({
    api: { mockTestApi: { url: 'http://localhost:123/dev' }, backend: { url: 'http://localhost:345/backend' } },
    xOriginHeader: 'karl',
}));

describe('apiEndpoint()', () => {
    let useMock;

    beforeEach(() => {
        useMock = jest.fn();
        axios.create.mockReturnValue({
            interceptors: {
                request: {
                    use: useMock,
                },
                response: {
                    use: useMock,
                },
            },
        });
    });

    test('It should be a function.', () => {
        expect(typeof apiEndpoint).toBe('function');
    });

    test('It should call axios.create() with default parameters.', () => {
        apiEndpoint({
            api: MOCK_TEST_API,
            endpoint: 'foo',
        });

        expect(axios.create).toBeCalledWith({
            baseURL: 'http://localhost:123/dev/foo',
            timeout: 60000,
            headers: { 'X-Origin': 'karl', 'X-CSRF-TOKEN': false },
        });
    });

    test('It should call axios.create() with extended header parameters.', () => {
        apiEndpoint({
            api: BACKEND,
            endpoint: 'foo',
        });

        expect(axios.create).toBeCalledWith({
            baseURL: 'http://localhost:345/backend/foo',
            timeout: 60000,
            headers: { 'X-Origin': 'karl', 'X-Requested-With': 'XMLHttpRequest', 'X-CSRF-TOKEN': false },
        });
    });

    test('It should use the auth interceptor.', () => {
        apiEndpoint({
            api: MOCK_TEST_API,
            endpoint: 'profile',
        });

        expect(useMock).toBeCalledWith(expect.any(Function));
    });

    test('It should call axios.create() without authorization header if not needed.', () => {
        apiEndpoint({
            api: MOCK_TEST_API,
            endpoint: 'no-auth-needed',
        });

        expect(axios.create).toBeCalledWith({
            baseURL: 'http://localhost:123/dev/no-auth-needed',
            timeout: 60000,
            headers: { 'X-Origin': 'karl', 'X-CSRF-TOKEN': false },
        });
    });

    test('It should override the timeout if a timeout option is passed as param.', () => {
        apiEndpoint({
            api: MOCK_TEST_API,
            endpoint: 'foo',
            options: { timeout: 20000 },
        });

        expect(axios.create).toBeCalledWith({
            baseURL: 'http://localhost:123/dev/foo',
            timeout: 20000,
            headers: { 'X-Origin': 'karl', 'X-CSRF-TOKEN': false },
        });
    });
});

describe('apiResource()', () => {
    test('It should create a valid JSON:API payload.', () => {
        expect(apiResource('foo', { bar: 'baz' })).toEqual({
            data: {
                type: 'foo',
                attributes: {
                    bar: 'baz',
                },
            },
        });
        expect(apiResource('foo', { bar: 'baz' }, 'uuid')).toEqual({
            data: {
                type: 'foo',
                id: 'uuid',
                attributes: {
                    bar: 'baz',
                },
            },
        });
    });
});

describe('apiErrorShouldBeReported()', () => {
    test('It should return true if the error code is not 404.', () => {
        const error = new Error();
        error.response = { status: 500 };

        expect(apiErrorShouldBeReported(error)).toBe(true);
    });

    test('It should return false if the error code is 404.', () => {
        const error = new Error();
        error.response = { status: 404 };

        expect(apiErrorShouldBeReported(error)).toBe(false);
    });

    test('It should return true if no reponse is defined.', () => {
        const error = new Error();

        expect(apiErrorShouldBeReported(error)).toBe(true);
    });
});

describe('interceptorAuthHeaders()', () => {
    test('It should reject if no JWT is given and the endpoint requires authentication.', () => {
        const error = new Error('Missing Authentication Token');
        authService.getAccessToken.mockRejectedValue(error);
        const config = {};

        return expect(interceptorAuthHeaders(config, 'application')).rejects.toBe(error);
    });

    test('It should set authentication headers if JWT is given and endpoint requires authentication.', async () => {
        authService.getAccessToken.mockReturnValue('ACCESSTOKEN');
        const config = {};
        await interceptorAuthHeaders(config, 'application');

        return expect(config.headers).toEqual({
            authorization: 'Bearer ACCESSTOKEN',
        });
    });
});
