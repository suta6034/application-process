import Vuex from 'vuex';
import fakeTimers from '@sinonjs/fake-timers';

import {
    createLocalVue,
} from '@vue/test-utils';
import {
    // eslint-disable-next-line import/named
    __createMocks as createStoreMocks,
} from '../../store';
import {
    mount,
} from '../../../tests/app/vue/utils';

import PageDashboard from './PageDashboard';
import {
    SHOW_POPUP,
} from '../../store/mutation-types';
import {
    showToast,
} from '../../utils/toast';
import {
    travelReadinessInfoBox,
} from '../../data/time-gated-elements';

jest.mock('../../router', () => ({
    afterEach: () => {},
}));
jest.mock('../../services/auth');
jest.mock('../../store');
jest.mock('../../utils/toast');
jest.mock('../../store/modules/components/popup');
jest.mock('../../services/soft-skills');

jest.mock('../../config', () => ({
    api: {
        action: { url: 'http://localhost:111/dev' },
        backend: { url: 'http://localhost:554/dev' },
        mockTestApi: { url: 'http://localhost:123' },
    },
}));

let wrapper;
let storeMocks;
let mockRouter;

const localVue = createLocalVue();

localVue.use(Vuex);

const wrapperFactory = () => mount(PageDashboard, {
    localVue,
    store: storeMocks.store,
    mocks: {
        $randomFieldId: jest.fn(),
        $router: mockRouter,
    },
    provide: {
        router: mockRouter,
    },
});

describe('PageDashboard', () => {
    beforeEach(() => {
        localStorage.clear();
        storeMocks = createStoreMocks();
        storeMocks.modules.popup.mutations[SHOW_POPUP].mockReset();
        storeMocks.store.state.profile.boosterCounter = 1;
        storeMocks.store.state.profile.hasSeenBooster = 1582909488; // 28.02.2020
        storeMocks.store.state.profile.exists = false;

        mockRouter = {
            replace: jest.fn(),
        };

        wrapper = wrapperFactory();
    });

    test('It should render a `<div>`.', () => {
        expect(wrapper.element.tagName).toBe('DIV');
    });

    test('It should not show the toast when query is empty.', () => {
        wrapper.vm.showUserFeedback();

        expect(showToast).not.toBeCalled();
        expect(mockRouter.replace).not.toBeCalled();
    });

    test('It should show the toast and replace the query when there are url params.', () => {
        wrapper.vm.router.currentRoute.query = { toast: 'hello' };

        wrapper.vm.showUserFeedback();

        expect(showToast).toBeCalled();
        expect(mockRouter.replace).toBeCalled();
    });

    describe('KaBooM', () => {
        test('It should not show the Boostermodal when the featureFlag is set false.', async () => {
            jest.mock('../../config', () => ({
                api: {
                    action: { url: 'http://localhost:111/dev' },
                    backend: { url: 'http://localhost:554/dev' },
                    mockTestApi: { url: 'http://localhost:123' },
                },
            }));

            storeMocks = createStoreMocks();
            storeMocks.modules.popup.mutations[SHOW_POPUP].mockReset();
            storeMocks.store.state.profile.boosterCounter = 1;
            storeMocks.store.state.profile.hasSeenBooster = 1582909488; // 28.02.2020
            storeMocks.store.state.profile.exists = false;

            wrapper = wrapperFactory();

            expect(storeMocks.modules.popup.mutations[SHOW_POPUP]).not.toBeCalled();
        });

        test(
            'It should show the Boostermodal when there is no cv, Boostercount is < 3 and 7days have passed.',
            async () => {
                const clock = fakeTimers.install({ now: 1580663088 }); // 02.02.2020

                expect(storeMocks.modules.popup.mutations[SHOW_POPUP])
                    .toBeCalledWith(expect.any(Object), {
                        componentName: 'ModalCvBooster',
                    });

                clock.uninstall();
            },
        );

        test(
            'It should show the Boostermodal when there is no cv, Boostercount is >= 3 and 182days have passed.',
            async () => {
                const clock = fakeTimers.install({ now: 1564679088 }); // 01.08.2019

                storeMocks.store.state.profile.boosterCounter = 4;
                storeMocks.store.state.profile.hasSeenBooster = 1582909488; // 28.02.2020
                storeMocks.store.state.profile.exists = false;

                await wrapper.vm.$nextTick();

                expect(storeMocks.modules.popup.mutations[SHOW_POPUP])
                    .toBeCalledWith(expect.any(Object), {
                        componentName: 'ModalCvBooster',
                    });

                clock.uninstall();
            },
        );
    });

    describe('Travel readiness notice', () => {
        beforeEach(() => {
            storeMocks.store.state.profile.exists = true;
        });

        test('it should show travel readiness notice on first page visit', async () => {
            expect(wrapper.find('[data-qa="travel readiness change info"]').exists()).toBeTruthy();
        });

        test('it should set a date local storage entry', async () => {
            expect(new Date(localStorage.getItem(travelReadinessInfoBox.key)).getTime()).not.toBeNaN();
        });

        test('it should not update the entry if it already exists on repeated page visits', async () => {
            const date1 = `${new Date().getTime() - 42}`;
            localStorage.setItem(travelReadinessInfoBox.key, date1);

            wrapper = wrapperFactory();

            const date2 = localStorage.getItem(travelReadinessInfoBox.key);
            expect(date1).toBe(date2);
        });

        test('it should not show the item if the duration has passed', () => {
            // eslint-disable-next-line max-len
            localStorage.setItem(travelReadinessInfoBox.key, new Date().getTime() - travelReadinessInfoBox.duration * 2);
            wrapper = wrapperFactory();
            expect(wrapper.find('[data-qa="travel readiness change info"]').exists()).toBeFalsy();
        });
    });
});
