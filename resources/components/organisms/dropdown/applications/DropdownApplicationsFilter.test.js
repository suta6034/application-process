import Vuex from 'vuex';
import {
    createLocalVue,
} from '@vue/test-utils';
import {
    mount,
} from '../../../../../tests/app/vue/utils';

import {
    // eslint-disable-next-line import/named
    __createMocks as createStoreMocks,
} from '../../../../store';
import DropdownApplicationsFilter from './DropdownApplicationsFilter';

jest.mock('../../../../store');

let wrapper;
let storeMocks;
const localVue = createLocalVue();

localVue.use(Vuex);

beforeEach(() => {
    storeMocks = createStoreMocks();
    wrapper = mount(DropdownApplicationsFilter, {
        localVue,
        store: storeMocks.store,
    });
});

describe('DropdownApplicationsFilter', () => {
    test('It should render a `<div>`.', () => {
        expect(wrapper.is('div')).toBe(true);
    });

    test('It should set the sort to oldest first.', async () => {
        wrapper.find('[data-qa="sort old"] input').trigger('change');

        expect(wrapper.emitted('sortChange')).toEqual([['createDate']]);
    });

    test('It should set the sort to newest first.', async () => {
        wrapper.find('[data-qa="sort new"] input').trigger('change');

        expect(wrapper.emitted('sortChange')).toEqual([['-createDate']]);
    });
});
