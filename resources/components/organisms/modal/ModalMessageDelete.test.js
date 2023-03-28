import {
    mount,
} from '../../../../tests/app/vue/utils';

import {
    // eslint-disable-next-line import/named
    __createMocks as createStoreMocks,
} from '../../../store';

import ModalMessageDelete from './ModalMessageDelete';

jest.mock('../../../store');
jest.mock('../../../store/modules/components/popup');

let storeMocks;
let wrapper;
let removeCallback;

beforeEach(() => {
    storeMocks = createStoreMocks();
    storeMocks.modules.popup.mutations.HIDE_POPUP.mockReset();
    storeMocks.store.state.popup.active = true;
    removeCallback = jest.fn();

    wrapper = mount(ModalMessageDelete, {
        store: storeMocks.store,
        propsData: {
            removeCallback,
            cancelCallback: jest.fn(), // just for calling the tracking() in parent
        },
    });
});

describe('ModalMessageDelete', () => {
    test('It should render a `<div>`.', () => {
        expect(wrapper.element.tagName).toBe('DIV');
    });

    test('It should render the default body.', () => {
        expect(wrapper.find('[data-qa="text default"]').exists()).toBe(true);
    });

    test('It should hide the modal when the cancel button is clicked.', async () => {
        await wrapper.find('[data-qa="cancel button"]').trigger('click');

        expect(storeMocks.modules.popup.mutations.HIDE_POPUP).toBeCalled();
    });

    test('It should call back remove function and hide the modal when remove button is clicked.', async () => {
        await wrapper.find('[data-qa="delete button"]').trigger('click');

        expect(removeCallback).toBeCalled();
        expect(storeMocks.modules.popup.mutations.HIDE_POPUP).toBeCalled();
    });
});
