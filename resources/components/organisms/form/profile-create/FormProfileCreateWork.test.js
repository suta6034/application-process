import Vuex from 'vuex';

import {
    nextTick,
} from 'vue';
import FormProfileCreateWork from './FormProfileCreateWork';
import {
    localVue,
    mount,
} from '../../../../../tests/app/vue/utils';
import store from '../../../../store';
import {
    DEFAULT_ROW,
} from '../../../../store/modules/forms/work';

jest.mock('../../../../store');
jest.mock('../../../../services/autocomplete');
jest.mock('../../../../utils/validators', () => ({
    ...jest.requireActual('../../../../utils/validators'),
    workDataMissing: jest.fn(() => [['start', 'title'], []]),
}));

let wrapper;

localVue.use(Vuex);

beforeEach(() => {
    store.state.profileCreate.work.rows = [
        {
            ...DEFAULT_ROW,
            title: 'Foo',
            id: 1,
        }, {
            title: 'far',
        }, {
            title: 'bar',
        },
    ];
    store.state.profileCreate.forceValidation = { key: '', time: 0 };

    wrapper = mount(FormProfileCreateWork, {
        localVue,
        store,
        mocks: {
            $t: jest.fn(),
            $randomFieldId: jest.fn(),
        },
    });
});

describe('FormProfileCreateWork', () => {
    test('It should render a `<div>`.', () => {
        expect(wrapper.is('div')).toBe(true);
    });

    test('It should reset the end date, if a user clicks on the checkbox.', async () => {
        store.state.profileCreate.work.rows[0].end = '0000-01-10T00:00:00+00:00';
        wrapper.find('[data-qa="current checkbox"]').trigger('click');

        // Wait for update of date field value.
        await nextTick();

        expect(wrapper.vm.end).toBe(null);
        expect(wrapper.vm.current).toBe(true);
    });

    test('It should provide the category `Berufserfahrung` as default', async () => {
        expect(wrapper.find('.k-c-pill--active').element.innerHTML).toContain('Berufserfahrung');
    });

    test('It should have 5 selectable category pills', async () => {
        const categorySelect = wrapper.find('[data-qa="work category select"]');

        expect(categorySelect.exists()).toBe(true);
        expect(categorySelect.findAll('[data-qa="pill"]').length).toBe(5);
    });
});
