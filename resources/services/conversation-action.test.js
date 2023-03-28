import {
    send,
} from './conversation-action';
import {
    // eslint-disable-next-line import/named
    __axiosInstance,
} from '../utils/api';

jest.mock('../utils/api');

describe('conversation-action', () => {
    describe('send()', () => {
        test('It should be a function.', () => {
            expect(typeof send).toBe('function');
        });

        test('It should call the post method on the axios instance with the conversation id and type reply', () => {
            __axiosInstance.post.mockReturnValueOnce({ data: { data: {}, type: 'reply' } });

            send({
                conversationId: 'foo id',
                data: {
                    approved: false,
                    fallback: false,
                    body: 'foo',
                    recipient: 'bar',
                },
                type: 'reply',
            });

            expect(__axiosInstance.post).toBeCalledWith('/foo id/respond/reply', {
                approved: false,
                body: 'foo',
                fallback: false,
                recipient: 'bar',
            });
        });

        test('It should call the post method on the axios instance with the conversation id and type reject', () => {
            __axiosInstance.post.mockReturnValueOnce({ data: { data: {} } });

            send({
                conversationId: 'foo id',
                data: {
                    fallback: false,
                    reason: 'foo',
                    recipient: 'bar',
                },
                type: 'reject',
            });

            expect(__axiosInstance.post).toBeCalledWith('/foo id/respond/reject', {
                fallback: false,
                reason: 'foo',
                recipient: 'bar',
            });
        });

        test('It should handle the error case when there is no recipient in data.', async () => {
            const expectedData = {
                approved: false,
                fallback: false,
                body: 'foo',
                recipient: null,
            };

            __axiosInstance.post.mockReturnValue({
                data: {
                    response: {
                        errors: [
                            {
                                meta:
                                    { title: 'cannot find recipient.' },
                            },
                        ],
                    },
                },
            });
            const result = await send({ conversationId: 'foo id', data: expectedData });

            expect(result.response).toEqual({
                errors: [
                    {
                        meta: { title: 'cannot find recipient.' },
                    },
                ],
            });
        });
    });
});
