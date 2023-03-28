import Vuex from 'vuex';
import {
    updateField,
} from 'vuex-map-fields';
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
    profile,
} from '../../../store/modules/profile';

import MinitaskAddress from './MinitaskAddress';

jest.mock('../../../store');

let mockStore;
let wrapper;
const localVue = createLocalVue();

localVue.use(Vuex);

describe('MinitaskAddress', () => {
    beforeEach(() => {
        profile.actions.UPDATE_PROFILE = jest.fn();

        mockStore = new Vuex.Store({
            mutations: {
                updateField,
            },
            modules: {
                profile,
            },
        });
        wrapper = mount(MinitaskAddress, {
            localVue,
            store: mockStore,
        });
    });

    test('It should render a `<div>`.', () => {
        expect(wrapper.is('div')).toBe(true);
    });

    test('It should emit a skip event when the skip-button is clicked.', async () => {
        wrapper.find('[data-qa="skip button"]').trigger('click');

        await nextTick();

        expect(wrapper.emitted().skipped).toBeDefined();
    });

    test('It should emit a update event when the save-button is clicked.', async () => {
        expect(wrapper.contains('[data-qa="save button"][disabled]')).toBe(true);

        wrapper.vm.dirty = true;
        await nextTick();

        expect(wrapper.contains('[data-qa="save button"][disabled]')).toBe(false);

        wrapper.find('[data-qa="save button"]').trigger('click');

        expect(wrapper.emitted().updated).toBeDefined();
    });

    test('It should disable the save button when there was no data entered.', async () => {
        expect(wrapper.contains('[data-qa="save button"][disabled]')).toBe(true);

        wrapper.setData({ minitaskAddress: '' });
        await nextTick();
        wrapper.find('[data-qa="save button"]').trigger('click');

        expect(wrapper.contains('[data-qa="save button"][disabled]')).toBe(true);
    });

    test('It should disable the save button when the data is not valid.', async () => {
        expect(wrapper.contains('[data-qa="save button"][disabled]')).toBe(true);

        wrapper.vm.$validate = () => false;
        await nextTick();
        wrapper.find('[data-qa="save button"]').trigger('click');

        expect(wrapper.contains('[data-qa="save button"][disabled]')).toBe(true);
    });

    test('It should enable the save button when the data is valid.', async () => {
        expect(wrapper.contains('[data-qa="save button"][disabled]')).toBe(true);

        wrapper.vm.$validate = () => true;
        await nextTick();
        wrapper.vm.dirty = true;
        wrapper.find('[data-qa="save button"]').trigger('click');
        await nextTick();

        expect(wrapper.contains('[data-qa="save button"][disabled]')).toBe(false);
    });
});
