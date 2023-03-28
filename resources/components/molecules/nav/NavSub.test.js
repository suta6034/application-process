import fakeTimers from '@sinonjs/fake-timers';
import Vuex from 'vuex';
import {
    createLocalVue,
} from '@vue/test-utils';
import {
    nextTick,
} from 'vue';
import {
    mount,
} from '../../../../tests/app/vue/utils';
import {
    // eslint-disable-next-line import/named
    __createMocks as createStoreMocks,
} from '../../../store';

import NavSub from './NavSub';

jest.mock('../../../store');
jest.mock('../../../store/modules/notification');

let wrapper;
let storeMocks;
const localVue = createLocalVue();

localVue.use(Vuex);

const helpers = {
    scrollPositions: {
        end: 200,
        start: 0,
    },
    scrollDocumentTo(position) {
        window.scrollY = position;
        document.dispatchEvent(new Event('scroll'));
    },
    scrollListTo(position) {
        Object.defineProperty(wrapper.find('[data-qa="list"]').element, 'scrollWidth', { value: 300 });
        Object.defineProperty(wrapper.find('[data-qa="list"]').element, 'offsetWidth', { value: 100 });
        wrapper.find('[data-qa="list"]').element.scrollLeft = position;
        wrapper.find('[data-qa="list"]').trigger('scroll');
    },
};

beforeEach(() => {
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation(cb => cb());

    storeMocks = createStoreMocks();
    wrapper = mount(NavSub, {
        store: storeMocks.store,
    });
});

describe('NavSub', () => {
    test('It should render a `<div>`.', () => {
        expect(wrapper.element.tagName).toBe('NAV');
    });

    test('It should conditionally render notifications.', async () => {
        storeMocks.modules.notification.state.cv = true;
        storeMocks.modules.notification.state.messages = true;

        await wrapper.vm.$nextTick();

        expect(wrapper.contains('[data-qa="cv"]:nth-child(2) [data-qa="cv notification"]')).toBe(false);
        expect(wrapper.contains('[data-qa="stats"]:nth-child(3) [data-qa="stats notification"]')).toBe(true);
        expect(wrapper.contains('[data-qa="messages"]:nth-child(4) [data-qa="messages notification"]')).toBe(true);
    });

    test('It should show a shadow at the end.', async () => {
        await helpers.scrollListTo(helpers.scrollPositions.start);

        expect(wrapper.find('[data-qa="shadow end"]').isVisible()).toBe(true);
    });

    test('It shouldn\'t show a shadow at the end when scrolled to right.', async () => {
        await helpers.scrollListTo(helpers.scrollPositions.end);

        expect(wrapper.find('[data-qa="shadow end"]').isVisible()).toBe(false);
    });

    test('It should show a shadow at the start when scrolled to right.', async () => {
        await helpers.scrollListTo(helpers.scrollPositions.end);

        expect(wrapper.find('[data-qa="shadow start"]').isVisible()).toBe(true);
    });

    test('It shouldn\'t show a shadow at the start when scrolled to left.', () => {
        helpers.scrollListTo(helpers.scrollPositions.start);

        expect(wrapper.find('[data-qa="shadow start"]').isVisible()).toBe(false);
    });

    test('It should scroll to the currently active link.', () => {
        wrapper.find('[data-qa="link"]').element.classList.add('is-active');
        wrapper.vm.$children[0].scrollToActiveLink();

        expect(wrapper.find('[data-qa="list"]').element.scrollLeft).toBe(0);
    });

    test('It should be sticky when scrolling up.', async () => {
        const clock = fakeTimers.install({ now: 1000, toFake: ['Date'] });

        helpers.scrollDocumentTo(0);
        clock.tick(500);
        helpers.scrollDocumentTo(helpers.scrollPositions.end);
        helpers.scrollDocumentTo(80);

        await nextTick();

        expect(wrapper.contains('.is-sticky-visible')).toBe(true);

        clock.uninstall();
    });

    test('It shouldn\'t be sticky when scrolling down.', async () => {
        helpers.scrollDocumentTo(helpers.scrollPositions.end);

        await wrapper.vm.$nextTick();

        expect(wrapper.contains('.is-sticky-visible')).toBe(false);
    });
});
