import * as logger from './logger';

export function makeQueue() {
    let isIdle = true;
    const jobs = new Set();

    async function run(callback) {
        isIdle = false;

        try {
            await callback();
        } catch (exception) {
            // Queue callbacks must never throw an error but handle all errors
            // themselves. This means this code should never be reached.
            if (process.env.NODE_ENV === 'development') {
                // eslint-disable-next-line no-console
                console.error(exception);
            }
            /* istanbul ignore next */
            logger.warning({
                exception,
                extras: {
                    queueError: 'Queue callbacks must have own error handling!',
                },
                tags: {
                    user_info: logger.userInfoTags.NONE,
                },
            });
        }

        const next = jobs.values().next().value;
        const hasNext = Boolean(next);

        if (hasNext) {
            jobs.delete(next);
            next();
            return;
        }

        isIdle = true;
    }

    return {
        add(callback) {
            if (isIdle) {
                run(callback);
                return;
            }

            jobs.add(() => run(callback));
        },
    };
}
