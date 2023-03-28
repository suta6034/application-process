import {
    patch as patchStatus,
} from './application-status';
import {
    // eslint-disable-next-line import/named
    __axiosInstance,
} from '../utils/api';

jest.mock('../utils/api');

describe('application-patch()', () => {
    test('It should call the status patch method with the normalized status resource as payload.', async () => {
        const data = { status: 'APPLIED', statusDate: null };

        __axiosInstance.patch.mockReturnValueOnce({
            id: '123',
            status: data.status,
            statusDate: data.statusDate,
        });

        patchStatus({ data, id: '123' });

        expect(__axiosInstance.patch).toBeCalledWith('/123/status', {
            id: '123',
            status: data.status,
            statusDate: data.statusDate,
        });
    });
});
