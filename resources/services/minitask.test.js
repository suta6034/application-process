import fakeTimers from '@sinonjs/fake-timers';

import {
    getMinitasks,
    setMinitaskSkipped,
} from './minitask';

import localStorage from './__mocks__/localStorage';

window.localStorage = localStorage;

describe('minitask', () => {
    describe('localStorage', () => {
        beforeEach(() => localStorage.clear());

        test('It should be initialized.', () => {
            expect(localStorage.store)
                .toEqual({});
        });

        test('It should returns undefined if requested item does not exist.', () => {
            const foo = localStorage.getItem('foo');

            expect(foo)
                .toBeUndefined();
        });

        test('It should get and set the value of an item.', () => {
            localStorage.setItem('foo', 'bar');
            const foo = localStorage.getItem('foo');

            expect(foo)
                .toBe('bar');
        });
    });

    describe('getMinitasks()', () => {
        test('It should be a function.', () => {
            expect(typeof getMinitasks).toBe('function');
        });

        test('It should return the storage when skipped is set.', () => {
            const clock = fakeTimers.install({ now: 1552392000000 }); // 12.03.2019
            const minitasksSkipped = {
                meta: {
                    skipped: '2019-03-10T08:58:42.634Z',
                    uuid: '199d367f-d66a-57ec-ba26-7b4642a6e0fb',
                },
                data: {
                    birthdate: null,
                    mobile: null,
                    image: '2019-03-10T08:58:42.634Z',
                    address: null,
                    desiredJobEmploymentType: null,
                    desiredJobJobfield: null,
                    desiredJobTravelReadiness: null,
                    desiredJobWorkFromHome: null,
                    language: null,
                    work: null,
                    softSkills: null,
                    jobTitle: null,
                    jobField: null,
                    visibility: null,
                },
            };

            getMinitasks('199d367f-d66a-57ec-ba26-7b4642a6e0fb');
            setMinitaskSkipped('image', '2019-03-10T08:58:42.634Z');
            const minitasks = getMinitasks('199d367f-d66a-57ec-ba26-7b4642a6e0fb');

            expect(minitasks).toEqual(minitasksSkipped);

            clock.uninstall();
        });

        test('It should set the email.', () => {
            const minitasksEmail = {
                meta: {
                    skipped: null,
                    uuid: '199d367f-d66a-57ec-ba26-7b4642a6e0fb',
                },
                data: {
                    birthdate: null,
                    mobile: null,
                    image: null,
                    address: null,
                    desiredJobEmploymentType: null,
                    desiredJobJobfield: null,
                    desiredJobTravelReadiness: null,
                    desiredJobWorkFromHome: null,
                    language: null,
                    work: null,
                    softSkills: null,
                    jobTitle: null,
                    jobField: null,
                    visibility: null,
                },
            };
            const minitasks = getMinitasks('199d367f-d66a-57ec-ba26-7b4642a6e0fb');

            expect(minitasks).toEqual(minitasksEmail);
        });

        test('It should clear the local storage if given email is not equal to the email in storage.', () => {
            const minitasksEmail = {
                meta: {
                    skipped: null,
                    uuid: '199d367f-d66a-57ec-ba26-7b4642a6e0fb',
                },
                data: {
                    birthdate: null,
                    mobile: null,
                    image: null,
                    address: null,
                    desiredJobEmploymentType: null,
                    desiredJobJobfield: null,
                    desiredJobTravelReadiness: null,
                    desiredJobWorkFromHome: null,
                    language: null,
                    work: null,
                    softSkills: null,
                    jobTitle: null,
                    jobField: null,
                    visibility: null,
                },
            };
            getMinitasks('bar@foo');
            const minitasks = getMinitasks('199d367f-d66a-57ec-ba26-7b4642a6e0fb');

            expect(minitasks).toEqual(minitasksEmail);
        });
    });

    describe('setMinitaskSkipped()', () => {
        test('It should be a function.', () => {
            expect(typeof setMinitaskSkipped).toBe('function');
        });

        test('It should set the meta skipped.', () => {
            const clock = fakeTimers.install({ now: 1552392000000 }); // 12.03.2019
            const minitasksSkipped = {
                meta: {
                    skipped: '2019-03-10T08:58:42.634Z',
                    uuid: '199d367f-d66a-57ec-ba26-7b4642a6e0fb',
                },
                data: {
                    birthdate: '2019-03-10T08:58:42.634Z',
                    mobile: null,
                    image: null,
                    address: null,
                    desiredJobEmploymentType: null,
                    desiredJobJobfield: null,
                    desiredJobTravelReadiness: null,
                    desiredJobWorkFromHome: null,
                    language: null,
                    work: null,
                    softSkills: null,
                    jobTitle: null,
                    jobField: null,
                    visibility: null,
                },
            };

            getMinitasks('199d367f-d66a-57ec-ba26-7b4642a6e0fb');
            setMinitaskSkipped('birthdate', '2019-03-10T08:58:42.634Z');
            const minitasks = getMinitasks('199d367f-d66a-57ec-ba26-7b4642a6e0fb');

            expect(minitasks).toEqual(minitasksSkipped);

            clock.uninstall();
        });
    });
});
