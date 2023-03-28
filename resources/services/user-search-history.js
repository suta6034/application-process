import * as logger from '../utils/logger';

const jobsKey = 'user-activity-history/v1/job-search/keywords';
const locationsKey = 'user-activity-history/v1/job-search/locations';

export function userSearchHistory() {
    try {
        return {
            jobs: JSON.parse(localStorage.getItem(jobsKey)) ?? [],
            locations: JSON.parse(localStorage.getItem(locationsKey)) ?? [],
        };
    } catch (exception) {
        /* istanbul ignore next */
        logger.warning({
            exception,
            message: 'Failed to read user-search-history from local storage.',
        });
        return {
            jobs: [],
            locations: [],
        };
    }
}
