// Feature not in use and is why we can skip them, see comment in services/motivation-letter.js

import {
    getList,
    patch,
} from './motivation-letter';
import {
    // eslint-disable-next-line import/named
    __axiosInstance,
} from '../utils/api';

jest.mock('../utils/api');

describe('motivation letter', () => {
    describe('getList()', () => {
        test.skip('It should be a function.', () => {
            expect(typeof getList).toBe('function');
        });

        test.skip('It should return a list of denormalized motivation letter resources.', async () => {
            const normalizedResources = [
                {
                    type: 'motivationLetter',
                    id: '123',
                    attributes: {
                        title: 'Mein Bewerbungsschreiben',
                        text: 'motivation',
                        isDefault: true,
                    },
                },
            ];
            __axiosInstance.get.mockReturnValue({ data: { data: normalizedResources } });
            const result = await getList({ data: normalizedResources });

            expect(result.data).toEqual([
                {
                    type: 'motivationLetter',
                    id: '123',
                    isDefault: true,
                    text: 'motivation',
                    title: 'Mein Bewerbungsschreiben',
                },
            ]);
        });
    });

    describe('patch()', () => {
        test.skip('It should be a function.', () => {
            expect(typeof patch).toBe('function');
        });

        test.skip('It should call the patch method with the normalized resource as payload.', () => {
            __axiosInstance.patch.mockReturnValueOnce({ data: { data: {} } });
            const denormalizedData = {
                text: 'motivation',
            };
            patch({ id: '123', data: denormalizedData });

            expect(__axiosInstance.patch).toBeCalledWith('/123', {
                data: {
                    type: 'motivationLetter',
                    id: '123',
                    attributes: {
                        text: 'motivation',
                    },
                },
            });
        });
    });
});
