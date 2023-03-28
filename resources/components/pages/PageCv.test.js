import Vuex from 'vuex';

import {
    // eslint-disable-next-line import/named
    __createMocks as createStoreMocks,
} from '../../store';
import {
    localVue, mockRouter,
    mount,
} from '../../../tests/app/vue/utils';
import {
    SHOW_POPUP,
} from '../../store/mutation-types';
import {
    UPDATE_ACTIVE_STATUS,
} from '../../store/action-types';
import mitt from '../../utils/mitt';
import ProviderConsent from '../providers/ProviderConsent';

import PageCv from './PageCv';
import {
    travelReadinessInfoBox,
} from '../../data/time-gated-elements';

jest.mock('../../store');
jest.mock('../../store/modules/components/popup');

jest.mock('../../router', () => ({
    currentRoute: {
        name: 'page-cv',
    },
}));

jest.mock('../../services/cv-file', () => ({
    getTemplateSettings: () => ({
        data: {
            data: {
                attributes: {
                    template: 'vegan',
                    color: 'blu-gre',
                    font: 'not-not',
                    educationFirst: false,
                },
            },
        },

    }),
}));
jest.mock('../../services/soft-skills');
let wrapper;
let storeMocks;

localVue.use(Vuex);

const wrapperFactory = () => mount(PageCv, {
    localVue,
    store: storeMocks.store,
    mocks: {
        $route: { query: {} },
    },
});

beforeEach(() => {
    localStorage.clear();
    storeMocks = createStoreMocks();
    storeMocks.modules.popup.mutations[SHOW_POPUP].mockReset();
    storeMocks.modules.profile.actions[UPDATE_ACTIVE_STATUS].mockReset();
    storeMocks.store.state.profile.active = true;
    storeMocks.store.state.profile.completeness = 55;
    storeMocks.store.state.profile.origin = 'ONE_PAGER_WORK_MANUAL';
    storeMocks.store.state.profile.skill.rows = [];
    storeMocks.store.state.profile.language.rows = [];
    storeMocks.store.state.profile.interest.rows = [];

    wrapper = wrapperFactory();
});

describe('PageCv', () => {
    test('It should render a `<div>`.', () => {
        expect(wrapper.is('div')).toBe(true);
    });

    describe(('First activation'), () => {
        test('It should require a consent for first activation.', () => {
            const { requireConsent } = ProviderConsent.methods;
            ProviderConsent.methods.requireConsent = jest.fn();

            mockRouter.currentRoute.query = {
                'first-activation': 'karL',
            };
            wrapper = wrapperFactory();

            expect(ProviderConsent.methods.requireConsent).toBeCalled();

            ProviderConsent.methods.requireConsent = requireConsent;
        });

        test('It should not require a consent for first activation, if the completeness is to low.', () => {
            storeMocks.store.state.profile.completeness = 15;
            ProviderConsent.methods.requireConsent = jest.fn();

            mockRouter.currentRoute.query = {
                'first-activation': 'karL',
            };
            wrapper = wrapperFactory();

            expect(ProviderConsent.methods.requireConsent).not.toBeCalled();
        });

        test('It should save the visibility when a `consent-accepted` event with correct type is received.', () => {
            mitt.emit('consent-accepted', 'b2c_cv_activation');

            expect(storeMocks.modules.profile.actions[UPDATE_ACTIVE_STATUS])
                .toBeCalledWith(expect.anything(), true);
        });

        test('It shouldn\'t save the visibility when a `consent-accepted` event with wrong type is received.', () => {
            mitt.emit('consent-accepted', 'some_type');

            expect(storeMocks.modules.profile.actions[UPDATE_ACTIVE_STATUS]).not.toBeCalled();
        });
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
