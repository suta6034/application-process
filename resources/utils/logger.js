/* istanbul ignore file */
import * as Sentry from '@sentry/vue';

import config from '../config';

const LEVEL_INFO = 'info';
const LEVEL_WARNING = 'warning';
const LEVEL_ERROR = 'error';
const MESSAGE_LEVEL_MAP = [
    {
        level: LEVEL_WARNING,
        message: /^Network Error$/,
    },
];

export const userInfoTags = {
    INLINE: 'inline',
    MODAL: 'modal',
    NONE: 'none',
    PAGE: 'page',
};

function shouldBeLogged() {
    if (!config.sentry) return false;

    return true;
}

function levelFromMessage(message = '') {
    const match = MESSAGE_LEVEL_MAP.find(x => message.match(x.message));

    return match ? match.level : null;
}

function log({
    exception,
    extras,
    fingerprint,
    level,
    message,
    tags,
}) {
    if (!shouldBeLogged()) return null;

    const errorMessage = message || exception.message;

    Sentry.withScope((scope) => {
        if (extras) scope.setExtras(extras);
        if (fingerprint) scope.setFingerprint(fingerprint);
        if (tags) scope.setTags(tags);

        scope.setLevel(levelFromMessage(errorMessage) || level);

        Sentry.captureException(exception);
    });

    return Sentry.lastEventId();
}

export function info(options) {
    return log({
        ...options,
        level: LEVEL_INFO,
    });
}

export function warning(options) {
    return log({
        ...options,
        level: LEVEL_WARNING,
    });
}

export function error(options) {
    return log({
        ...options,
        level: LEVEL_ERROR,
    });
}
