import Vuex from 'vuex';
import Router from 'vue-router';
import flushPromises from 'flush-promises';
import {
    createLocalVue,
    shallowMount,
} from '@vue/test-utils';

import {
    // eslint-disable-next-line import/named
    __createMocks as createStoreMocks,
} from '../../store';
import {
    commitAndShowModal,
} from '../../utils/error';
import {
    HIDE_POPUP,
    SHOW_POPUP,
} from '../../store/mutation-types';
import * as gdpr from '../../services/gdpr';

import ProviderConsent from './ProviderConsent';

jest.mock('../../store');
jest.mock('../../store/modules/components/popup');
jest.mock('../../utils/error');

let storeMocks;
const localVue = createLocalVue();

const router = new Router({
    routes: [
        {
            path: '/foo-bar',
            name: 'foo-bar',
        },
    ],
    mode: 'history',
});

localVue.use(Vuex);
localVue.use(Router);

function wrapperFactory(propsData) {
    storeMocks = createStoreMocks();
    storeMocks.modules.popup.mutations[HIDE_POPUP].mockReset();
    storeMocks.modules.popup.mutations[SHOW_POPUP].mockReset();
    commitAndShowModal.mockReset();

    return shallowMount(ProviderConsent, {
        localVue,
        router,
        store: storeMocks.store,
        propsData: {
            type: 'foo',
            ...propsData,
        },
        scopedSlots: {
            default: '<div slot-scope="{}"></div>',
        },
    });
}

beforeEach(() => {
    // eslint-disable-next-line no-import-assign
    gdpr.check = jest.fn().mockResolvedValue({ data: { meta: { status: 'consent found' } } });
    // eslint-disable-next-line no-import-assign
    gdpr.info = jest.fn().mockResolvedValue({
        data: {
            data: {
                attributes: {
                    dataCategory: 'foo',
                    generalInfo: 'foo',
                    purpose: 'foo',
                },
            },
        },
    });
});

describe('ProviderConsent', () => {
    test('It should render a `<div>`.', () => {
        const wrapper = wrapperFactory();

        expect(wrapper.is('div')).toBe(true);
    });

    test('It should check the consent immediately if the `immediate` prop is given.', () => {
        wrapperFactory({ immediate: true });

        expect(gdpr.check).toBeCalled();
    });

    describe('requiring the consent', () => {
        test('It should start showing the progress popup.', () => {
            const wrapper = wrapperFactory();
            wrapper.vm.requireConsent();

            expect(storeMocks.modules.popup.mutations[SHOW_POPUP])
                .toBeCalledWith(expect.any(Object), {
                    componentName: 'ProgressPopup',
                    type: 'progress',
                });
        });

        test('It should check the consent status.', () => {
            const wrapper = wrapperFactory();
            wrapper.vm.requireConsent();

            expect(gdpr.check).toBeCalledWith('foo');
        });

        test('It should hide the progress popup after fetching the positive consent status.', async () => {
            const wrapper = wrapperFactory();
            wrapper.vm.requireConsent();

            // Wait for API request.
            await wrapper.vm.$nextTick();
            await wrapper.vm.$nextTick();

            expect(storeMocks.modules.popup.mutations[HIDE_POPUP]).toBeCalled();
        });

        test('It should open an error modal if the GDPR check API request is not successful.', async () => {
            gdpr.check.mockRejectedValue({ response: { status: 500 } });
            const wrapper = wrapperFactory();
            wrapper.vm.requireConsent();

            // Wait for API request.
            await flushPromises();

            expect(commitAndShowModal).toBeCalled();
        });

        test('It should fetch the GDPR info if the user has no consent.', async () => {
            gdpr.check.mockRejectedValue({ response: { status: 404 } });
            const wrapper = wrapperFactory();
            wrapper.vm.requireConsent();

            // // Wait for API request.
            await wrapper.vm.$nextTick();
            await wrapper.vm.$nextTick();

            expect(gdpr.info).toBeCalledWith('foo');
        });

        test('It should hide the progress popup after fetching the GDPR info.', async () => {
            gdpr.check.mockRejectedValue({ response: { status: 404 } });
            const wrapper = wrapperFactory();
            wrapper.vm.requireConsent();

            // Wait for API requests.
            await wrapper.vm.$nextTick();
            await wrapper.vm.$nextTick();
            await wrapper.vm.$nextTick();
            await wrapper.vm.$nextTick();

            expect(storeMocks.modules.popup.mutations[HIDE_POPUP]).toBeCalled();
        });

        test('It should show the GDPR modal after the GDPR info was fetched.', async () => {
            gdpr.check.mockRejectedValue({ response: { status: 404 } });
            const wrapper = wrapperFactory();
            wrapper.vm.requireConsent();

            // Wait for API requests.
            await wrapper.vm.$nextTick();
            await wrapper.vm.$nextTick();
            await wrapper.vm.$nextTick();
            await wrapper.vm.$nextTick();
            // Wait for re-rendering after hiding the popup.
            await wrapper.vm.$nextTick();

            expect(storeMocks.modules.popup.mutations[SHOW_POPUP])
                .toBeCalledWith(expect.any(Object), {
                    ariaLabel: expect.any(String),
                    componentName: 'ModalGdpr',
                    componentProps: expect.any(Object),
                    type: 'modal',
                    showCloseButton: false,
                });
        });

        test('It should open an error modal if the GDPR info API request is not successful.', async () => {
            gdpr.check.mockRejectedValue({ response: { status: 404 } });
            gdpr.info.mockRejectedValue({ response: { status: 500 } });
            const wrapper = wrapperFactory();
            wrapper.vm.requireConsent();

            // Wait for API requests.
            await flushPromises();

            expect(commitAndShowModal).toBeCalled();
        });
    });
});
