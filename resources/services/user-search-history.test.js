import * as userSearchHistoryResponse from './__mocks__/responses/user-search-history';
import {
    userSearchHistory,
} from './user-search-history';

const {
    jobs: jobSearchHistoryEntries,
    locations: locationSearchHistoryEntries,
} = userSearchHistoryResponse;

const jobsKey = 'user-activity-history/v1/job-search/keywords';
const locationsKey = 'user-activity-history/v1/job-search/locations';

describe('userSearchHistory()', () => {
    beforeEach(() => localStorage.clear());

    test('It should be a function.', () => {
        expect(typeof userSearchHistory).toBe('function');
    });

    test('It should return an empty jobs array when the key is not found.', () => {
        const { jobs } = userSearchHistory();
        expect(Array.isArray(jobs)).toBe(true);
        expect(jobs.length).toBe(0);
    });

    test('It should return an empty locations array when the key is not found.', () => {
        const { locations } = userSearchHistory();
        expect(Array.isArray(locations)).toBe(true);
        expect(locations).toEqual([]);
    });

    test('It should return the jobs from userSearchHistory.', () => {
        localStorage.setItem(jobsKey, JSON.stringify(jobSearchHistoryEntries));
        const { jobs } = userSearchHistory();

        expect(jobs).toEqual(jobSearchHistoryEntries);
    });

    test('It should return the locations from userSearchHistory.', () => {
        localStorage.setItem(locationsKey, JSON.stringify(locationSearchHistoryEntries));
        const { locations } = userSearchHistory();

        expect(locations).toEqual(locationSearchHistoryEntries);
    });
});
