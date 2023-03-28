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

import MinitaskTelephone from './MinitaskTelephone';
import * as formValidation from '../../../composables/form-validation';

jest.mock('../../../composables/form-validation');
jest.mock('../../../store');

let mockStore;
let wrapper;
const localVue = createLocalVue();

localVue.use(Vuex);

describe('MinitaskTelephone', () => {
    beforeEach(() => {
        // eslint-disable-next-line no-import-assign
        formValidation.useFormValidation = jest.fn(() => ({
            validate: jest.fn(() => true),
        }));
        profile.actions.UPDATE_PROFILE = jest.fn();

        mockStore = new Vuex.Store({
            mutations: {
                updateField,
            },
            modules: {
                profile,
            },
        });
        wrapper = mount(MinitaskTelephone, {
            localVue,
            store: mockStore,
            provide: {
                store: mockStore,
            },
        });
    });

    test('It should render a `<div>`.', () => {
        expect(wrapper.element.tagName).toBe('DIV');
    });

    test('It should emit a skip event when the skip-button is clicked.', async () => {
        wrapper.find('[data-qa="skip button"]').trigger('click');

        await nextTick();

        expect(wrapper.emitted().skipped).toBeDefined();
    });

    test('It should emit an update event when the save-button is clicked.', async () => {
        expect(wrapper.find('[data-qa="save button"][disabled]').exists()).toBe(true);

        wrapper.vm.dirty = true;
        await nextTick();

        expect(wrapper.find('[data-qa="save button"][disabled]').exists()).toBe(false);

        wrapper.find('[data-qa="save button"]').trigger('click');

        expect(wrapper.emitted().updated).toBeDefined();
    });

    test('It should disable the save button when the data is not valid.', async () => {
        expect(wrapper.find('[data-qa="save button"][disabled]').exists()).toBe(true);

        await nextTick();
        wrapper.find('[data-qa="save button"]').trigger('click');

        expect(wrapper.find('[data-qa="save button"][disabled]').exists()).toBe(true);
    });

    test('It should enable the save button when the data is valid.', async () => {
        expect(wrapper.find('[data-qa="save button"][disabled]').exists()).toBe(true);

        await nextTick();
        wrapper.vm.dirty = true;
        wrapper.find('[data-qa="save button"]').trigger('click');
        await nextTick();

        expect(wrapper.find('[data-qa="save button"][disabled]').exists()).toBe(false);
    });
});
