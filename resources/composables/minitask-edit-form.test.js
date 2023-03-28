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
    shallowMount,
} from '../../tests/app/vue/utils';
import {
    profile,
} from '../store/modules/profile';

import MockComponent from '../components/__mocks__/MinitaskEditForm';
import store from '../store';

jest.mock('../store');

let mockStore;
let wrapper;
const localVue = createLocalVue();

localVue.use(Vuex);

const helpers = {
    enterValue(value) {
        wrapper.find('[data-qa="field"]').element.value = value;
        // Simulate model change.
        wrapper.setData({ field: value });
        wrapper.find('[data-qa="field"]').trigger('input');
    },
};

describe('minitaskEditForm', () => {
    beforeEach(() => {
        profile.actions.UPDATE_PROFILE = jest.fn().mockReturnValue(true);

        mockStore = new Vuex.Store({
            mutations: {
                updateField,
            },
            modules: {
                profile,
            },
        });

        store.dispatch = jest.fn().mockReturnValue(true);
        wrapper = shallowMount(MockComponent, {
            localVue,
            store: mockStore,
        });
    });

    test('It should be an object.', () => {
        expect(typeof wrapper).toBe('object');
    });

    test('It should activate the save button when the form is dirty.', async () => {
        helpers.enterValue('Foo');

        // Waiting for validator.
        await wrapper.vm.$nextTick();
        // Waiting for rendering.
        await wrapper.vm.$nextTick();

        expect(wrapper.contains('[data-qa="save button"][disabled]')).toBe(false);
    });

    test('It should save the profile when clicking the save button.', async () => {
        helpers.enterValue('Foo');
        await nextTick();
        wrapper.find('[data-qa="save button"]').trigger('click');

        // Wait for values to update.
        await nextTick();

        expect(JSON.stringify(store.dispatch.mock.calls)).toContain('profile/UPDATE_PROFILE');
    });
});
