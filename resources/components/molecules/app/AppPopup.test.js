import Vue from 'vue';
import Vuex from 'vuex';
import {
    createLocalVue,
    shallowMount,
} from '@vue/test-utils';

import AppPopup from './AppPopup';
import FooBar from '../../__mocks__/FooBar';

import {
    // eslint-disable-next-line import/named
    __createMocks as createStoreMocks,
} from '../../../store';

jest.mock('../../../polyfills/inert', () => () => {});
jest.mock('../../../store');
jest.mock('../../../router');
jest.mock('../../../store/modules/components/popup');

const routerBeforeEachMock = jest.fn();

let wrapper;
let storeMocks;
const localVue = createLocalVue();

localVue.use(Vuex);

global.scrollTo = jest.fn();

beforeEach(() => {
    storeMocks = createStoreMocks();
    storeMocks.modules.popup.mutations.HIDE_POPUP.mockReset();
    storeMocks.modules.popup.state.componentName = 'PopupStub';

    delete Vue.options.components.PopupStub;

    wrapper = shallowMount(AppPopup, {
        localVue,
        store: storeMocks.store,
        stubs: {
            PopupStub: '<div>Popup Component</div>',
        },
        provide: {
            router: {
                beforeEach: routerBeforeEachMock,
            },
        },
    });
});

describe('AppPopup', () => {
    test('It should render a `<div>`.', () => {
        expect(wrapper.is('div')).toBe(true);
    });

    test('It should disable the scrolling in the background when opened.', () => {
        wrapper.vm.disableScrolling.call(wrapper.vm, true, false);
        expect(document.body.style.overflow).toBe('hidden');
    });

    test('It should enable the scrolling in the background again when closed.', () => {
        wrapper.vm.disableScrolling.call(wrapper.vm, true, false);
        expect(document.body.style.overflow).toBe('hidden');
        wrapper.vm.disableScrolling.call(wrapper.vm, false, true);
        expect(document.body.style.overflow).toBe('');
    });

    test('It should close the modal when the user presses the escape key.', () => {
        storeMocks.modules.popup.state.active = true;
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

        expect(storeMocks.modules.popup.mutations.HIDE_POPUP).toBeCalled();
    });

    test('It should remove the keydown event listener when destroyed.', () => {
        const originalRemoveEventListener = document.removeEventListener;
        document.removeEventListener = jest.fn();
        wrapper.destroy();

        expect(document.removeEventListener).toBeCalledWith('keydown', expect.any(Function));

        document.removeEventListener = originalRemoveEventListener;
    });

    test('It should reset the focus when closed.', () => {
        const previousActiveElementMock = {
            focus: jest.fn(),
        };
        wrapper.setData({
            previousActiveElement: previousActiveElementMock,
        });
        wrapper.vm.resetFocus();

        expect(previousActiveElementMock.focus).toHaveBeenCalled();
    });

    test('It should set the focus on the given element, when the popup is closed.', () => {
        const previousActiveElementMock = {
            focus: jest.fn(),
        };

        storeMocks.modules.popup.state.active = true;
        storeMocks.modules.popup.state.focusElementSelector = '#email';

        wrapper.setData({
            previousActiveElement: previousActiveElementMock,
        });

        wrapper.vm.resetFocus();

        expect(previousActiveElementMock.focus).toHaveBeenCalled();
    });

    test('It should set all siblings inert when opened.', async () => {
        const Parent = {
            template: `
                <div>
                    <app-popup></app-popup>
                    <foo-bar></foo-bar>
                </div>
            `,
        };
        const parentWrapper = shallowMount(Parent, {
            localVue,
            store: storeMocks.store,
            mocks: {
                $router: { beforeEach: routerBeforeEachMock },
            },
            stubs: {
                AppPopup,
                FooBar,
                PopupStub: '<div>Popup Component</div>',
            },
            provide: {
                router: {
                    beforeEach: routerBeforeEachMock,
                },
            },
        });

        storeMocks.modules.popup.state.active = true;
        await wrapper.vm.$nextTick();

        expect(parentWrapper.find(FooBar).element.inert).toBe(true);
    });

    test('It should be hidden after navigating to a new route.', () => {
        expect(routerBeforeEachMock).toHaveBeenCalled();

        storeMocks.modules.popup.state.active = true;
        const nextMock = jest.fn();
        wrapper.vm.beforeRouteChange({ meta: {} }, { meta: {} }, nextMock);

        expect(storeMocks.modules.popup.mutations.HIDE_POPUP).toBeCalled();
        expect(nextMock).toHaveBeenCalled();
    });

    test('It should not be hidden after navigating to a new route if the route marks popups as persistent.', () => {
        expect(routerBeforeEachMock).toHaveBeenCalled();

        storeMocks.modules.popup.state.active = true;
        const nextMock = jest.fn();
        wrapper.vm.beforeRouteChange(null, { meta: { popup: 'persistOnRouteChange' } }, nextMock);

        expect(storeMocks.modules.popup.mutations.HIDE_POPUP).not.toBeCalled();
        expect(nextMock).toHaveBeenCalled();
    });
});
