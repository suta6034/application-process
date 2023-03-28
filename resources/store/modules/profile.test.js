import fakeTimers from '@sinonjs/fake-timers';

import {
    profile,
} from './profile';
import * as actionTypes from '../action-types';
import {
    // eslint-disable-next-line import/named
    __setProfileCreateReturn,
    // eslint-disable-next-line import/named
    __setProfileGetReturn,
} from '../../services/profile';
import {
    Profile,
} from '../../models/Profile';
import {
    educationCategoriesGet,
    educationTypesGet,
} from '../../services/education';

jest.useFakeTimers();

jest.mock('../');
jest.mock('../../services/check');
jest.mock('../../services/education');
jest.mock('../../services/profile');

let state;

beforeEach(() => {
    state = {
        active: false,
        boosterCounter: 0,
        cancelTimestamp: 0,
        completeness: 0,
        created: null,
        educationCategories: [],
        educationTypes: [],
        exists: false,
        fetched: null,
        anyFormDirty: false,
        hasSeenBooster: false,
        hasWorkExperience: false,
        image: [],
        origin: { origin: 'ONE_PAGER_WORK_MANUAL' },
        profileText: { profileText: '' },
        statement: { statement: '' },
    };
});

afterEach(() => {
    // Reset the return value.
    __setProfileCreateReturn();
    __setProfileGetReturn();
});

describe('profile', () => {
    describe('actions', () => {
        describe('CREATE_PROFILE', () => {
            test('It should update all necessary modules and set the `fetched` status.', async () => {
                const commit = jest.fn();

                await profile.actions[actionTypes.CREATE_PROFILE]({ commit });

                expect(commit).toHaveBeenCalledWith('SET_PROFILE_FETCHED', null);
                expect(commit).toHaveBeenCalledWith('SET_PROFILE_CREATED', null);

                expect(commit).toHaveBeenCalledWith('basics/UPDATE_FROM_QUERY', {});
                expect(commit).toHaveBeenCalledWith('desiredJob/UPDATE_FROM_QUERY', {});
                expect(commit).toHaveBeenCalledWith('education/UPDATE_FROM_QUERY', []);
                expect(commit).toHaveBeenCalledWith('language/UPDATE_FROM_QUERY', []);
                expect(commit).toHaveBeenCalledWith('profileText/UPDATE_FROM_QUERY', '');
                expect(commit).toHaveBeenCalledWith('skill/UPDATE_FROM_QUERY', []);
                expect(commit).toHaveBeenCalledWith('statement/UPDATE_FROM_QUERY', '');
                expect(commit).toHaveBeenCalledWith('work/UPDATE_FROM_QUERY', []);

                expect(commit).toHaveBeenCalledWith('SET_PROFILE_FLAGS', { isActive: true });
                expect(commit).toHaveBeenCalledWith('SET_PROFILE_FETCHED', expect.any(Number));
                expect(commit).toHaveBeenCalledWith('SET_PROFILE_CREATED', expect.any(Number));
            });

            test('It should handle errors.', async () => {
                const commit = jest.fn();

                __setProfileCreateReturn(new Error());

                await profile.actions[actionTypes.CREATE_PROFILE]({ commit });

                expect(commit).toHaveBeenCalledWith('SET_PROFILE_FETCHED', null);
                expect(commit).toHaveBeenCalledWith('SET_PROFILE_FETCHED', false);
            });
        });

        describe('fetchEducationCategories()', () => {
            test('It should commit the fetched education categories.', async () => {
                const commit = jest.fn();
                await profile.actions.fetchEducationCategories({ commit });

                expect(commit).toBeCalledWith('SET_EDUCATION_CATEGORIES', {
                    educationCategories: { foo: 'foo', bar: 'bar' },
                });
            });

            test('It should open the error modal.', async () => {
                const commit = jest.fn();
                const error = new Error();

                error.response = { status: 500 };
                educationCategoriesGet.mockReturnValue(Promise.reject(error));

                await profile.actions.fetchEducationCategories({ commit });

                expect(commit).toBeCalledWith(
                    expect.anything(),
                    {
                        ariaLabel: expect.anything(),
                        componentName: 'ModalApiError',
                        componentProps: expect.anything(),
                    },
                    expect.anything(),
                );
            });
        });

        describe('fetchEducationTypes()', () => {
            test('It should commit the fetched education types.', async () => {
                const commit = jest.fn();
                await profile.actions.fetchEducationTypes({ commit });

                expect(commit).toBeCalledWith('SET_EDUCATION_TYPES', {
                    educationTypes: { foo: 'foo', bar: 'bar' },
                });
            });

            test('It should open the error modal.', async () => {
                const commit = jest.fn();
                const error = new Error();

                error.response = { status: 500 };
                educationTypesGet.mockReturnValue(Promise.reject(error));

                await profile.actions.fetchEducationTypes({ commit });

                expect(commit).toBeCalledWith(
                    expect.anything(),
                    {
                        ariaLabel: expect.anything(),
                        componentName: 'ModalApiError',
                        componentProps: expect.anything(),
                    },
                    expect.anything(),
                );
            });
        });

        describe('FETCH_PROFILE', () => {
            test('It should update all necessary modules and set the `fetched` status.', async () => {
                const commit = jest.fn();

                await profile.actions[actionTypes.FETCH_PROFILE]({ commit });

                expect(commit).toHaveBeenCalledWith('SET_PROFILE_FETCHED', null);

                expect(commit).toHaveBeenCalledWith('basics/UPDATE_FROM_QUERY', {});
                expect(commit).toHaveBeenCalledWith('desiredJob/UPDATE_FROM_QUERY', {});
                expect(commit).toHaveBeenCalledWith('education/UPDATE_FROM_QUERY', []);
                expect(commit).toHaveBeenCalledWith('language/UPDATE_FROM_QUERY', []);
                expect(commit).toHaveBeenCalledWith('profileText/UPDATE_FROM_QUERY', '');
                expect(commit).toHaveBeenCalledWith('skill/UPDATE_FROM_QUERY', []);
                expect(commit).toHaveBeenCalledWith('statement/UPDATE_FROM_QUERY', '');
                expect(commit).toHaveBeenCalledWith('work/UPDATE_FROM_QUERY', []);

                expect(commit).toHaveBeenCalledWith('SET_PROFILE_FLAGS', { isActive: true });
                expect(commit).toHaveBeenCalledWith('SET_PROFILE_FETCHED', expect.any(Number));
            });

            test('It should handle errors.', async () => {
                const commit = jest.fn();

                __setProfileGetReturn(new Error());

                await profile.actions[actionTypes.FETCH_PROFILE]({ commit });

                expect(commit).toHaveBeenCalledWith('SET_PROFILE_FETCHED', null);
                expect(commit).toHaveBeenCalledWith('SET_PROFILE_FETCHED', false);
            });
        });

        describe('UPDATE_PROFILE', () => {
            test('It should update all necessary modules and set the `fetched` status.', async () => {
                const commit = jest.fn();

                await profile.actions[actionTypes.UPDATE_PROFILE]({ commit });

                expect(commit).toHaveBeenCalledWith('SET_PROFILE_FETCHED', null);

                expect(commit).toHaveBeenCalledWith('basics/UPDATE_FROM_QUERY', {});
                expect(commit).toHaveBeenCalledWith('desiredJob/UPDATE_FROM_QUERY', {});
                expect(commit).toHaveBeenCalledWith('education/UPDATE_FROM_QUERY', []);
                expect(commit).toHaveBeenCalledWith('language/UPDATE_FROM_QUERY', []);
                expect(commit).toHaveBeenCalledWith('profileText/UPDATE_FROM_QUERY', '');
                expect(commit).toHaveBeenCalledWith('skill/UPDATE_FROM_QUERY', []);
                expect(commit).toHaveBeenCalledWith('statement/UPDATE_FROM_QUERY', '');
                expect(commit).toHaveBeenCalledWith('work/UPDATE_FROM_QUERY', []);

                expect(commit).toHaveBeenCalledWith('SET_PROFILE_FLAGS', { isActive: true });
                expect(commit).toHaveBeenCalledWith('SET_PROFILE_FETCHED', expect.any(Number));
            });

            test('It should handle errors.', async () => {
                const commit = jest.fn();

                __setProfileCreateReturn(new Error());

                await profile.actions[actionTypes.UPDATE_PROFILE]({ commit });

                expect(commit).toHaveBeenCalledWith('SET_PROFILE_FETCHED', null);
                expect(commit).toHaveBeenCalledWith('SET_PROFILE_FETCHED', false);
            });
        });

        describe('UPDATE_ACTIVE_STATUS', () => {
            test('It should update the active status and update the profile.', async () => {
                const commit = jest.fn();

                await profile.actions[actionTypes.UPDATE_PROFILE]({ commit });

                expect(commit).toHaveBeenCalledWith('SET_PROFILE_FLAGS', { isActive: true });
            });
        });

        describe('UPDATE_HAS_SEEN_BOOSTER', () => {
            test('It should update the hasSeenBooster status and update the profile meta.', async () => {
                const commit = jest.fn();
                const clock = fakeTimers.install({ now: 1580663088 }); // 02.02.2020
                const date = Date.now();

                await profile.actions[actionTypes.UPDATE_HAS_SEEN_BOOSTER]({ commit });

                expect(commit).toHaveBeenCalledWith('SET_PROFILE_FLAGS', { hasSeenBooster: date });

                clock.uninstall();
            });
        });
    });

    describe('mutations', () => {
        describe('SET_EDUCATION_CATEGORIES', () => {
            test('It should set the education categories.', () => {
                profile.mutations.SET_EDUCATION_CATEGORIES(state, { educationCategories: ['foo', 'bar'] });

                expect(state.educationCategories).toEqual(['foo', 'bar']);
            });
        });

        describe('SET_EDUCATION_TYPES', () => {
            test('It should set the education types.', () => {
                profile.mutations.SET_EDUCATION_TYPES(state, { educationTypes: ['foo', 'bar'] });

                expect(state.educationTypes).toEqual(['foo', 'bar']);
            });
        });

        test('SET_PROFILE_CREATED', () => {
            profile.mutations.SET_PROFILE_CREATED(state, 1234);
            expect(state.created).toEqual(1234);
        });

        test('SET_PROFILE_FETCHED', () => {
            profile.mutations.SET_PROFILE_FETCHED(state, 1234);
            expect(state.fetched).toEqual(1234);
        });

        test('SET_PROFILE_FLAGS', () => {
            // eslint-disable-next-line max-len
            profile.mutations.SET_PROFILE_FLAGS(state, {
                isActive: true,
                hasWorkExperience: true,
                exists: true,
                hasSeenBooster: true,
            });
            expect(state.active).toBe(true);
            expect(state.hasWorkExperience).toBe(true);
            expect(state.exists).toBe(true);
            expect(state.hasSeenBooster).toBe(true);
        });

        test('SET_PROFILE_META', () => {
            profile.mutations.SET_PROFILE_META(state, { completeness: 100 });
            expect(state.completeness).toBe(100);
        });

        test('SET_FORM_DIRTY', () => {
            profile.mutations.SET_FORM_DIRTY(state, true);
            expect(state.anyFormDirty).toBe(true);
        });

        test('TRIGGER_CANCEL', () => {
            profile.mutations.TRIGGER_CANCEL(state, 12345);
            expect(state.cancelTimestamp).toBe(12345);
        });
    });

    describe('getters', () => {
        test('created (null)', () => {
            state.created = null;
            expect(profile.getters.created(state)).toBe(false);
        });

        test('created (Number)', () => {
            state.created = 123456;
            expect(profile.getters.created(state)).toBe(true);
        });

        test('created (false)', () => {
            state.created = false;
            expect(profile.getters.created(state)).toBe(true);
        });

        test('fetched (null)', () => {
            state.fetched = null;
            expect(profile.getters.fetched(state)).toBe(false);
        });

        test('fetched (Number)', () => {
            state.fetched = 123456;
            expect(profile.getters.fetched(state)).toBe(true);
        });

        test('fetched (false)', () => {
            state.fetched = false;
            expect(profile.getters.fetched(state)).toBe(true);
        });

        test('imageVersion (Object)', () => {
            state.image = [{ version: 'square' }];
            expect(profile.getters.imageVersion(state)('square')).toEqual(state.image[0]);
        });

        test('imageVersion (undefined)', () => {
            state.image = [];
            expect(profile.getters.imageVersion(state)('square')).toEqual(undefined);
        });

        test('isValid (true)', () => {
            state.basics = { email: 'test' };
            expect(profile.getters.isValid(state)).toBe(true);
        });

        test('isValid (false)', () => {
            state.basics = { email: null };
            expect(profile.getters.isValid(state)).toBe(false);
        });

        test('model', () => {
            expect(profile.getters.model(state, {}) instanceof Profile).toBe(true);
        });
    });
});
