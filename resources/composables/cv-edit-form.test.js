import Vuex from 'vuex';
import flushPromises from 'flush-promises';
import {
    createLocalVue,
    mount,
} from '@vue/test-utils';
import store from '../store';
import mitt from '../utils/mitt';
import MockComponent from '../components/__mocks__/CvEditForm';
import {
    useCvEditForm,
} from './cv-edit-form';
import {
    showToast,
} from '../utils/toast';

const mockValidate = jest.fn().mockReturnValue(true);
jest.mock('../store');
jest.mock('../utils/toast');
jest.mock('./form-validation', () => ({
    useFormValidation() {
        return {
            validate: mockValidate,
        };
    },
}));

let mockRouter;
let wrapper;
const localVue = createLocalVue();

localVue.use(Vuex);

beforeEach(() => {
    mockRouter = {
        push: jest.fn(),
    };
    wrapper = mount(MockComponent, {
        localVue,
        store,
        mocks: {
            $router: mockRouter,
            $t: () => {},
        },
        propsData: {
            standalone: true,
        },
        provide: {
            router: mockRouter,
        },
    });
});

const helpers = {
    enterValue(value) {
        wrapper.find('[data-qa="field"]').element.value = value;
        // Simulate model change.
        wrapper.setData({ field: value });
        wrapper.find('[data-qa="field"]').trigger('input');
        wrapper.find('[data-qa="field"]').trigger('blur');
    },
};

describe('cvEditForm', () => {
    test('It should be a function.', () => {
        expect(typeof useCvEditForm).toBe('function');
    });

    test('It should mark the form as submitted when the form was submitted.', async () => {
        helpers.enterValue('Foo');

        // Waiting for validator.
        await wrapper.vm.$nextTick();
        // Waiting for rendering.
        await wrapper.vm.$nextTick();

        wrapper.find('[data-qa="save button"]').trigger('click');

        // Wait for values to update.
        await wrapper.vm.$nextTick();

        expect(wrapper.vm.submitted).toBe(true);
    });

    test('It should display a disabled save button by default.', () => {
        expect(wrapper.contains('[data-qa="save button"][disabled]')).toBe(true);
    });

    test('It should activate the save button when the form is dirty.', async () => {
        helpers.enterValue('Foo');

        // Waiting for validator.
        await wrapper.vm.$nextTick();
        // Waiting for rendering.
        await wrapper.vm.$nextTick();

        expect(wrapper.contains('[data-qa="save button"][disabled]')).toBe(false);
    });

    test('It should trigger validation when clicking the save button.', async () => {
        helpers.enterValue('Foo');

        // Waiting for validator.
        await wrapper.vm.$nextTick();
        // Waiting for rendering.
        await wrapper.vm.$nextTick();

        wrapper.find('[data-qa="save button"]').trigger('click');

        // Wait for values to update.
        await wrapper.vm.$nextTick();

        expect(mockValidate).toHaveBeenCalled();
    });

    test('It should save the profile when clicking the save button.', async () => {
        store.dispatch = jest.fn();
        helpers.enterValue('Foo');
        await wrapper.vm.$nextTick();

        wrapper.find('[data-qa="save button"]').trigger('click');

        // Wait for values to update.
        await wrapper.vm.$nextTick();

        expect(store.dispatch).toHaveBeenCalledWith('profile/UPDATE_PROFILE', undefined);
    });

    test('It shouldn\'t save data when the form is not valid.', async () => {
        store.dispatch = jest.fn();
        helpers.enterValue('');
        await wrapper.vm.$nextTick();
        wrapper.find('[data-qa="save button"]').trigger('click');

        expect(store.dispatch).not.toHaveBeenCalled();
    });

    test('It should redirect to the list view route when clicking the save button.', async () => {
        helpers.enterValue('Foo');
        await wrapper.vm.$nextTick();
        wrapper.find('[data-qa="save button"]').trigger('click');

        // Wait for values to update.
        await flushPromises();

        expect(mockRouter.push).toBeCalledWith({ name: 'page-cv' });
    });

    test('It should trigger a toast notification when clicking the save button.', async () => {
        store.commit = jest.fn();
        helpers.enterValue('Foo');
        await wrapper.vm.$nextTick();
        wrapper.find('[data-qa="save button"]').trigger('click');

        // Wait for values to update.
        await flushPromises();

        expect(showToast).toHaveBeenCalledWith({
            text: 'Deine Daten wurden aktualisiert',
        });
    });

    test('It should redirect the user after resetting the form.', async () => {
        mitt.emit('reset-form-data');

        await flushPromises();

        expect(mockRouter.push).toBeCalledWith({ name: 'page-cv' });
    });

    test('It should emit a closeEdit event when clicking the cancel button.', () => {
        wrapper.find('[data-qa="cancel button"]').trigger('click');

        expect(wrapper.emitted().closeEdit).toBeDefined();
    });

    test('It should show the unsaved changes modal when clicking the cancel button while a form is dirty.', () => {
        store.commit = jest.fn();
        helpers.enterValue('Foo');
        wrapper.find('[data-qa="cancel button"]').trigger('click');

        expect(store.commit).toBeCalledWith('popup/SHOW_POPUP', {
            ariaLabel: expect.any(String),
            componentName: 'ModalUnsavedChanges',
        });
    });

    // eslint-disable-next-line max-len
    test('It should show the incomplete data modal when clicking the cancel button while a form is dirty and invalid.', () => {
        store.commit = jest.fn();
        helpers.enterValue('');
        wrapper.find('[data-qa="cancel button"]').trigger('click');

        expect(store.commit).toBeCalledWith('popup/SHOW_POPUP', {
            ariaLabel: expect.any(String),
            componentName: 'ModalIncompleteData',
        });
    });
});
