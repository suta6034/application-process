import {
    mount,
} from '../../../../tests/app/vue/utils';

import ModalApiError from './ModalApiError';
import {
    // eslint-disable-next-line import/named
    __createMocks as createStoreMocks,
} from '../../../store';

jest.mock('../../../store');
jest.mock('../../../store/modules/components/popup');

let storeMocks;
let wrapper;

beforeEach(() => {
    storeMocks = createStoreMocks();
    storeMocks.store.state.popup.active = true;

    wrapper = mount(ModalApiError, {
        store: storeMocks.store,
        mocks: {
            $router: { resolve: () => ({ href: '' }) },
        },
    });
});

describe('ModalApiError', () => {
    test('It should render a div.', () => {
        expect(wrapper.is('div')).toBe(true);
    });

    test('It should hide the modal when clicking the confirm button.', () => {
        wrapper.find('[data-qa="confirm"]').trigger('click');

        expect(storeMocks.modules.popup.mutations.HIDE_POPUP).toBeCalled();
    });
});
