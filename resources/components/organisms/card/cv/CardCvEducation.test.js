import Vuex from 'vuex';
import {
    createLocalVue,
} from '@vue/test-utils';

import {
    // eslint-disable-next-line import/named
    __createMocks as createStoreMocks,
} from '../../../../store/index';
import {
    mount,
} from '../../../../../tests/app/vue/utils';

import CardCvEducation from './CardCvEducation';

jest.mock('../../../../store');

let wrapper;
let storeMocks;
const localVue = createLocalVue();

localVue.use(Vuex);

beforeEach(() => {
    storeMocks = createStoreMocks();

    storeMocks.store.state.profile.education.rows = [
        {
            focus: 'Foo foo',
            name: 'Foo',
            id: 1,
        },
    ];

    wrapper = mount(CardCvEducation, {
        localVue,
        store: storeMocks.store,
    });
});

describe('CardCvEducation', () => {
    test('It should render a `<div>`.', () => {
        expect(wrapper.is('div')).toBe(true);
    });

    describe('Date rendering', () => {
        test('It should display formatted start and end dates if available.', async () => {
            storeMocks.store.state.profile.education.rows = [
                {
                    end: '2015-02-01T00:00:00+01:00',
                    focus: 'Foo foo',
                    id: 1,
                    name: 'Foo',
                    start: '2014-02-01T00:00:00+01:00',
                },
            ];
            await wrapper.vm.$nextTick();

            expect(wrapper.find('[data-qa="education dates"]').text()).toContain('Feb 2014');
            expect(wrapper.find('[data-qa="education dates"]').text()).toContain('Feb 2015');
        });

        test('It should display a string alternative if no end date is available.', async () => {
            storeMocks.store.state.profile.education.rows[0].end = '';
            await wrapper.vm.$nextTick();

            expect(wrapper.find('[data-qa="education dates"]').text()).toContain('heute');
        });
    });

    test('It should display the training company as subheadline if a training company is available.', async () => {
        storeMocks.store.state.profile.education.rows = [{
            focus: 'Blap',
            id: 3,
            name: 'Blub',
            submitted: false,
            trainingCompany: 'Blop',
        }];

        await wrapper.vm.$nextTick();

        expect(wrapper.find('[data-qa="subheadline"]').text()).toBe('Blop');
    });

    test('It should display the education name as headline if no focus is available.', async () => {
        storeMocks.store.state.profile.education.rows = [{
            focus: '',
            name: 'Foo',
            id: 1,
        }];

        await wrapper.vm.$nextTick();

        expect(wrapper.find('[data-qa="headline"]').text()).toBe('Foo');
    });

    test('It shouldn\'t display a subheadline if no focus is available.', async () => {
        storeMocks.store.state.profile.education.rows = [{
            focus: '',
            name: 'Foo',
            id: 1,
        }];
        await wrapper.vm.$nextTick();

        expect(wrapper.contains('[data-qa="subheadline"]')).toBe(false);
    });
});
