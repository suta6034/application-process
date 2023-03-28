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

import MinitaskJobField from './MinitaskJobField';
import * as formValidation from '../../../composables/form-validation';

jest.mock('../../../composables/form-validation');
jest.mock('../../../store');

let mockStore;
let wrapper;
const localVue = createLocalVue();

localVue.use(Vuex);

describe('MinitaskJobField', () => {
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
        wrapper = mount(MinitaskJobField, {
            localVue,
            store: mockStore,
            mocks: {
                $randomFieldId: jest.fn(),
            },
        });
    });

    test('It should render a `<div>`.', () => {
        expect(wrapper.is('div')).toBe(true);
    });

    test('It should emit a skip event when the skip-button is clicked.', () => {
        wrapper.find('[data-qa="skip button"]').trigger('click');
        expect(wrapper.emitted().skipped).toBeDefined();
    });

    test('It should emit an update event when the save-button is clicked.', async () => {
        expect(wrapper.contains('[data-qa="save button"][disabled]')).toBe(true);

        wrapper.vm.dirty = true;
        wrapper.vm.validate = () => true;
        await nextTick();

        expect(wrapper.contains('[data-qa="save button"][disabled]')).toBe(false);

        wrapper.find('[data-qa="save button"]').trigger('click');

        await nextTick();

        expect(wrapper.emitted().updated).toBeDefined();
    });
});
