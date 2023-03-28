import {
    profileCreate,
} from './profile-create';
import {
    educationCategoriesGet,
    educationTypesGet,
} from '../../services/education';
import {
    // eslint-disable-next-line import/named
    checkUserByEmail,
} from '../../services/check';

jest.mock('../../services/autocomplete');
jest.mock('../../services/education');
jest.mock('../../services/check');
jest.mock('../');

let state;

beforeEach(() => {
    state = {
        basics: { email: null },
        steps: [
            {
                locked: false,
                active: true,
                completed: false,
            },
            {
                locked: true,
                active: false,
                completed: false,
            },
        ],
        origin: { origin: 'ONE_PAGER_WORK_MANUAL' },
        profileExists: false,
    };
});

describe('profileCreate', () => {
    describe('actions', () => {
        describe('fetchCheckUserByEmail()', () => {
            test('It should commit the fetched user status data.', async () => {
                const commit = jest.fn();
                await profileCreate.actions.fetchCheckUserByEmail({ commit });

                expect(commit).toBeCalledWith('SET_PROFILE_EXISTS', true);
            });
        });

        describe('fetchEducationCategories()', () => {
            test('It should commit the fetched education categories.', async () => {
                const commit = jest.fn();
                await profileCreate.actions.fetchEducationCategories({ commit });

                expect(commit).toBeCalledWith('SET_EDUCATION_CATEGORIES', {
                    educationCategories: { foo: 'foo', bar: 'bar' },
                });
            });
        });

        describe('fetchEducationTypes()', () => {
            test('It should commit the fetched education types.', async () => {
                const commit = jest.fn();
                await profileCreate.actions.fetchEducationTypes({ commit });

                expect(commit).toBeCalledWith('SET_EDUCATION_TYPES', {
                    educationTypes: { foo: 'foo', bar: 'bar' },
                });
            });
        });
    });

    describe('mutations', () => {
        describe('RESET_STATE', () => {
            test('It should reset the profileCreate state.', () => {
                profileCreate.mutations.SET_PROFILE_EXISTS(state, true);
                expect(state.profileExists).toBe(true);

                profileCreate.mutations.RESET_STATE(state);
                expect(state.profileExists).toBe(false);
            });
        });

        describe('SET_EDUCATION_CATEGORIES', () => {
            test('It should set the education categories.', () => {
                profileCreate.mutations.SET_EDUCATION_CATEGORIES(state, { educationCategories: ['foo', 'bar'] });

                expect(state.educationCategories).toEqual(['foo', 'bar']);
            });

            test('It should set the state of profileExists.', () => {
                profileCreate.mutations.SET_PROFILE_EXISTS(state, true);

                expect(state.profileExists).toEqual(true);
            });
        });

        describe('SET_USER_WITH_EMAIL_EXISTS', () => {
            test('It should set user with email exists.', () => {
                profileCreate.mutations.SET_USER_WITH_EMAIL_EXISTS(state, true);

                expect(state.userWithEmailExists).toBe(true);
            });
        });

        describe('SET_PROFILE_EXISTS', () => {
            test('It should set profile exists.', () => {
                profileCreate.mutations.SET_PROFILE_EXISTS(state, true);

                expect(state.profileExists).toBe(true);
            });
        });

        describe('SET_SOURCE', () => {
            test('It should set the given source.', () => {
                profileCreate.mutations.SET_SOURCE(state, { data: 'foo' });

                expect(state.source).toEqual({ data: 'foo' });
            });
        });

        describe('SET_EDUCATION_TYPES', () => {
            test('It should set the education types.', () => {
                profileCreate.mutations.SET_EDUCATION_TYPES(state, { educationTypes: ['foo', 'bar'] });

                expect(state.educationTypes).toEqual(['foo', 'bar']);
            });
        });
    });

    describe('Error while fetching data', () => {
        describe('fetchCheckUserByEmail', () => {
            test('It should open the error modal.', async () => {
                const commit = jest.fn();
                const error = new Error();

                error.response = { status: 500 };
                checkUserByEmail.mockReturnValue(Promise.reject(error));

                await profileCreate.actions.fetchCheckUserByEmail({ commit });

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

        describe('fetchEducationCategories', () => {
            test('It should open the error modal.', async () => {
                const commit = jest.fn();
                const error = new Error();

                error.response = { status: 500 };
                educationCategoriesGet.mockReturnValue(Promise.reject(error));

                await profileCreate.actions.fetchEducationCategories({ commit });

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

        describe('fetchEducationTypes', () => {
            test('It should open the error modal.', async () => {
                const commit = jest.fn();
                const error = new Error();

                error.response = { status: 500 };
                educationTypesGet.mockReturnValue(Promise.reject(error));

                await profileCreate.actions.fetchEducationTypes({ commit });

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
    });
});
