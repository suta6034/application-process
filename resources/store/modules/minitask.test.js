import fakeTimers from '@sinonjs/fake-timers';
import {
    minitask,
} from './minitask';
import * as actionTypes from '../action-types';

jest.mock('../');

let state;
let rootState;
let getters;

beforeEach(() => {
    state = {
        meta: {
            skipped: null,
        },
        data: {
            address: null,
            birthdate: null,
            image: null,
            desiredJobEmploymentType: null,
            desiredJobJobfield: null,
            desiredJobTravelReadiness: null,
            desiredJobWorkFromHome: null,
            language: null,
            mobile: null,
            work: null,
            softSkills: null,
            jobTitle: null,
            jobField: null,
            visibility: null,
        },
    };
    getters = {};
    rootState = {
        profile: {
            basics: {
                birthdate: null,
                mobile: null,
                street: null,
                workInformations: null,
            },
            desiredJob: {
                employment: [],
                jobFields: [],
            },
            language: {
                rows: [],
            },
            image: null,
            work: {
                rows: [],
            },
            jobTitle: null,
            jobField: null,
            active: false,
            completeness: 51,
        },
    };
});

describe('Minitask', () => {
    describe('actions', () => {
        describe('FETCH_MINITASKS', () => {
            test('It should get the current state of minitasks from service.', () => {
                jest.mock('../../services/minitask', () => ({
                    getMinitasks: jest.fn(() => {}),
                }));

                const commit = jest.fn();
                minitask.actions[actionTypes.FETCH_MINITASKS]({ commit }, { uuid: () => {}, callback: () => {} });

                expect(commit).toHaveBeenCalledWith('SET_MINITASKS', state);
            });
        });
        describe('SET_MINITASK_SUCCESS_STATUS', () => {
            test('It should commit the set success status mutation.', () => {
                const commit = jest.fn();
                minitask.actions[actionTypes.SET_MINITASK_SUCCESS_STATUS]({ commit });

                expect(commit).toHaveBeenCalledWith('SET_MINITASK_SUCCESS_STATUS');
            });
        });
        describe('SET_MINITASK_SUCCESS_HIDE', () => {
            test('It should commit the set success hide mutation.', () => {
                const commit = jest.fn();
                minitask.actions[actionTypes.SET_MINITASK_SUCCESS_HIDE]({ commit });

                expect(commit).toHaveBeenCalledWith('SET_MINITASK_SUCCESS_HIDE');
            });
        });
        describe('SET_MINITASK_ADDRESS_SKIPPED', () => {
            test('It should commit the set address skipped mutation.', () => {
                const commit = jest.fn();
                const clock = fakeTimers.install({ now: 1552392000000 }); // 12.03.2019
                const date = new Date();
                minitask.actions[actionTypes.SET_MINITASK_ADDRESS_SKIPPED]({ commit });

                expect(commit).toHaveBeenCalledWith('SET_MINITASK_ADDRESS_SKIPPED', date);

                clock.uninstall();
            });
        });
        describe('SET_MINITASK_BIRTHDATE_SKIPPED', () => {
            test('It should commit the set birthdate skipped mutation.', () => {
                const commit = jest.fn();
                const clock = fakeTimers.install({ now: 1552392000000 }); // 12.03.2019
                const date = new Date();
                minitask.actions[actionTypes.SET_MINITASK_BIRTHDATE_SKIPPED]({ commit });

                expect(commit).toHaveBeenCalledWith('SET_MINITASK_BIRTHDATE_SKIPPED', date);

                clock.uninstall();
            });
        });
        describe('SET_MINITASK_IMAGE_SKIPPED', () => {
            test('It should commit image skipped mutation.', () => {
                const commit = jest.fn();
                const clock = fakeTimers.install({ now: 1552392000000 }); // 12.03.2019
                const date = new Date();
                minitask.actions[actionTypes.SET_MINITASK_IMAGE_SKIPPED]({ commit });

                expect(commit).toHaveBeenCalledWith('SET_MINITASK_IMAGE_SKIPPED', date);

                clock.uninstall();
            });
        });
        describe('SET_MINITASK_DESIREDJOBEMPLOYMENTTYPE_SKIPPED', () => {
            test('It should commit desired job employmenttype skipped mutation.', () => {
                const commit = jest.fn();
                const clock = fakeTimers.install({ now: 1552392000000 }); // 12.03.2019
                const date = new Date();
                minitask.actions[actionTypes.SET_MINITASK_DESIREDJOBEMPLOYMENTTYPE_SKIPPED]({ commit });

                expect(commit).toHaveBeenCalledWith('SET_MINITASK_DESIREDJOBEMPLOYMENTTYPE_SKIPPED', date);

                clock.uninstall();
            });
        });
        describe('SET_MINITASK_DESIREDJOBJOBFIELD_SKIPPED', () => {
            test('It should commit desired job jobfield skipped mutation.', () => {
                const commit = jest.fn();
                const clock = fakeTimers.install({ now: 1552392000000 }); // 12.03.2019
                const date = new Date();
                minitask.actions[actionTypes.SET_MINITASK_DESIREDJOBJOBFIELD_SKIPPED]({ commit });

                expect(commit).toHaveBeenCalledWith('SET_MINITASK_DESIREDJOBJOBFIELD_SKIPPED', date);

                clock.uninstall();
            });
        });
        describe('SET_MINITASK_DESIREDJOBTRAVELREADINESS_SKIPPED', () => {
            test('It should commit desired job travel readiness skipped mutation.', () => {
                const commit = jest.fn();
                const clock = fakeTimers.install({ now: 1552392000000 }); // 12.03.2019
                const date = new Date();
                minitask.actions[actionTypes.SET_MINITASK_DESIREDJOBTRAVELREADINESS_SKIPPED]({ commit });

                expect(commit).toHaveBeenCalledWith('SET_MINITASK_DESIREDJOBTRAVELREADINESS_SKIPPED', date);

                clock.uninstall();
            });
        });
        describe('SET_MINITASK_DESIREDJOBWORKFROMHOME_SKIPPED', () => {
            test('It should commit desired job home office skipped mutation.', () => {
                const commit = jest.fn();
                const clock = fakeTimers.install({ now: 1552392000000 }); // 12.03.2019
                const date = new Date();
                minitask.actions[actionTypes.SET_MINITASK_DESIREDJOBWORKFROMHOME_SKIPPED]({ commit });

                expect(commit).toHaveBeenCalledWith('SET_MINITASK_DESIREDJOBWORKFROMHOME_SKIPPED', date);

                clock.uninstall();
            });
        });
        describe('SET_MINITASK_LANGUAGE_SKIPPED', () => {
            test('It should commit language skipped mutation.', () => {
                const commit = jest.fn();
                const clock = fakeTimers.install({ now: 1552392000000 }); // 12.03.2019
                const date = new Date();
                minitask.actions[actionTypes.SET_MINITASK_LANGUAGE_SKIPPED]({ commit });

                expect(commit).toHaveBeenCalledWith('SET_MINITASK_LANGUAGE_SKIPPED', date);

                clock.uninstall();
            });
        });
        describe('SET_MINITASK_TELEPHONE_SKIPPED', () => {
            test('It should commit the set telephone skipped mutation.', () => {
                const commit = jest.fn();
                const clock = fakeTimers.install({ now: 1552392000000 }); // 12.03.2019
                const date = new Date();
                minitask.actions[actionTypes.SET_MINITASK_TELEPHONE_SKIPPED]({ commit });

                expect(commit).toHaveBeenCalledWith('SET_MINITASK_TELEPHONE_SKIPPED', date);

                clock.uninstall();
            });
        });
        describe('SET_MINITASK_WORK_SKIPPED', () => {
            test('It should commit work skipped mutation.', () => {
                const commit = jest.fn();
                const clock = fakeTimers.install({ now: 1552392000000 }); // 12.03.2019
                const date = new Date();
                state.data.work = date;
                minitask.actions[actionTypes.SET_MINITASK_WORK_SKIPPED]({ commit });

                expect(commit).toHaveBeenCalledWith('SET_MINITASK_WORK_SKIPPED', date);

                clock.uninstall();
            });
        });
        describe('SET_MINITASK_JOBTITLE_SKIPPED', () => {
            test('It should commit job title skipped mutation.', () => {
                const commit = jest.fn();
                const clock = fakeTimers.install({ now: 1552392000000 }); // 12.03.2019
                const date = new Date();
                state.data.jobTitle = date;
                minitask.actions[actionTypes.SET_MINITASK_JOBTITLE_SKIPPED]({ commit });

                expect(commit).toHaveBeenCalledWith('SET_MINITASK_JOBTITLE_SKIPPED', date);

                clock.uninstall();
            });
        });
        describe('SET_MINITASK_JOBFIELD_SKIPPED', () => {
            test('It should commit job field skipped mutation.', () => {
                const commit = jest.fn();
                const clock = fakeTimers.install({ now: 1552392000000 }); // 12.03.2019
                const date = new Date();
                state.data.jobField = date;
                minitask.actions[actionTypes.SET_MINITASK_JOBFIELD_SKIPPED]({ commit });

                expect(commit).toHaveBeenCalledWith('SET_MINITASK_JOBFIELD_SKIPPED', date);

                clock.uninstall();
            });
        });
        describe('SET_MINITASK_VISIBILITY_SKIPPED', () => {
            test('It should commit visibility skipped mutation.', () => {
                const commit = jest.fn();
                const clock = fakeTimers.install({ now: 1552392000000 }); // 12.03.2019
                const date = new Date();
                minitask.actions[actionTypes.SET_MINITASK_VISIBILITY_SKIPPED]({ commit });

                expect(commit).toHaveBeenCalledWith('SET_MINITASK_VISIBILITY_SKIPPED', date);

                clock.uninstall();
            });
        });
    });

    describe('mutations', () => {
        test('It should set the minitask success status.', () => {
            minitask.mutations.SET_MINITASK_SUCCESS_STATUS(state);

            expect(state.meta.showSuccess).toEqual(true);
        });

        test('It should set the minitask success hide to true.', () => {
            minitask.mutations.SET_MINITASK_SUCCESS_HIDE(state);

            expect(state.meta.hideSuccess).toEqual(true);
        });

        test('It should set the minitask address skipped.', () => {
            const address = 'Feldweg 1';
            minitask.mutations.SET_MINITASK_ADDRESS_SKIPPED(state, address);

            expect(state.data.address).toEqual('Feldweg 1');
        });

        test('It should set the minitask birthdate skipped.', () => {
            const date = '2019-01-02';
            minitask.mutations.SET_MINITASK_BIRTHDATE_SKIPPED(state, date);

            expect(state.data.birthdate).toEqual('2019-01-02');
        });

        test('It should set the minitask image skipped.', () => {
            const date = '2019-01-02';
            minitask.mutations.SET_MINITASK_IMAGE_SKIPPED(state, date);

            expect(state.data.image).toEqual('2019-01-02');
        });

        test('It should set the minitask desired job employment type skipped.', () => {
            const date = '2019-01-02';
            minitask.mutations.SET_MINITASK_DESIREDJOBEMPLOYMENTTYPE_SKIPPED(state, date);

            expect(state.data.desiredJobEmploymentType).toEqual('2019-01-02');
        });

        test('It should set the minitask desired job job field skipped.', () => {
            const date = '2019-01-02';
            minitask.mutations.SET_MINITASK_DESIREDJOBJOBFIELD_SKIPPED(state, date);

            expect(state.data.desiredJobJobfield).toEqual('2019-01-02');
        });

        test('It should set the minitask desired job travel readiness skipped.', () => {
            const date = '2019-01-02';
            minitask.mutations.SET_MINITASK_DESIREDJOBTRAVELREADINESS_SKIPPED(state, date);

            expect(state.data.desiredJobTravelReadiness).toEqual('2019-01-02');
        });

        test('It should set the minitask desired job home office skipped.', () => {
            const date = '2019-01-02';
            minitask.mutations.SET_MINITASK_DESIREDJOBWORKFROMHOME_SKIPPED(state, date);

            expect(state.data.desiredJobWorkFromHome).toEqual('2019-01-02');
        });

        test('It should set the minitask telephone skipped.', () => {
            const date = '2019-01-02';
            minitask.mutations.SET_MINITASK_TELEPHONE_SKIPPED(state, date);

            expect(state.data.mobile).toEqual('2019-01-02');
        });

        test('It should set the minitask work skipped.', () => {
            const date = '2019-01-02';
            minitask.mutations.SET_MINITASK_WORK_SKIPPED(state, date);

            expect(state.data.work).toEqual('2019-01-02');
        });

        test('It should set the minitask job title skipped.', () => {
            const date = '2019-01-02';
            minitask.mutations.SET_MINITASK_JOBTITLE_SKIPPED(state, date);

            expect(state.data.jobTitle).toEqual('2019-01-02');
        });

        test('It should set the minitask job field skipped.', () => {
            const date = '2019-01-02';
            minitask.mutations.SET_MINITASK_JOBFIELD_SKIPPED(state, date);

            expect(state.data.jobField).toEqual('2019-01-02');
        });

        test('It should set the minitask visibility skipped.', () => {
            const date = '2019-01-02';
            minitask.mutations.SET_MINITASK_VISIBILITY_SKIPPED(state, date);

            expect(state.data.visibility).toEqual('2019-01-02');
        });

        test('It should set the minitask state to current local storage data.', () => {
            const minitasks = {
                meta: {
                    skipped: '2019-02-23',
                    uuid: '199d367f-d66a-57ec-ba26-7b4642a6e0fb',
                },
                data: {
                    address: 'Feldweg 1',
                    birthdate: '2019-02-23',
                    image: null,
                    desiredJobEmploymentType: null,
                    desiredJobJobfield: null,
                    language: null,
                    mobile: null,
                    work: '2019-02-23',
                    jobTitle: null,
                    jobField: null,
                    visibility: null,
                },
            };
            minitask.mutations.SET_MINITASKS(state, minitasks);

            expect(state).toEqual(minitasks);
        });
    });

    describe('getters', () => {
        describe('addressDisplayStatus', () => {
            test('It should be false if address and skipdate are set.', () => {
                const clock = fakeTimers.install({ now: 1552392000000 }); // 12.03.2019
                state.data.address = new Date();
                rootState.profile.basics.town = 'Linz';
                rootState.profile.basics.street = 'Feldweg 1';

                expect(minitask.getters.addressDisplayStatus(state, getters, rootState)).toBe(false);

                clock.uninstall();
            });

            test('It should be true if no address or skipdate is set.', () => {
                state.data.address = null;
                rootState.profile.basics.town = 'Linz';
                rootState.profile.basics.street = null;

                expect(minitask.getters.addressDisplayStatus(state, getters, rootState)).toBe(true);
            });

            test('It should be false if skipdate is set, but address is not.', () => {
                const clock = fakeTimers.install({ now: 1552392000000 }); // 12.03.2019
                state.data.address = new Date();
                rootState.profile.basics.town = 'Linz';
                rootState.profile.basics.street = null;

                expect(minitask.getters.addressDisplayStatus(state, getters, rootState)).toBe(false);

                clock.uninstall();
            });

            test('It should be false if address is set, but skipdate is not.', () => {
                state.data.address = null;
                rootState.profile.basics.town = 'Linz';
                rootState.profile.basics.street = 'Feldweg 1';

                expect(minitask.getters.addressDisplayStatus(state, getters, rootState)).toBe(false);
            });

            test('It should be false if town is not set, but skipdate is not.', () => {
                state.data.address = null;
                rootState.profile.basics.town = null;

                expect(minitask.getters.addressDisplayStatus(state, getters, rootState)).toBeFalsy();
            });
        });

        describe('birthdateDisplayStatus', () => {
            test('It should be false if birthdate and skipdate are set.', () => {
                const clock = fakeTimers.install({ now: 1552392000000 }); // 12.03.2019
                state.data.birthdate = new Date();
                rootState.profile.basics.birthdate = '2019-03-12';

                expect(minitask.getters.birthdateDisplayStatus(state, getters, rootState)).toBe(false);

                clock.uninstall();
            });

            test('It should be true if no birthdate or skipdate is set.', () => {
                state.data.birthdate = null;
                rootState.profile.basics.birthdate = null;

                expect(minitask.getters.birthdateDisplayStatus(state, getters, rootState)).toBe(true);
            });

            test('It should be false if skipdate is set, but birthdate is not.', () => {
                const clock = fakeTimers.install({ now: 1552392000000 }); // 12.03.2019
                state.data.birthdate = new Date();
                rootState.profile.basics.birthdate = null;

                expect(minitask.getters.birthdateDisplayStatus(state, getters, rootState)).toBe(false);

                clock.uninstall();
            });

            test('It should be false if birthdate is set, but skipdate is not.', () => {
                state.data.birthdate = null;
                rootState.profile.basics.birthdate = '2000-03-12';

                expect(minitask.getters.birthdateDisplayStatus(state, getters, rootState)).toBe(false);
            });
        });

        describe('imageDisplayStatus', () => {
            test('It should be false if image and skipdate are set.', () => {
                const clock = fakeTimers.install({ now: 1552392000000 }); // 12.03.2019
                state.data.image = new Date();
                rootState.profile.image = ['image'];

                expect(minitask.getters.imageDisplayStatus(state, getters, rootState)).toBe(false);

                clock.uninstall();
            });

            test('It should be true if no image or skipdate is set.', () => {
                state.data.image = null;
                rootState.profile.image = [];

                expect(minitask.getters.imageDisplayStatus(state, getters, rootState)).toBe(true);
            });

            test('It should be false if skipdate is set, but image is not.', () => {
                const clock = fakeTimers.install({ now: 1552392000000 }); // 12.03.2019
                state.data.image = new Date();
                rootState.profile.image = [];

                expect(minitask.getters.imageDisplayStatus(state, getters, rootState)).toBe(false);

                clock.uninstall();
            });

            test('It should be false if image is set, but skipdate is not.', () => {
                state.data.image = null;
                rootState.profile.image = ['image'];

                expect(minitask.getters.imageDisplayStatus(state, getters, rootState)).toBe(false);
            });
        });

        describe('desiredJobEmploymentTypeDisplayStatus', () => {
            test('It should be false if desiredjob employment and skipdate are set.', () => {
                const clock = fakeTimers.install({ now: 1552392000000 }); // 12.03.2019
                state.data.desiredJobEmploymentType = new Date();
                rootState.profile.desiredJob.employment[0] = 'vollzeit';

                expect(minitask.getters.desiredJobEmploymentTypeDisplayStatus(state, getters, rootState)).toBe(false);

                clock.uninstall();
            });

            test('It should be true if no desiredjob employment or skipdate is set.', () => {
                state.data.desiredJobEmploymentType = null;
                rootState.profile.desiredJob.employment[0] = null;

                expect(minitask.getters.desiredJobEmploymentTypeDisplayStatus(state, getters, rootState)).toBe(true);
            });

            test('It should be false if skipdate is set, but desiredjob employment is not.', () => {
                const clock = fakeTimers.install({ now: 1552392000000 }); // 12.03.2019
                state.data.desiredJobEmploymentType = new Date();
                rootState.profile.desiredJob.employment[0] = null;

                expect(minitask.getters.desiredJobEmploymentTypeDisplayStatus(state, getters, rootState)).toBe(false);

                clock.uninstall();
            });

            test('It should be false if desiredjob employment is set, but skipdate is not.', () => {
                state.data.desiredJobEmploymentType = null;
                rootState.profile.desiredJob.employment[0] = 'vollzeit';

                expect(minitask.getters.desiredJobEmploymentTypeDisplayStatus(state, getters, rootState)).toBe(false);
            });
        });

        describe('desiredJobJobfieldDisplayStatus', () => {
            test('It should be false if desiredjob jobfield and skipdate are set.', () => {
                const clock = fakeTimers.install({ now: 1552392000000 }); // 12.03.2019
                state.data.desiredJobJobfield = new Date();
                rootState.profile.desiredJob.jobFields[0] = 'Coaching, Training';

                expect(minitask.getters.desiredJobJobfieldDisplayStatus(state, getters, rootState)).toBe(false);

                clock.uninstall();
            });

            test('It should be true if no desiredjob jobfield or skipdate is set.', () => {
                state.data.desiredJobJobfield = null;
                rootState.profile.desiredJob.jobFields[0] = null;

                expect(minitask.getters.desiredJobJobfieldDisplayStatus(state, getters, rootState)).toBe(true);
            });

            test('It should be false if skipdate is set, but desiredjob jobfield is not.', () => {
                const clock = fakeTimers.install({ now: 1552392000000 }); // 12.03.2019
                state.data.desiredJobJobfield = new Date();
                rootState.profile.desiredJob.jobFields[0] = null;

                expect(minitask.getters.desiredJobJobfieldDisplayStatus(state, getters, rootState)).toBe(false);

                clock.uninstall();
            });

            test('It should be false if desiredjob jobfield is set, but skipdate is not.', () => {
                state.data.desiredJobJobfield = null;
                rootState.profile.desiredJob.jobFields[0] = 'Coaching, Training';

                expect(minitask.getters.desiredJobJobfieldDisplayStatus(state, getters, rootState)).toBe(false);
            });
        });

        describe('languageDisplayStatus', () => {
            test('It should be false if language and skipdate are set.', () => {
                const clock = fakeTimers.install({ now: 1552392000000 }); // 12.03.2019
                state.data.language = new Date();
                rootState.profile.language.rows[0] = 'language';

                expect(minitask.getters.languageDisplayStatus(state, getters, rootState)).toBe(false);

                clock.uninstall();
            });

            test('It should be true if no language or skipdate is set.', () => {
                state.data.language = null;
                rootState.profile.language.rows[0] = null;

                expect(minitask.getters.languageDisplayStatus(state, getters, rootState)).toBe(true);
            });

            test('It should be false if skipdate is set, but language is not.', () => {
                const clock = fakeTimers.install({ now: 1552392000000 }); // 12.03.2019
                state.data.language = new Date();
                rootState.profile.language.rows[0] = null;

                expect(minitask.getters.languageDisplayStatus(state, getters, rootState)).toBe(false);

                clock.uninstall();
            });

            test('It should be false if language is set, but skipdate is not.', () => {
                state.data.language = null;
                rootState.profile.language.rows[0] = 'language';

                expect(minitask.getters.languageDisplayStatus(state, getters, rootState)).toBe(false);
            });
        });

        describe('telephoneDisplayStatus', () => {
            test('It should be false if telephone and skipdate are set.', () => {
                const clock = fakeTimers.install({ now: 1552392000000 }); // 12.03.2019
                state.data.mobile = new Date();
                rootState.profile.basics.mobile = '+43 123456';

                expect(minitask.getters.telephoneDisplayStatus(state, getters, rootState)).toBe(false);

                clock.uninstall();
            });

            test('It should be true if no telephone or skipdate is set.', () => {
                state.data.mobile = null;
                rootState.profile.basics.mobile = null;

                expect(minitask.getters.telephoneDisplayStatus(state, getters, rootState)).toBe(true);
            });

            test('It should be false if skipdate is set, but telephone is not.', () => {
                const clock = fakeTimers.install({ now: 1552392000000 }); // 12.03.2019
                state.data.mobile = new Date();
                rootState.profile.basics.mobile = null;

                expect(minitask.getters.telephoneDisplayStatus(state, getters, rootState)).toBe(false);

                clock.uninstall();
            });

            test('It should be false if telephone is set, but skipdate is not.', () => {
                state.data.mobile = null;
                rootState.profile.basics.mobile = '+43 123456';

                expect(minitask.getters.telephoneDisplayStatus(state, getters, rootState)).toBe(false);
            });
        });

        describe('workDisplayStatus', () => {
            test('It should be false if work experience and skipdate are set.', () => {
                const clock = fakeTimers.install({ now: 1552392000000 }); // 12.03.2019
                state.data.work = new Date();
                rootState.profile.work.rows[1] = 'work experience';

                expect(minitask.getters.workDisplayStatus(state, getters, rootState)).toBe(false);

                clock.uninstall();
            });

            test('It should be true if no work experience or skipdate is set.', () => {
                state.data.work = null;
                rootState.profile.work.rows[1] = null;

                expect(minitask.getters.workDisplayStatus(state, getters, rootState)).toBe(true);
            });

            test('It should be false if skipdate is set, but work experience is not.', () => {
                const clock = fakeTimers.install({ now: 1552392000000 }); // 12.03.2019
                state.data.work = new Date();
                rootState.profile.work.rows[1] = null;

                expect(minitask.getters.workDisplayStatus(state, getters, rootState)).toBe(false);

                clock.uninstall();
            });

            test('It should be false if work experience is set, but skipdate is not.', () => {
                state.data.work = null;
                rootState.profile.work.rows[1] = 'work experience';

                expect(minitask.getters.workDisplayStatus(state, getters, rootState)).toBe(false);
            });
        });

        describe('jobTitleDisplayStatus', () => {
            test('It should be false if job title and skipdate are set.', () => {
                const clock = fakeTimers.install({ now: 1552392000000 }); // 12.03.2019
                state.data.jobTitle = new Date();
                rootState.profile.jobTitle = 'job title';

                expect(minitask.getters.jobTitleDisplayStatus(state, getters, rootState)).toBe(false);

                clock.uninstall();
            });

            test('It should be true if no job title or skipdate is set.', () => {
                state.data.jobTitle = null;
                rootState.profile.jobTitle = null;

                expect(minitask.getters.jobTitleDisplayStatus(state, getters, rootState)).toBe(true);
            });

            test('It should be false if skipdate is set, but title is not.', () => {
                const clock = fakeTimers.install({ now: 1552392000000 }); // 12.03.2019
                state.data.jobTitle = new Date();
                rootState.profile.jobTitle = null;

                expect(minitask.getters.jobTitleDisplayStatus(state, getters, rootState)).toBe(false);

                clock.uninstall();
            });

            test('It should be false if title is set, but skipdate is not.', () => {
                state.data.jobTitle = null;
                rootState.profile.jobTitle = 'job title';

                expect(minitask.getters.jobTitleDisplayStatus(state, getters, rootState)).toBe(false);
            });
        });

        describe('jobFieldDisplayStatus', () => {
            test('It should be false if job field and skipdate are set.', () => {
                const clock = fakeTimers.install({ now: 1552392000000 }); // 12.03.2019
                state.data.jobField = new Date();
                rootState.profile.jobField = 'job field';

                expect(minitask.getters.jobFieldDisplayStatus(state, getters, rootState)).toBe(false);

                clock.uninstall();
            });

            test('It should be true if no job title or skipdate is set.', () => {
                state.data.jobField = null;
                rootState.profile.jobField = null;

                expect(minitask.getters.jobFieldDisplayStatus(state, getters, rootState)).toBe(true);
            });

            test('It should be false if skipdate is set, but title is not.', () => {
                const clock = fakeTimers.install({ now: 1552392000000 }); // 12.03.2019
                state.data.jobField = new Date();
                rootState.profile.jobField = null;

                expect(minitask.getters.jobFieldDisplayStatus(state, getters, rootState)).toBe(false);

                clock.uninstall();
            });

            test('It should be false if title is set, but skipdate is not.', () => {
                state.data.jobField = null;
                rootState.profile.jobField = 'job field';

                expect(minitask.getters.jobFieldDisplayStatus(state, getters, rootState)).toBe(false);
            });
        });

        describe('visibilityDisplayStatus', () => {
            test('It should be false if profile active and skipdate are set.', () => {
                const clock = fakeTimers.install({ now: 1552392000000 }); // 12.03.2019
                state.data.visibility = new Date();
                rootState.profile.active = true;

                expect(minitask.getters.visibilityDisplayStatus(state, getters, rootState)).toBe(false);

                clock.uninstall();
            });

            test('It should be true if profile is not active or skipdate is not set.', () => {
                state.data.visibility = null;
                rootState.profile.active = false;

                expect(minitask.getters.visibilityDisplayStatus(state, getters, rootState)).toBe(true);
            });

            test('It should be false if skipdate is set, but profile is not active.', () => {
                const clock = fakeTimers.install({ now: 1552392000000 }); // 12.03.2019
                state.data.visibility = new Date();
                rootState.profile.active = false;

                expect(minitask.getters.visibilityDisplayStatus(state, getters, rootState)).toBe(false);

                clock.uninstall();
            });

            test('It should be false if profile is active, but skipdate is not.', () => {
                state.data.visibility = null;
                rootState.profile.active = true;

                expect(minitask.getters.visibilityDisplayStatus(state, getters, rootState)).toBe(false);
            });
        });

        describe('successDisplayStatus', () => {
            test('It should be false if success is not set.', () => {
                state.meta.hideSuccess = null;
                state.meta.showSuccess = null;

                expect(minitask.getters.successDisplayStatus(state)).toBe(null);
            });

            test('It should be true if success is set.', () => {
                const clock = fakeTimers.install({ now: 1552392000000 }); // 12.03.2019
                state.meta.showSuccess = true;
                state.meta.hideSuccess = null;

                expect(minitask.getters.successDisplayStatus(state)).toBe(true);

                clock.uninstall();
            });

            test('It should be false if success and hide is set.', () => {
                const clock = fakeTimers.install({ now: 1552392000000 }); // 12.03.2019
                state.meta.showSuccess = true;
                state.meta.hideSuccess = true;

                expect(minitask.getters.successDisplayStatus(state)).toBe(false);

                clock.uninstall();
            });
        });
    });
});
