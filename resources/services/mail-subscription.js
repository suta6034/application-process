import {
    BACKEND,
    apiEndpoint,
} from '../utils/api';
import {
    getUuid,
} from './auth';

export const MAIL_NEVER = 0;
export const MAIL_DAILY = 1;
export const MAIL_WEEKLY = 2;

const backendEndpoint = apiEndpoint({
    api: BACKEND,
    endpoint: 'mail/company-alarm/subscription',
});

export const TYPE = 'mail-subscribed';

export async function getCompanyAlarmSubscriptionInterval() {
    return backendEndpoint.post('', { userUuid: await getUuid() });
}
