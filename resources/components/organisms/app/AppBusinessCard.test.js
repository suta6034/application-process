import fakeTimers from '@sinonjs/fake-timers';
import Vuex from 'vuex';
import {
    createLocalVue,
} from '@vue/test-utils';

import {
    // eslint-disable-next-line import/named
    __createMocks as createStoreMocks,
} from '../../../store';
import {
    mount,
} from '../../../../tests/app/vue/utils';

import AppBusinessCard from './AppBusinessCard';

jest.mock('../../../store');

describe('AppBusinessCard', () => {
    let wrapper;
    let storeMocks;
    const localVue = createLocalVue();

    localVue.use(Vuex);

    beforeEach(() => {
        storeMocks = createStoreMocks();
        storeMocks.modules.profile.state.exists = true;
        storeMocks.store.state.profile.work.rows = [
            {
                company: {
                    label: 'Qux',
                    id: 1,
                },
                id: 1,
                submitted: false,
                title: 'Foo',
                start: '2019-05-01T02:00:00+02:00',
                end: null,
            },
        ];
        storeMocks.store.state.profile.education.rows = [
            {
                focus: 'Foo foo',
                name: 'Bar Qux',
                id: 1,
                submitted: false,
            },
        ];

        wrapper = mount(AppBusinessCard, {
            localVue,
            store: storeMocks.store,
        });
    });

    test('It should render a `<div>`.', () => {
        expect(wrapper.is('div')).toBe(true);
    });

    test('It should render the completeness area.', () => {
        expect(wrapper.contains('[data-qa="completeness area"]')).toBe(true);
    });

    test('It should render the visibility badge.', () => {
        expect(wrapper.contains('[data-qa="visibility badge"]')).toBe(true);
    });

    test('It should display the current position.', () => {
        expect(wrapper.find('[data-qa="position"]').text()).toBe('Foo');
        expect(wrapper.find('[data-qa="company"]').text()).toBe('bei Qux');
    });

    test('It should not display the current position or the institute.', async () => {
        storeMocks.store.state.profile.work.rows = [
            {
                company: {
                    label: 'Qux',
                    id: 1,
                },
                id: 1,
                submitted: false,
                title: 'Foo',
            },
        ];

        await wrapper.vm.$nextTick();

        expect(wrapper.contains('[data-qa="position"]')).toBe(false);
    });

    test('It should display the current position if it is the same month and year.', () => {
        const clock = fakeTimers.install({ now: 1487076708000 }); // 14.02.2017

        storeMocks.store.state.profile.work.rows = [
            {
                company: {
                    label: 'Qux',
                    id: 1,
                },
                id: 1,
                submitted: false,
                title: 'Foo',
                start: '2016-05-01T02:00:00+02:00',
                end: '2017-02-01T02:00:00+02:00',
            },
        ];

        expect(wrapper.find('[data-qa="position"]').text()).toBe('Foo');
        expect(wrapper.find('[data-qa="company"]').text()).toBe('bei Qux');

        clock.uninstall();
    });

    test('It should display the institution, if no work experience is given.', async () => {
        storeMocks.store.state.profile.work.rows = [];
        storeMocks.store.state.profile.education.rows = [
            {
                focus: 'Foo foo',
                name: 'Bar Qux',
                id: 1,
                submitted: false,
            },
        ];

        await wrapper.vm.$nextTick();

        expect(wrapper.find('[data-qa="subinfo"]').text()).toBe('Bar Qux');
    });

    test('It should display the focus, if no education name is given.', async () => {
        storeMocks.store.state.profile.work.rows = [];
        storeMocks.store.state.profile.education.rows = [
            {
                focus: 'Foo foo',
                id: 2,
                submitted: false,
            },
        ];

        await wrapper.vm.$nextTick();

        expect(wrapper.find('[data-qa="subinfo"]').text()).toBe('Foo foo');
    });

    test('It should display the empty state, if no profile exists', async () => {
        storeMocks.modules.profile.state.exists = false;

        await wrapper.vm.$nextTick();

        expect(wrapper.contains('[data-qa="empty state"]')).toBe(true);
    });
});
