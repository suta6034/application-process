import Vuex from 'vuex';
import {
    updateField,
} from 'vuex-map-fields';
import {
    nextTick,
} from 'vue';
import {
    createLocalVue,
} from '@vue/test-utils';
import * as formValidation from '../../../composables/form-validation';

import {
    mount,
} from '../../../../tests/app/vue/utils';
import {
    profile,
} from '../../../store/modules/profile';

import MinitaskBirthdate from './MinitaskBirthdate';

jest.mock('../../../composables/form-validation');
jest.mock('../../../store');

let mockStore;
let wrapper;
const localVue = createLocalVue();

localVue.use(Vuex);

const helpers = {
    setValue(value) {
        const dateInput = wrapper.find('[data-qa="year field"]');
        dateInput.element.value = value;
        dateInput.trigger('input');
    },
};

describe('MinitaskBirthdate', () => {
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
        wrapper = mount(MinitaskBirthdate, {
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

    test('It should emit an update event when the save-button is clicked.', async () => {
        expect(wrapper.contains('[data-qa="save button"][disabled]')).toBe(true);

        wrapper.vm.dirty = true;
        wrapper.vm.validate = () => true;
        await nextTick();

        expect(wrapper.contains('[data-qa="save button"][disabled]')).toBe(false);

        wrapper.find('[data-qa="save button"]').trigger('click');

        expect(wrapper.emitted().updated).toBeDefined();
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

    test('It should enable the save button when the year field is completely filled and valid.', async () => {
        expect(wrapper.contains('[data-qa="save button"][disabled]')).toBe(true);

        helpers.setValue('1999');
        await nextTick();
        wrapper.vm.lastField();

        expect(wrapper.contains('[data-qa="save button"][disabled]')).toBe(false);
    });
});
