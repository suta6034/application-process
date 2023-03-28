import {
    mount,
} from '../../../../tests/app/vue/utils';

import {
    // eslint-disable-next-line import/named
    __createMocks as createStoreMocks,
} from '../../../store';

import ModalMessageUnsent from './ModalMessageUnsent';

jest.mock('../../../store');
jest.mock('../../../store/modules/components/popup');

let storeMocks;
let wrapper;
let resetCallback;

beforeEach(() => {
    storeMocks = createStoreMocks();
    storeMocks.modules.popup.mutations.HIDE_POPUP.mockReset();
    storeMocks.store.state.popup.active = true;
    resetCallback = jest.fn();

    wrapper = mount(ModalMessageUnsent, {
        store: storeMocks.store,
        propsData: {
            messageData: {
                message: 'foo',
            },
            resetCallback,
        },
    });
});

describe('ModalMessageUnsent', () => {
    test('It should render a `<div>`.', () => {
        expect(wrapper.element.tagName).toBe('DIV');
    });

    test('It should render the default body.', () => {
        expect(wrapper.find('[data-qa="text default"]').exists()).toBe(true);
    });

    test('It should hide the modal when the cancel button is clicked.', () => {
        wrapper.find('[data-qa="cancel button"]').trigger('click');

        expect(storeMocks.modules.popup.mutations.HIDE_POPUP).toBeCalled();
    });

    test('It should keep the text and hide the modal when the Bearbeitung fortsetzen button is clicked.', async () => {
        await wrapper.find('[data-qa="keep button"]').trigger('click');

        expect(storeMocks.modules.popup.mutations.HIDE_POPUP).toBeCalled();
    });
});
