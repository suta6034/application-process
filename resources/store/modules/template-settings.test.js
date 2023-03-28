import {
    templateSettings,
} from './template-settings';
import * as actionTypes from '../action-types';
import * as mutationTypes from '../mutation-types';

jest.mock('../');

let state;

beforeEach(() => {
    state = {
        modified: false,
        settings: {
            template: 'vegan',
            color: 'blu-gre',
            font: 'not-not',
        },
    };
});

describe('template-settings', () => {
    describe('getters', () => {
        describe('templateSettings', () => {
            test('It should return settings from the state.', () => {
                expect(templateSettings.getters.templateSettings(state)).toEqual({
                    template: 'vegan',
                    color: 'blu-gre',
                    font: 'not-not',
                });
            });

            test('It should sanitize impossible template settings.', () => {
                const impossibleState = {
                    settings: {
                        template: 'vegan',
                        color: 'karriere-malachite',
                        font: 'not-not',
                    },
                };

                expect(templateSettings.getters.templateSettings(impossibleState)).toEqual({
                    template: 'vegan',
                    color: 'blu-gre',
                    font: 'not-not',
                });
            });
        });
    });

    describe('mutations', () => {
        test('SET_TEMPLATE_SETTINGS', () => {
            templateSettings.mutations[mutationTypes.SET_TEMPLATE_SETTINGS](state, {
                template: 'vegan',
                color: 'win',
                font: 'not-not',
            });
            expect(state.settings).toEqual({
                template: 'vegan',
                color: 'win',
                font: 'not-not',
            });
        });
        test('SET_TEMPLATE_SETTINGS_BY_KEY', () => {
            templateSettings.mutations[mutationTypes.SET_TEMPLATE_SETTINGS_BY_KEY](state, {
                key: 'template',
                value: 'ladder',
            });
            expect(state.settings).toEqual({
                template: 'ladder',
                color: 'blu-gre',
                font: 'not-not',
            });
        });
        test('SET_MODIFIED', () => {
            templateSettings.mutations[mutationTypes.SET_MODIFIED](state, true);
            expect(state.modified).toEqual(true);
        });
    });

    describe('actions', () => {
        test('FETCH_TEMPLATE_SETTINGS', async () => {
            const commit = jest.fn();
            state = {
                modified: false,
                settings: {
                    template: 'double-decker',
                    color: 'cya',
                    font: 'not-not',
                },
            };
            await templateSettings.actions[actionTypes.FETCH_TEMPLATE_SETTINGS]({ commit, state });

            expect(commit).toBeCalledWith('SET_TEMPLATE_SETTINGS', {
                template: 'double-decker',
                color: 'cya',
                font: 'not-not',
            });
            expect(commit).toBeCalledWith('SET_MODIFIED', true);
        });
        test('CREATE_TEMPLATE_SETTINGS', async () => {
            const commit = jest.fn();
            state = {
                modified: true,
                settings: {
                    template: 'ladder',
                    color: 'gre',
                    font: 'not-not',
                },
            };
            await templateSettings.actions[actionTypes.CREATE_TEMPLATE_SETTINGS]({ commit, state }, {});

            expect(state.settings).toEqual({
                template: 'ladder',
                color: 'gre',
                font: 'not-not',
            });
        });
        test('UPDATE_TEMPLATE_SETTINGS', async () => {
            const commit = jest.fn();
            state = {
                modified: true,
                settings: {
                    template: 'ladder',
                    color: 'gre',
                    font: 'not-not',
                },
            };
            await templateSettings.actions[actionTypes.UPDATE_TEMPLATE_SETTINGS]({ commit, state }, {});

            expect(state.settings).toEqual({
                template: 'ladder',
                color: 'gre',
                font: 'not-not',
            });
        });
    });

    describe('Error while fetching data', () => {
        describe('createTemplateSettings', () => {
            test('It should open the error modal.', async () => {
                const commit = jest.fn();
                const error = new Error();

                error.response = { status: 500 };
                // postTemplateSettings.mockReturnValue(Promise.reject(error));

                await templateSettings.actions[actionTypes.CREATE_TEMPLATE_SETTINGS]({ commit }, {});

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
