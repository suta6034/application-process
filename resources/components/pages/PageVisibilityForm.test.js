import Vuex from 'vuex';
import {
    createLocalVue,
} from '@vue/test-utils';
import flushPromises from 'flush-promises';
import {
    nextTick,
} from 'vue';
import {
    // eslint-disable-next-line import/named
    __createMocks as createStoreMocks,
} from '../../store';
import {
    mount,
} from '../../../tests/app/vue/utils';
import * as gdpr from '../../services/gdpr';
import mitt from '../../utils/mitt';

import FormSwitch from '../molecules/form/FormSwitch';
import PageVisibilityForm from './PageVisibilityForm';
import ProviderConsent from '../providers/ProviderConsent';

jest.mock('../../store');
jest.mock('../../store/modules/components/popup');
jest.mock('../../utils/error');

let storeMocks;
let wrapper;
const localVue = createLocalVue();

localVue.use(Vuex);

const mockRouter = {
    push: jest.fn(),
};

function wrapperFactory(mockCanBeActivated = true) {
    return mount(PageVisibilityForm, {
        localVue,
        store: storeMocks.store,
        mocks: {
            $router: mockRouter,
            $t: jest.fn(),
        },
        stubs: {
            AppButton: '<button @click="$emit(\'click\')"/>',
            FormSwitch,
            LayoutFullscreen: '<div><slot/></div>',
            LayoutForm: '<div><slot/><slot name="actions"/></div>',
            ProviderConsent,
        },
        computed: {
            canBeActivated: () => mockCanBeActivated,
        },
    });
}

beforeEach(() => {
    storeMocks = createStoreMocks();
    storeMocks.store.state.profile.active = true;
    storeMocks.store.state.profile.completeness = 60;

    // eslint-disable-next-line no-import-assign
    gdpr.check = jest.fn().mockResolvedValue({ data: { meta: { status: 'consent found' } } });

    wrapper = wrapperFactory();
});

describe('PageVisibilityForm', () => {
    test('It should render a `<div>`.', () => {
        expect(wrapper.element.tagName).toBe('DIV');
    });

    test('It should render a visibility switch.', () => {
        expect(wrapper.contains('[data-qa="visibility switch"]')).toBe(true);
    });

    test('It should display the visibility status in an info text.', async () => {
        expect(wrapper.find('[data-qa="visibility info active"]').isVisible()).toBe(true);
        expect(wrapper.find('[data-qa="visibility info inactive"]').isVisible()).toBe(false);
        storeMocks.store.state.profile.active = false;
        await wrapper.vm.$nextTick();
        expect(wrapper.find('[data-qa="visibility info active"]').isVisible()).toBe(false);
        expect(wrapper.find('[data-qa="visibility info inactive"]').isVisible()).toBe(true);
    });

    test('It should display the info how the user can be activated.', async () => {
        storeMocks.store.state.profile.completeness = 40;
        wrapper = wrapperFactory();
        await nextTick();
        await nextTick();
        expect(wrapper.find('[data-qa="min completeness"]').text()).toBe('50%');
    });

    describe('make the profile visible', () => {
        test('It should require a consent if the profile isn\'t active.', () => {
            const { requireConsent } = ProviderConsent.methods;
            ProviderConsent.methods.requireConsent = jest.fn();

            storeMocks.store.state.profile.active = true;
            wrapper = wrapperFactory();
            wrapper.find('[data-qa="visibility switch"]').find('[data-qa="radio 2"]').trigger('click');

            expect(ProviderConsent.methods.requireConsent).not.toBeCalled();

            storeMocks.store.state.profile.active = false;
            wrapper.find('[data-qa="visibility switch"]').find('[data-qa="radio 1"]').trigger('click');

            expect(ProviderConsent.methods.requireConsent).toBeCalled();

            ProviderConsent.methods.requireConsent = requireConsent;
        });

        test('It should set the visibility if the user has a consent.', async () => {
            storeMocks.store.state.profile.active = false;
            wrapper.find('[data-qa="visibility switch"]').find('[data-qa="radio 1"]').trigger('click');

            // Wait for API requests.
            await flushPromises();

            expect(wrapper.find('[data-qa="radio 1"]').contains('is-active'));
        });

        test('It shouldn\'t activate it when a `consent-accepted` event with wrong type is received.', () => {
            storeMocks.store.state.profile.active = false;
            mitt.emit('consent-accepted', 'some_type');

            expect(storeMocks.store.state.profile.active).toBe(false);
        });
    });
});
