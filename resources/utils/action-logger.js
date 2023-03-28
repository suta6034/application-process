/* istanbul ignore file */
import {
    setupActionLogging,
    log as logAction,
} from '@karriereat/action-logger/dist/log.esm';

import {
    getUuid,
} from '../services/auth';
import config from '../config';

setupActionLogging({
    url: config.api.action.url,
});

export async function log(action, params) {
    setupActionLogging({
        uuid: await getUuid(),
    });

    return logAction(action, params);
}
