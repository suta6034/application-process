// eslint-disable-next-line no-underscore-dangle
export const __axiosInstance = {
    delete: jest.fn(),
    get: jest.fn().mockReturnValue(Promise.resolve({ data: { data: [] } })),
    patch: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    defaults: {
        headers: {
            common: {
                authorization: null,
            },
        },
    },
};

export const BACKEND = '';

export function apiEndpoint() {
    return __axiosInstance;
}

export const apiResource = jest.fn();
