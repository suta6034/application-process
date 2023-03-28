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

import CardCvProjects from './CardCvProjects';

jest.mock('../../../../store');
jest.mock('../../../../store/modules/profile');

const storeMocks = createStoreMocks();

let wrapper;
const localVue = createLocalVue();

localVue.use(Vuex);

storeMocks.store.state.profile.project.rows = [
    {
        id: 374,
        name: 'Foo Bar',
        submitted: false,
        end: '2013-06-01T02:00:00+02:00',
        start: '2013-01-01T01:00:00+01:00',
    },
    {
        id: 375,
        name: 'Foo Bar',
        submitted: false,
        end: '2013-06-01T02:00:00+02:00',
        start: '2013-01-01T01:00:00+01:00',
    },
    {
        id: 376,
        name: 'Foo Bar',
        submitted: false,
        end: '2013-06-01T02:00:00+02:00',
        start: '2013-01-01T01:00:00+01:00',
    },
    {
        id: 377,
        name: 'Foo Bar',
        submitted: false,
        end: '2013-06-01T02:00:00+02:00',
        start: '2013-01-01T01:00:00+01:00',
    },
];

beforeEach(() => {
    wrapper = mount(CardCvProjects, {
        localVue,
        store: storeMocks.store,
    });
});

describe('CardCvProjects', () => {
    test('It should render a `<div>`.', () => {
        expect(wrapper.is('div')).toBe(true);
    });

    test('It should display formatted start and end dates if available.', () => {
        expect(wrapper.find('[data-qa="project dates"]').text()).toContain('Jän 2013');
        expect(wrapper.find('[data-qa="project dates"]').text()).toContain('Jun 2013');
    });

    test('It should display a string alternative if no end date is available.', async () => {
        storeMocks.store.state.profile.project.rows[0].end = '';
        await wrapper.vm.$nextTick();

        expect(wrapper.find('[data-qa="project dates"]').text()).toContain('heute');
    });
});
